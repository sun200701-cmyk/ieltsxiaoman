import type { SupabaseClient, User } from "@supabase/supabase-js";

import type { RegularEnglishUsage } from "@/lib/types";

const DEFAULT_MONTHLY_FREE_TRIALS = 10;
const REGULAR_ENGLISH_TIME_ZONE = "Asia/Shanghai";

type RegularEnglishUsageRow = {
  user_id: string;
  free_trials_total: number;
  free_trials_used: number;
  usage_month: string;
};

function getCurrentUsageMonth() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: REGULAR_ENGLISH_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
  });

  const parts = formatter.formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value ?? "1970";
  const month = parts.find((part) => part.type === "month")?.value ?? "01";
  return `${year}-${month}-01`;
}

function mapUsageRow(row: RegularEnglishUsageRow): RegularEnglishUsage {
  const hasUnlimitedAccess = row.free_trials_total < 0;
  const freeTrialsRemaining = Math.max(row.free_trials_total - row.free_trials_used, 0);

  return {
    userId: row.user_id,
    freeTrialsTotal: row.free_trials_total,
    freeTrialsUsed: row.free_trials_used,
    freeTrialsRemaining,
    usageMonth: row.usage_month,
    hasUnlimitedAccess,
    hasAvailableAnalysis: hasUnlimitedAccess || freeTrialsRemaining > 0,
  };
}

export async function ensureRegularEnglishUsage(client: SupabaseClient, user: User) {
  const currentUsageMonth = getCurrentUsageMonth();

  const { data: existing, error: selectError } = await client
    .from("regular_english_usage_quotas")
    .select("user_id, free_trials_total, free_trials_used, usage_month")
    .eq("user_id", user.id)
    .maybeSingle<RegularEnglishUsageRow>();

  if (selectError) {
    throw selectError;
  }

  let row = existing;

  if (!row) {
    const defaultRow: RegularEnglishUsageRow = {
      user_id: user.id,
      free_trials_total: DEFAULT_MONTHLY_FREE_TRIALS,
      free_trials_used: 0,
      usage_month: currentUsageMonth,
    };

    const { data: inserted, error: insertError } = await client
      .from("regular_english_usage_quotas")
      .insert(defaultRow)
      .select("user_id, free_trials_total, free_trials_used, usage_month")
      .single<RegularEnglishUsageRow>();

    if (insertError || !inserted) {
      throw insertError ?? new Error("Failed to initialize regular English usage quota.");
    }

    row = inserted;
  }

  if (row.usage_month !== currentUsageMonth) {
    const { data: updated, error: updateError } = await client
      .from("regular_english_usage_quotas")
      .update({
        free_trials_total: DEFAULT_MONTHLY_FREE_TRIALS,
        free_trials_used: 0,
        usage_month: currentUsageMonth,
      })
      .eq("user_id", user.id)
      .select("user_id, free_trials_total, free_trials_used, usage_month")
      .single<RegularEnglishUsageRow>();

    if (updateError || !updated) {
      throw updateError ?? new Error("Failed to refresh regular English monthly usage quota.");
    }

    row = updated;
  }

  return mapUsageRow(row);
}

export async function consumeRegularEnglishAnalysisCredit(client: SupabaseClient, usage: RegularEnglishUsage) {
  if (usage.hasUnlimitedAccess) {
    return;
  }

  if (usage.freeTrialsRemaining <= 0) {
    throw new Error("No regular English analysis credits remaining.");
  }

  const { error } = await client
    .from("regular_english_usage_quotas")
    .update({
      free_trials_used: usage.freeTrialsUsed + 1,
    })
    .eq("user_id", usage.userId);

  if (error) {
    throw error;
  }
}
