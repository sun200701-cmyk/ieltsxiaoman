import { NextResponse } from "next/server";

import {
  createSupabaseUserClient,
  ensureAccountUsage,
  getAvailableAnalysisCredits,
  getAuthenticatedUser,
} from "@/lib/account";
import { getMockReportTask, startMockReportTask } from "@/lib/mock-report-task";
import type {
  MockAssessmentApiResponse,
  MockGenerationPhase,
  MockPromptTranscript,
  MockTestSession,
} from "@/lib/types";

function getAccessToken(request: Request) {
  const authorization = request.headers.get("authorization") || "";
  const token = authorization.replace(/^Bearer\s+/i, "").trim();
  return token || null;
}

function createPendingPhase(message: string): MockGenerationPhase {
  return { status: "pending", message };
}

function createTranscriptionPhase(transcripts: MockPromptTranscript[]): MockGenerationPhase {
  const transcriptProvider = transcripts.some((item) => item.transcript.startsWith("[Transcript unavailable:"))
    ? "demo-fallback"
    : "tencent-cloud";

  return transcriptProvider === "demo-fallback"
    ? {
        status: "fallback",
        message: `转写完成，共处理 ${transcripts.length} 道题，部分题目使用兜底 transcript`,
        provider: transcriptProvider,
      }
    : {
        status: "success",
        message: `转写完成，共处理 ${transcripts.length} 道题`,
        provider: transcriptProvider,
      };
}

export async function POST(request: Request) {
  const accessToken = getAccessToken(request);
  if (!accessToken) {
    return NextResponse.json<MockAssessmentApiResponse>(
      {
        ok: false,
        code: "login_required",
        error: "登录后才能生成整套全真模考报告。",
        phases: {
          transcription: createPendingPhase("转写阶段未开始"),
          assessment: createPendingPhase("等待登录后开始生成报告"),
        },
      },
      { status: 401 },
    );
  }

  try {
    const body = (await request.json()) as {
      session?: MockTestSession;
      transcripts?: MockPromptTranscript[];
      totalDurationSeconds?: number;
    };

    if (!body.session || !body.transcripts?.length) {
      return NextResponse.json<MockAssessmentApiResponse>(
        {
          ok: false,
          code: "invalid_payload",
          error: "缺少 session 或 transcripts，无法生成报告。",
          phases: {
            transcription: createPendingPhase("转写数据缺失"),
            assessment: {
              status: "failed",
              message: "AI 报告阶段未开始",
              reason: "缺少可用 transcripts。",
            },
          },
        },
        { status: 400 },
      );
    }

    const { session, transcripts, totalDurationSeconds = 0 } = body;
    const supabase = createSupabaseUserClient(accessToken);
    const user = await getAuthenticatedUser(supabase);
    const existingTask = getMockReportTask(session.id);

    if (existingTask && existingTask.userId === user.id) {
      return NextResponse.json<MockAssessmentApiResponse>({
        ...existingTask.response,
        taskId: existingTask.taskId,
      });
    }

    const usage = await ensureAccountUsage(supabase, user);

    if (!usage.hasActiveMembership) {
      return NextResponse.json<MockAssessmentApiResponse>(
        {
          ok: false,
          code: "membership_required",
          error: "Free 用户当前只能体验全真模考答题流程，生成正式 Mock Report 前需要先开通 Pro 或 Ultra。",
          phases: {
            transcription: createTranscriptionPhase(transcripts),
            assessment: {
              status: "failed",
              message: "AI 报告未开始",
              reason: "当前账号没有可用会员权限。",
            },
          },
        },
        { status: 403 },
      );
    }

    const answeredCount = transcripts.length;
    if (!usage.hasAvailableAnalysis || getAvailableAnalysisCredits(usage) < answeredCount) {
      return NextResponse.json<MockAssessmentApiResponse>(
        {
          ok: false,
          code: "quota_exceeded",
          error: `当前可用次数不足，本次全真模考需要消耗 ${answeredCount} 次额度。`,
          phases: {
            transcription: createTranscriptionPhase(transcripts),
            assessment: {
              status: "failed",
              message: "AI 报告未开始",
              reason: "当前账号剩余额度不足。",
            },
          },
        },
        { status: 403 },
      );
    }

    const task = startMockReportTask(user.id, {
      accessToken,
      session,
      transcripts,
      totalDurationSeconds,
      answeredCount,
    });

    return NextResponse.json<MockAssessmentApiResponse>(
      {
        ...task.response,
        taskId: task.taskId,
      },
      { status: task.created ? 202 : 200 },
    );
  } catch (error) {
    console.error("Mock report route failed.", error);
    return NextResponse.json<MockAssessmentApiResponse>(
      {
        ok: false,
        code: "report_failed",
        error: "AI 报告生成失败，请稍后重试。",
        phases: {
          transcription: createPendingPhase("转写结果未传入"),
          assessment: {
            status: "failed",
            message: "AI 报告阶段失败",
            reason: error instanceof Error ? error.message : "Unknown server error.",
          },
        },
      },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  const accessToken = getAccessToken(request);
  if (!accessToken) {
    return NextResponse.json<MockAssessmentApiResponse>(
      {
        ok: false,
        code: "login_required",
        error: "登录状态已失效，请重新登录后继续查看报告。",
        phases: {
          transcription: createPendingPhase("等待重新登录"),
          assessment: createPendingPhase("等待重新登录"),
        },
      },
      { status: 401 },
    );
  }

  try {
    const supabase = createSupabaseUserClient(accessToken);
    const user = await getAuthenticatedUser(supabase);
    const url = new URL(request.url);
    const taskId = url.searchParams.get("taskId") || url.searchParams.get("sessionId");

    if (!taskId) {
      return NextResponse.json<MockAssessmentApiResponse>(
        {
          ok: false,
          code: "invalid_task_id",
          error: "缺少 taskId，无法查询报告任务状态。",
          phases: {
            transcription: createPendingPhase("等待任务创建"),
            assessment: {
              status: "failed",
              message: "AI 报告状态查询失败",
              reason: "taskId 缺失。",
            },
          },
        },
        { status: 400 },
      );
    }

    const task = getMockReportTask(taskId);
    if (!task || task.userId !== user.id) {
      return NextResponse.json<MockAssessmentApiResponse>(
        {
          ok: false,
          code: "task_not_found",
          error: "未找到对应的报告任务，请重新提交生成。",
          taskId,
          phases: {
            transcription: createPendingPhase("任务不存在"),
            assessment: {
              status: "failed",
              message: "AI 报告任务不存在",
              reason: "任务可能已失效，或服务已重启。",
            },
          },
        },
        { status: 404 },
      );
    }

    return NextResponse.json<MockAssessmentApiResponse>({
      ...task.response,
      taskId: task.taskId,
    });
  } catch (error) {
    console.error("Mock report status route failed.", error);
    return NextResponse.json<MockAssessmentApiResponse>(
      {
        ok: false,
        code: "report_status_failed",
        error: "查询报告状态失败，请稍后重试。",
        phases: {
          transcription: createPendingPhase("状态未知"),
          assessment: {
            status: "failed",
            message: "AI 报告状态查询失败",
            reason: error instanceof Error ? error.message : "Unknown server error.",
          },
        },
      },
      { status: 500 },
    );
  }
}
