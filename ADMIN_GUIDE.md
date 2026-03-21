# 雅小满管理员操作说明

这份文档用于你上线后手动管理用户会员状态、次数和加量包。

当前后台管理方式：

- 用户在网站前台查看价格并联系客服付款
- 你在 Supabase 后台手动开通 `Pro` / `Ultra` / `加量包`

## 1. 进入后台

操作入口：

1. 打开 [Supabase](https://supabase.com)
2. 进入你的项目 `yaxiaoman`
3. 左侧点击 `SQL Editor`
4. 点击 `New query`
5. 粘贴下面对应的 SQL
6. 把 SQL 里的邮箱改成真实用户邮箱
7. 点击 `Run`

## 2. 当前套餐规则

### Free

- 5 次 AI 评分机会
- 只能体验题库模考
- 可以进入全真模考答题，但不能生成正式报告

### Pro

- 30 天有效
- 300 次
- 原价 `299`
- 限时优惠价 `99`

### Ultra

- 30 天有效
- 1000 次
- 原价 `899`
- 限时优惠价 `199`

### 加量包

- 30 天有效
- 200 次
- 原价 `279`
- 限时优惠价 `79`
- 仅限已开通 `Pro / Ultra` 的用户购买
- 多个加量包独立存在，按购买顺序依次扣减

## 3. 最常用操作

### 3.1 开通 Pro

```sql
update public.usage_quotas uq
set
  plan_type = 'pro',
  membership_status = 'active',
  membership_expires_at = now() + interval '30 days',
  membership_quota_total = 300,
  membership_quota_used = 0
from public.profiles p
where uq.user_id = p.id
  and p.email = 'user@example.com';
```

### 3.2 开通 Ultra

```sql
update public.usage_quotas uq
set
  plan_type = 'ultra',
  membership_status = 'active',
  membership_expires_at = now() + interval '30 days',
  membership_quota_total = 1000,
  membership_quota_used = 0
from public.profiles p
where uq.user_id = p.id
  and p.email = 'user@example.com';
```

### 3.3 给 Pro / Ultra 用户加一个加量包

```sql
insert into public.usage_addon_packs (
  user_id,
  quota_total,
  quota_used,
  expires_at
)
select
  p.id,
  200,
  0,
  now() + interval '30 days'
from public.profiles p
join public.usage_quotas uq on uq.user_id = p.id
where p.email = 'user@example.com'
  and uq.membership_status = 'active'
  and uq.plan_type in ('pro', 'ultra');
```

## 4. 其他常用操作

### 4.1 恢复为 Free

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

### 4.2 取消会员

```sql
update public.usage_quotas uq
set
  plan_type = 'free',
  membership_status = 'expired',
  membership_expires_at = now(),
  membership_quota_total = 0,
  membership_quota_used = 0
from public.profiles p
where uq.user_id = p.id
  and p.email = 'user@example.com';
```

### 4.3 重置 Free 用户的 5 次体验次数

```sql
update public.usage_quotas uq
set
  free_trials_total = 5,
  free_trials_used = 0
from public.profiles p
where uq.user_id = p.id
  and p.email = 'user@example.com';
```

## 5. 查询用户信息

### 5.1 查询某个用户当前会员状态

```sql
select
  p.email,
  uq.plan_type,
  uq.membership_status,
  uq.membership_expires_at,
  uq.free_trials_total,
  uq.free_trials_used,
  uq.membership_quota_total,
  uq.membership_quota_used
from public.profiles p
join public.usage_quotas uq on uq.user_id = p.id
where p.email = 'user@example.com';
```

### 5.2 查询某个用户的加量包

```sql
select
  p.email,
  uap.id,
  uap.quota_total,
  uap.quota_used,
  uap.expires_at,
  uap.created_at
from public.profiles p
join public.usage_addon_packs uap on uap.user_id = p.id
where p.email = 'user@example.com'
order by uap.created_at asc;
```

## 6. 实际操作流程

### 场景 1：用户付款后，给他开通 Pro

1. 先确认用户给你的邮箱
2. 打开 `SQL Editor`
3. 新建 query
4. 粘贴“开通 Pro”的 SQL
5. 把 `user@example.com` 改成对方真实邮箱
6. 点击 `Run`
7. 再执行一次“查询当前会员状态”的 SQL，确认是否生效

### 场景 2：用户付款后，给他开通 Ultra

步骤同上，只是把 SQL 换成“开通 Ultra”

### 场景 3：用户已经是 Pro / Ultra，继续买加量包

1. 确认对方当前已经是 `Pro` 或 `Ultra`
2. 执行“查询当前会员状态”
3. 确认 `membership_status = active`
4. 执行“加一个加量包”的 SQL
5. 执行“查询某个用户的加量包”确认已新增

## 7. 注意事项

1. 不要直接手动乱改数据库字段，优先使用这份文档里的 SQL 模板
2. Free 用户不能生成全真模考报告
3. `Pro / Ultra` 用户才能生成全真模考报告
4. 加量包只对 `Pro / Ultra` 用户开放
5. 每次执行 SQL 前，先确认邮箱没有写错
6. 每次执行 SQL 后，建议再跑一次查询语句确认结果

## 8. 文档位置

这份文档保存在项目根目录：

- [ADMIN_GUIDE.md](/D:/Projects_deepak/ieltsxiaoman/ADMIN_GUIDE.md)
