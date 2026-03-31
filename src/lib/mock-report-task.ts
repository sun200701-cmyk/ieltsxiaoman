import { generateMockAiAssessment } from "@/lib/mock-ai-assessment";
import { generateMockDemoAssessment } from "@/lib/mock-demo-assessment";
import type { AccountUsage } from "@/lib/types";
import type {
  MockAssessmentApiResponse,
  MockAssessmentResult,
  MockPromptTranscript,
  MockTestSession,
} from "@/lib/types";
import { consumeAnalysisCredits, createSupabaseUserClient, getAuthenticatedUser, ensureAccountUsage } from "@/lib/account";

type StartMockReportTaskOptions = {
  accessToken: string;
  session: MockTestSession;
  transcripts: MockPromptTranscript[];
  totalDurationSeconds: number;
  answeredCount: number;
};

type MockReportTaskRecord = {
  taskId: string;
  sessionId: string;
  userId: string;
  status: "pending" | "running" | "success" | "fallback" | "failed";
  response: MockAssessmentApiResponse;
  startedAt: string;
  updatedAt: string;
};

const reportTasks = new Map<string, MockReportTaskRecord>();

function cloneResponse(response: MockAssessmentApiResponse): MockAssessmentApiResponse {
  return JSON.parse(JSON.stringify(response)) as MockAssessmentApiResponse;
}

function createTranscriptionPhase(transcripts: MockPromptTranscript[]) {
  const transcriptProvider = transcripts.some((item) => item.transcript.startsWith("[Transcript unavailable:"))
    ? "demo-fallback"
    : "tencent-cloud";

  return transcriptProvider === "demo-fallback"
    ? {
        status: "fallback" as const,
        message: `转写完成，共处理 ${transcripts.length} 道题，部分题目使用兜底 transcript`,
        provider: transcriptProvider,
      }
    : {
        status: "success" as const,
        message: `转写完成，共处理 ${transcripts.length} 道题`,
        provider: transcriptProvider,
      };
}

function createPendingResponse(options: Pick<StartMockReportTaskOptions, "session" | "transcripts">): MockAssessmentApiResponse {
  return {
    ok: true,
    taskId: options.session.id,
    warnings: [],
    phases: {
      transcription: createTranscriptionPhase(options.transcripts),
      assessment: {
        status: "pending",
        message: "报告任务已创建，等待后台开始生成",
      },
    },
  };
}

function createTaskRecord(taskId: string, userId: string, response: MockAssessmentApiResponse): MockReportTaskRecord {
  const now = new Date().toISOString();

  return {
    taskId,
    sessionId: taskId,
    userId,
    status: "pending",
    response,
    startedAt: now,
    updatedAt: now,
  };
}

function updateTask(taskId: string, updater: (current: MockReportTaskRecord) => MockReportTaskRecord) {
  const current = reportTasks.get(taskId);
  if (!current) {
    return null;
  }

  const next = updater(current);
  reportTasks.set(taskId, next);
  return next;
}

function createRunningResponse(record: MockReportTaskRecord): MockAssessmentApiResponse {
  return {
    ...cloneResponse(record.response),
    taskId: record.taskId,
    phases: {
      ...record.response.phases,
      assessment: {
        status: "pending",
        message: "AI 报告正在后台生成，请保持当前页面等待轮询结果",
      },
    },
  };
}

function createCompletedResponse(
  taskId: string,
  transcripts: MockPromptTranscript[],
  result: MockAssessmentResult,
  warnings: string[] = [],
): MockAssessmentApiResponse {
  return {
    ok: true,
    taskId,
    result,
    warnings,
    phases: {
      transcription: {
        status: transcripts.some((item) => item.transcript.startsWith("[Transcript unavailable:")) ? "fallback" : "success",
        message: `转写完成，共处理 ${transcripts.length} 道题`,
        provider: result.transcriptProvider,
      },
      assessment: {
        status: result.provider === "demo-fallback" ? "fallback" : "success",
        message: result.provider === "demo-fallback" ? "AI 报告生成异常，已切换为兜底报告" : "完整 AI 报告已生成完成",
        provider: result.provider,
      },
    },
  };
}

function createFailedResponse(
  taskId: string,
  transcripts: MockPromptTranscript[],
  error: unknown,
): MockAssessmentApiResponse {
  return {
    ok: false,
    taskId,
    code: "report_failed",
    error: "AI 报告生成失败，请稍后重试。",
    phases: {
      transcription: createTranscriptionPhase(transcripts),
      assessment: {
        status: "failed",
        message: "AI 报告阶段失败",
        reason: error instanceof Error ? error.message : "Unknown server error.",
      },
    },
  };
}

async function refreshUsageSnapshot(accessToken: string): Promise<AccountUsage> {
  const supabase = createSupabaseUserClient(accessToken);
  const user = await getAuthenticatedUser(supabase);
  return ensureAccountUsage(supabase, user);
}

async function runTask(taskId: string, options: StartMockReportTaskOptions) {
  updateTask(taskId, (current) => ({
    ...current,
    status: "running",
    updatedAt: new Date().toISOString(),
    response: createRunningResponse(current),
  }));

  const fallbackResult = generateMockDemoAssessment({
    session: options.session,
    transcripts: options.transcripts,
    totalDurationSeconds: options.totalDurationSeconds,
    transcriptProvider: options.transcripts.some((item) => item.transcript.startsWith("[Transcript unavailable:"))
      ? "demo-fallback"
      : "tencent-cloud",
  });

  try {
    const result = await generateMockAiAssessment({
      session: options.session,
      transcripts: options.transcripts,
      totalDurationSeconds: options.totalDurationSeconds,
    });

    const latestUsage = await refreshUsageSnapshot(options.accessToken);
    const supabase = createSupabaseUserClient(options.accessToken);
    await consumeAnalysisCredits(supabase, latestUsage, options.answeredCount);

    updateTask(taskId, (current) => ({
      ...current,
      status: "success",
      updatedAt: new Date().toISOString(),
      response: createCompletedResponse(taskId, options.transcripts, result),
    }));
  } catch (error) {
    const latestUsage = await refreshUsageSnapshot(options.accessToken);
    const supabase = createSupabaseUserClient(options.accessToken);

    try {
      await consumeAnalysisCredits(supabase, latestUsage, options.answeredCount);
      updateTask(taskId, (current) => ({
        ...current,
        status: "fallback",
        updatedAt: new Date().toISOString(),
        response: createCompletedResponse(taskId, options.transcripts, fallbackResult, ["AI 报告生成失败，本次已自动切换为兜底报告。"]),
      }));
    } catch (consumeError) {
      console.error("Mock report task failed while consuming credits.", consumeError);
      updateTask(taskId, (current) => ({
        ...current,
        status: "failed",
        updatedAt: new Date().toISOString(),
        response: createFailedResponse(taskId, options.transcripts, error),
      }));
    }
  }
}

export function getMockReportTask(taskId: string) {
  const record = reportTasks.get(taskId);
  if (!record) {
    return null;
  }

  return {
    ...record,
    response: cloneResponse(record.response),
  };
}

export function startMockReportTask(userId: string, options: StartMockReportTaskOptions) {
  const taskId = options.session.id;
  const existing = reportTasks.get(taskId);

  if (existing && ["pending", "running", "success", "fallback"].includes(existing.status)) {
    return {
      taskId,
      created: false,
      response: cloneResponse(existing.response),
    };
  }

  const initialResponse = createPendingResponse(options);
  const record = createTaskRecord(taskId, userId, initialResponse);
  reportTasks.set(taskId, record);

  void runTask(taskId, options).catch((error) => {
    console.error("Mock report background task crashed.", error);
    updateTask(taskId, (current) => ({
      ...current,
      status: "failed",
      updatedAt: new Date().toISOString(),
      response: createFailedResponse(taskId, options.transcripts, error),
    }));
  });

  return {
    taskId,
    created: true,
    response: cloneResponse(initialResponse),
  };
}
