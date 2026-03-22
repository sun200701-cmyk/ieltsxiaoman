export type DemoQuestion = {
  id: string;
  slug: string;
  title: string;
  part: "Part 1" | "Part 2" | "Part 3";
  prompt: string;
  cueCard?: string;
  followUps: string[];
  tags: string[];
  timeLimitLabel: string;
  sampleAnswer?: string;
  sectionLabel?: string;
  isRequired?: boolean;
  linkedPart3Topic?: string;
  mockGroupKey?: string;
};

export type MembershipPlan = "free" | "pro" | "ultra";
export type MembershipStatus = "inactive" | "active" | "expired";

export type AddonPack = {
  id: string;
  creditsTotal: number;
  creditsUsed: number;
  creditsRemaining: number;
  expiresAt: string;
  createdAt: string;
  isActive: boolean;
};

export type AccountUsage = {
  userId: string;
  email: string | null;
  phone: string | null;
  freeTrialsTotal: number;
  freeTrialsUsed: number;
  freeTrialsRemaining: number;
  membershipPlan: MembershipPlan;
  membershipStatus: MembershipStatus;
  membershipExpiresAt: string | null;
  membershipQuotaTotal: number;
  membershipQuotaUsed: number;
  membershipQuotaRemaining: number;
  hasActiveMembership: boolean;
  activeAddonCreditsRemaining: number;
  activeAddonPacksCount: number;
  addonPacks: AddonPack[];
  canPurchaseAddon: boolean;
  hasAvailableAnalysis: boolean;
  passwordSet: boolean;
  requiresProfileSetup: boolean;
};

export type AssessmentResult = {
  overallBand: number;
  fluency: number;
  lexical: number;
  grammar: number;
  pronunciation: number;
  estimatedLevel: string;
  transcript: string;
  strengths: string[];
  nextSteps: string[];
  masteredPhrases: string[];
  examinerFeedback: string;
  targetBandGap: string;
  weeklyFocus: string[];
  dailyFifteenPlan: string[];
  scoreKillers: string[];
  sevenDaySprintPlan: string[];
  polishedVersion: string;
  provider: "tencent-cloud" | "demo-fallback" | "ai-scored";
  transcriptProvider?: "tencent-cloud" | "demo-fallback";
  completedAt: string;
  durationSeconds: number;
};

export type PracticeAttemptRecord = {
  id: string;
  question_title: string;
  part: string;
  overall_band: number;
  transcript: string | null;
  created_at: string;
};

export type MockPrompt = {
  id: string;
  part: "Part 1" | "Part 2" | "Part 3";
  title: string;
  topic: string;
  prompt: string;
  cuePoints: string[];
  timeLimitSeconds: number;
  prepSeconds?: number;
};

export type MockTestSession = {
  id: string;
  part1RequiredTheme: string;
  part1GeneralTheme: string;
  part2Topic: string;
  part3Topic: string;
  prompts: MockPrompt[];
};

export type MockCriterionBreakdown = {
  criterion: "Fluency" | "Lexical" | "Grammatical" | "Pronunciation";
  score: number;
  strengths: string[];
  weaknesses: string[];
  conclusion: string;
};

export type MockPartBreakdown = {
  part: "Part 1" | "Part 2" | "Part 3";
  topic: string;
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
};

export type MockPromptBreakdown = {
  id: string;
  part: "Part 1" | "Part 2" | "Part 3";
  topic: string;
  prompt: string;
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  conclusion: string;
  masteredPhrases: string[];
  polishedVersion: string;
};

export type MockPromptTranscript = {
  id: string;
  part: "Part 1" | "Part 2" | "Part 3";
  topic: string;
  prompt: string;
  transcript: string;
  durationSeconds: number;
};

export type MockAssessmentResult = {
  predictedOverallBand: number;
  fluency: number;
  lexical: number;
  grammar: number;
  pronunciation: number;
  completedAt: string;
  totalDurationSeconds: number;
  part1Theme: string;
  part2Topic: string;
  part3Topic: string;
  confidenceNote: string;
  criteria: MockCriterionBreakdown[];
  partBreakdowns: MockPartBreakdown[];
  promptBreakdowns: MockPromptBreakdown[];
  improvementPlan: string[];
  transcripts: MockPromptTranscript[];
  provider: "ai-scored" | "demo-fallback";
  transcriptProvider: "tencent-cloud" | "demo-fallback";
};

export type MockGenerationPhaseStatus = "pending" | "success" | "fallback" | "failed";

export type MockGenerationPhase = {
  status: MockGenerationPhaseStatus;
  message: string;
  reason?: string;
  provider?: string;
  failedPromptIds?: string[];
};

export type MockAssessmentApiResponse = {
  ok: boolean;
  code?: string;
  error?: string;
  result?: MockAssessmentResult;
  warnings?: string[];
  phases: {
    transcription: MockGenerationPhase;
    assessment: MockGenerationPhase;
  };
};

export type MockTranscriptionApiResponse = {
  ok: boolean;
  code?: string;
  error?: string;
  transcripts?: MockPromptTranscript[];
  warnings?: string[];
  phases: {
    transcription: MockGenerationPhase;
    assessment: MockGenerationPhase;
  };
};
