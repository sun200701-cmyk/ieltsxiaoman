import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

import type { AccountUsage, AddonPack, MembershipPlan, MembershipStatus } from "@/lib/types";

const DEFAULT_FREE_TRIALS = 5;

type UsageQuotaRow = {
  user_id: string;
  free_trials_total: number;
  free_trials_used: number;
  plan_type: MembershipPlan;
  membership_status: MembershipStatus;
  membership_expires_at: string | null;
  membership_quota_total: number;
  membership_quota_used: number;
};

type UsageAddonPackRow = {
  id: string;
  user_id: string;
  quota_total: number;
  quota_used: number;
  expires_at: string;
  created_at: string;
};

type ProfileRow = {
  id: string;
  email: string | null;
  phone: string | null;
  password_set: boolean | null;
};

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase environment variables are missing.");
  }

  return { url, anonKey };
}

export function createSupabaseUserClient(accessToken: string) {
  const { url, anonKey } = getSupabaseConfig();

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}

export function isMembershipActive(
  row: Pick<UsageQuotaRow, "membership_status" | "membership_expires_at">,
) {
  if (row.membership_status !== "active" || !row.membership_expires_at) {
    return false;
  }

  return new Date(row.membership_expires_at).getTime() > Date.now();
}

function mapAddonPack(row: UsageAddonPackRow): AddonPack {
  const creditsRemaining = Math.max(row.quota_total - row.quota_used, 0);
  const isActive = new Date(row.expires_at).getTime() > Date.now() && creditsRemaining > 0;

  return {
    id: row.id,
    creditsTotal: row.quota_total,
    creditsUsed: row.quota_used,
    creditsRemaining,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    isActive,
  };
}

export function mapUsageRowToAccountUsage(
  user: User,
  row: UsageQuotaRow,
  profile: ProfileRow | null,
  addonRows: UsageAddonPackRow[],
): AccountUsage {
  const hasActiveMembership = isMembershipActive(row);
  const freeTrialsRemaining = Math.max(row.free_trials_total - row.free_trials_used, 0);
  const membershipQuotaRemaining = hasActiveMembership
    ? Math.max(row.membership_quota_total - row.membership_quota_used, 0)
    : 0;
  const addonPacks = addonRows
    .map(mapAddonPack)
    .sort((left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime());
  const activeAddonCreditsRemaining = addonPacks
    .filter((pack) => pack.isActive)
    .reduce((sum, pack) => sum + pack.creditsRemaining, 0);
  const phone = profile?.phone ?? null;
  const passwordSet = Boolean(profile?.password_set);
  const membershipStatus =
    hasActiveMembership
      ? "active"
      : row.membership_status === "active"
        ? "expired"
        : row.membership_status;

  return {
    userId: user.id,
    email: user.email ?? null,
    phone,
    freeTrialsTotal: row.free_trials_total,
    freeTrialsUsed: row.free_trials_used,
    freeTrialsRemaining,
    membershipPlan: row.plan_type,
    membershipStatus,
    membershipExpiresAt: row.membership_expires_at,
    membershipQuotaTotal: row.membership_quota_total,
    membershipQuotaUsed: row.membership_quota_used,
    membershipQuotaRemaining,
    hasActiveMembership,
    activeAddonCreditsRemaining,
    activeAddonPacksCount: addonPacks.filter((pack) => pack.isActive).length,
    addonPacks,
    canPurchaseAddon: hasActiveMembership && (row.plan_type === "pro" || row.plan_type === "ultra"),
    hasAvailableAnalysis:
      freeTrialsRemaining > 0 || membershipQuotaRemaining > 0 || activeAddonCreditsRemaining > 0,
    passwordSet,
    requiresProfileSetup: false,
  };
}

export async function getAuthenticatedUser(client: SupabaseClient) {
  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }

  return user;
}

async function getProfile(client: SupabaseClient, userId: string) {
  const { data, error } = await client
    .from("profiles")
    .select("id, email, phone, password_set")
    .eq("id", userId)
    .single<ProfileRow>();

  if (error) {
    throw error;
  }

  return data;
}

async function getAddonPacks(client: SupabaseClient, userId: string) {
  const { data, error } = await client
    .from("usage_addon_packs")
    .select("id, user_id, quota_total, quota_used, expires_at, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .returns<UsageAddonPackRow[]>();

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function ensureAccountUsage(client: SupabaseClient, user: User) {
  await client.from("profiles").upsert(
    {
      id: user.id,
      email: user.email ?? null,
    },
    {
      onConflict: "id",
    },
  );

  const profile = await getProfile(client, user.id);

  const { data: existing, error: selectError } = await client
    .from("usage_quotas")
    .select(
      "user_id, free_trials_total, free_trials_used, plan_type, membership_status, membership_expires_at, membership_quota_total, membership_quota_used",
    )
    .eq("user_id", user.id)
    .maybeSingle<UsageQuotaRow>();

  if (selectError) {
    throw selectError;
  }

  let row = existing;

  if (!row) {
    const defaultRow: UsageQuotaRow = {
      user_id: user.id,
      free_trials_total: DEFAULT_FREE_TRIALS,
      free_trials_used: 0,
      plan_type: "free",
      membership_status: "inactive",
      membership_expires_at: null,
      membership_quota_total: 0,
      membership_quota_used: 0,
    };

    const { data: inserted, error: insertError } = await client
      .from("usage_quotas")
      .insert(defaultRow)
      .select(
        "user_id, free_trials_total, free_trials_used, plan_type, membership_status, membership_expires_at, membership_quota_total, membership_quota_used",
      )
      .single<UsageQuotaRow>();

    if (insertError || !inserted) {
      throw insertError ?? new Error("Failed to initialize usage quota.");
    }

    row = inserted;
  }

  if (row.membership_status === "active" && row.membership_expires_at) {
    const expired = new Date(row.membership_expires_at).getTime() <= Date.now();

    if (expired) {
      const { data: updated, error: updateError } = await client
        .from("usage_quotas")
        .update({
          membership_status: "expired",
          membership_quota_total: 0,
          membership_quota_used: 0,
        })
        .eq("user_id", user.id)
        .select(
          "user_id, free_trials_total, free_trials_used, plan_type, membership_status, membership_expires_at, membership_quota_total, membership_quota_used",
        )
        .single<UsageQuotaRow>();

      if (updateError || !updated) {
        throw updateError ?? new Error("Failed to expire membership.");
      }

      row = updated;
    }
  }

  const addonPacks = await getAddonPacks(client, user.id);
  return mapUsageRowToAccountUsage(user, row, profile, addonPacks);
}

export async function consumeAnalysisCredit(client: SupabaseClient, usage: AccountUsage) {
  if (usage.hasActiveMembership && usage.membershipQuotaRemaining > 0) {
    const { error } = await client
      .from("usage_quotas")
      .update({
        membership_quota_used: usage.membershipQuotaUsed + 1,
      })
      .eq("user_id", usage.userId);

    if (error) {
      throw error;
    }

    return "membership";
  }

  const activeAddonPack = usage.addonPacks.find((pack) => pack.isActive && pack.creditsRemaining > 0);

  if (activeAddonPack) {
    const { error } = await client
      .from("usage_addon_packs")
      .update({
        quota_used: activeAddonPack.creditsUsed + 1,
      })
      .eq("id", activeAddonPack.id)
      .eq("user_id", usage.userId);

    if (error) {
      throw error;
    }

    return "addon";
  }

  if (usage.freeTrialsRemaining > 0) {
    const { error } = await client
      .from("usage_quotas")
      .update({
        free_trials_used: usage.freeTrialsUsed + 1,
      })
      .eq("user_id", usage.userId);

    if (error) {
      throw error;
    }

    return "free";
  }

  throw new Error("No analysis credits remaining.");
}

export function getAvailableAnalysisCredits(usage: AccountUsage) {
  return usage.freeTrialsRemaining + usage.membershipQuotaRemaining + usage.activeAddonCreditsRemaining;
}

export async function consumeAnalysisCredits(client: SupabaseClient, usage: AccountUsage, count: number) {
  const remainingUsage = {
    ...usage,
    addonPacks: usage.addonPacks.map((pack) => ({ ...pack })),
  };

  for (let index = 0; index < count; index += 1) {
    const source = await consumeAnalysisCredit(client, remainingUsage);

    if (source === "membership") {
      remainingUsage.membershipQuotaUsed += 1;
      remainingUsage.membershipQuotaRemaining = Math.max(0, remainingUsage.membershipQuotaRemaining - 1);
      continue;
    }

    if (source === "addon") {
      const targetPack = remainingUsage.addonPacks.find((pack) => pack.isActive && pack.creditsRemaining > 0);
      if (targetPack) {
        targetPack.creditsUsed += 1;
        targetPack.creditsRemaining = Math.max(0, targetPack.creditsRemaining - 1);
        remainingUsage.activeAddonCreditsRemaining = Math.max(0, remainingUsage.activeAddonCreditsRemaining - 1);
      }
      continue;
    }

    remainingUsage.freeTrialsUsed += 1;
    remainingUsage.freeTrialsRemaining = Math.max(0, remainingUsage.freeTrialsRemaining - 1);
  }
}
