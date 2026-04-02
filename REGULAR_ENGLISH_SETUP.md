# 口语素养模块数据库初始化

在 Supabase `SQL Editor` 中执行下面这段 SQL，用于创建“口语素养”独立的月度免费次数表。

```sql
create table if not exists public.regular_english_usage_quotas (
  user_id uuid primary key references auth.users (id) on delete cascade,
  free_trials_total integer not null default 10,
  free_trials_used integer not null default 0,
  usage_month date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_regular_english_usage_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists regular_english_usage_quotas_set_updated_at
on public.regular_english_usage_quotas;

create trigger regular_english_usage_quotas_set_updated_at
before update on public.regular_english_usage_quotas
for each row
execute function public.set_regular_english_usage_updated_at();
```

当前代码约定：

- 每个用户每个自然月 10 次免费分析
- 月份按 `Asia/Shanghai` 时区计算
- 该次数与现有雅思 `usage_quotas` 完全隔离
- 如果 `free_trials_total` 被设置为负数，例如 `-1`，前端会视为“口语素养会员无限次数”

如果你想手动给某个用户开通“口语素养会员无限次数”，可以执行类似 SQL：

```sql
update public.regular_english_usage_quotas reuq
set
  free_trials_total = -1,
  free_trials_used = 0,
  usage_month = date '2026-04-01'
from public.profiles p
where reuq.user_id = p.id
  and p.email = 'user@example.com';
```

如果这个用户还没有生成过口语素养额度记录，可以先插入：

```sql
insert into public.regular_english_usage_quotas (
  user_id,
  free_trials_total,
  free_trials_used,
  usage_month
)
select
  p.id,
  -1,
  0,
  date '2026-04-01'
from public.profiles p
where p.email = 'user@example.com'
on conflict (user_id) do update
set
  free_trials_total = excluded.free_trials_total,
  free_trials_used = excluded.free_trials_used,
  usage_month = excluded.usage_month;
```
