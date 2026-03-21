# XiaoMan Speak

雅小满 IELTS 口语练习站，技术栈为 Next.js + TypeScript + Tailwind + Supabase + 腾讯云 ASR + AI 评分。

## 当前能力

- 游客可以浏览题库和录音
- 登录用户才能触发真实语音转文字和 AI 评分
- 免费用户默认 5 次分析额度
- Pro：39 元 / 30 天 / 500 次
- Ultra：79 元 / 30 天 / 1500 次
- 加量包：39 元 / 30 天 / 500 次，仅 Pro / Ultra 用户可购买
- 扣减顺序：先扣会员主额度，再按购买顺序扣独立加量包
- 登录用户可以查看历史记录

## 本地启动

```bash
npm install
npm run dev
```

把 `.env.example` 复制为 `.env.local`，并填写环境变量。

## 环境变量

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
TENCENT_SECRET_ID=
TENCENT_SECRET_KEY=
TENCENT_ASR_REGION=ap-shanghai
TENCENT_ASR_ENGINE_TYPE=16k_en
OPENAI_API_KEY=
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini
```

## Supabase SQL

如果你是第一次建表，直接在 Supabase 的 SQL Editor 里执行下面整段。

```sql
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  phone text unique,
  password_set boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.usage_quotas (
  user_id uuid primary key references auth.users(id) on delete cascade,
  free_trials_total integer not null default 5,
  free_trials_used integer not null default 0,
  plan_type text not null default 'free' check (plan_type in ('free', 'pro', 'ultra')),
  membership_status text not null default 'inactive' check (membership_status in ('inactive', 'active', 'expired')),
  membership_expires_at timestamptz,
  membership_quota_total integer not null default 0,
  membership_quota_used integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.usage_addon_packs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quota_total integer not null default 500,
  quota_used integer not null default 0,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.practice_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  question_id text not null,
  question_title text not null,
  part text not null,
  overall_band numeric(2, 1) not null,
  transcript text,
  feedback jsonb not null default '{}'::jsonb,
  duration_seconds integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.payment_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_type text not null check (plan_type in ('pro', 'ultra', 'addon_pack')),
  amount numeric(10, 2),
  status text not null default 'pending' check (status in ('pending', 'paid', 'cancelled')),
  note text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.usage_quotas enable row level security;
alter table public.usage_addon_packs enable row level security;
alter table public.practice_attempts enable row level security;
alter table public.payment_orders enable row level security;

create policy "Users can read own profile"
on public.profiles
for select
using (auth.uid() = id);

create policy "Users can upsert own profile"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id);

create policy "Users can read own quota"
on public.usage_quotas
for select
using (auth.uid() = user_id);

create policy "Users can insert own quota"
on public.usage_quotas
for insert
with check (auth.uid() = user_id);

create policy "Users can update own quota"
on public.usage_quotas
for update
using (auth.uid() = user_id);

create policy "Users can read own addon packs"
on public.usage_addon_packs
for select
using (auth.uid() = user_id);

create policy "Users can insert own addon packs"
on public.usage_addon_packs
for insert
with check (auth.uid() = user_id);

create policy "Users can update own addon packs"
on public.usage_addon_packs
for update
using (auth.uid() = user_id);

create policy "Users can read own attempts"
on public.practice_attempts
for select
using (auth.uid() = user_id);

create policy "Users can insert own attempts"
on public.practice_attempts
for insert
with check (auth.uid() = user_id);

create policy "Users can read own payment orders"
on public.payment_orders
for select
using (auth.uid() = user_id);

create policy "Users can insert own payment orders"
on public.payment_orders
for insert
with check (auth.uid() = user_id);
```

## 已有老库的迁移 SQL

如果你之前已经执行过旧版 SQL，请再执行下面这段迁移：

```sql
alter table public.profiles
add column if not exists phone text unique;

alter table public.profiles
add column if not exists password_set boolean not null default false;

alter table public.usage_quotas
alter column plan_type type text;

alter table public.usage_quotas
drop constraint if exists usage_quotas_plan_type_check;

alter table public.usage_quotas
add constraint usage_quotas_plan_type_check
check (plan_type in ('free', 'pro', 'ultra'));

alter table public.usage_quotas
add column if not exists membership_quota_total integer not null default 0;

alter table public.usage_quotas
add column if not exists membership_quota_used integer not null default 0;

create table if not exists public.usage_addon_packs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quota_total integer not null default 500,
  quota_used integer not null default 0,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.usage_addon_packs enable row level security;

drop policy if exists "Users can read own addon packs" on public.usage_addon_packs;
drop policy if exists "Users can insert own addon packs" on public.usage_addon_packs;
drop policy if exists "Users can update own addon packs" on public.usage_addon_packs;

create policy "Users can read own addon packs"
on public.usage_addon_packs
for select
using (auth.uid() = user_id);

create policy "Users can insert own addon packs"
on public.usage_addon_packs
for insert
with check (auth.uid() = user_id);

create policy "Users can update own addon packs"
on public.usage_addon_packs
for update
using (auth.uid() = user_id);
```

## 管理员后台手动操作

所有手动开通，都在 Supabase 网页后台的 `SQL Editor` 里执行。

### 1. 开通 Pro

```sql
update public.usage_quotas uq
set
  plan_type = 'pro',
  membership_status = 'active',
  membership_expires_at = now() + interval '30 days',
  membership_quota_total = 500,
  membership_quota_used = 0
from public.profiles p
where uq.user_id = p.id
  and p.email = 'user@example.com';
```

### 2. 开通 Ultra

```sql
update public.usage_quotas uq
set
  plan_type = 'ultra',
  membership_status = 'active',
  membership_expires_at = now() + interval '30 days',
  membership_quota_total = 1500,
  membership_quota_used = 0
from public.profiles p
where uq.user_id = p.id
  and p.email = 'user@example.com';
```

### 3. 给 Pro / Ultra 用户加一个加量包

```sql
insert into public.usage_addon_packs (
  user_id,
  quota_total,
  quota_used,
  expires_at
)
select
  p.id,
  500,
  0,
  now() + interval '30 days'
from public.profiles p
join public.usage_quotas uq on uq.user_id = p.id
where p.email = 'user@example.com'
  and uq.membership_status = 'active'
  and uq.plan_type in ('pro', 'ultra');
```

### 4. 重置免费次数

```sql
update public.usage_quotas uq
set
  free_trials_total = 5,
  free_trials_used = 0,
  plan_type = 'free',
  membership_status = 'inactive',
  membership_expires_at = null,
  membership_quota_total = 0,
  membership_quota_used = 0
from public.profiles p
where uq.user_id = p.id
  and p.email = 'user@example.com';
```

### 5. 取消会员

```sql
update public.usage_quotas uq
set
  membership_status = 'expired',
  membership_expires_at = now(),
  membership_quota_total = 0,
  membership_quota_used = 0
from public.profiles p
where uq.user_id = p.id
  and p.email = 'user@example.com';
```

## 当前登录规则

- 第一次注册：邮箱链接
- 第一次登录成功后：必须填写手机号并设置密码
- 后续登录：邮箱 + 密码
- 如果用户还没补完资料，仍可继续用邮箱链接进入
- 未登录用户可以录音，但点击 `Analyze Answer` 时会要求登录
