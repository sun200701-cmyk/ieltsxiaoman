import { NextResponse } from "next/server";

import {
  consumeAnalysisCredits,
  createSupabaseUserClient,
  ensureAccountUsage,
  getAvailableAnalysisCredits,
  getAuthenticatedUser,
} from "@/lib/account";
import { generateMockAiAssessment } from "@/lib/mock-ai-assessment";
import { generateMockDemoAssessment } from "@/lib/mock-demo-assessment";
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
    const usage = await ensureAccountUsage(supabase, user);

    if (!usage.hasActiveMembership) {
      return NextResponse.json<MockAssessmentApiResponse>(
        {
          ok: false,
          code: "membership_required",
          error: "Free 用户当前只能体验全真模考答题流程，生成正式 Mock Report 前需要先开通 Pro 或 Ultra。",
          phases: {
            transcription: {
              status: "success",
              message: `已拿到 ${transcripts.length} 道题的转写结果`,
              provider: "tencent-cloud",
            },
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
            transcription: {
              status: "success",
              message: `已拿到 ${transcripts.length} 道题的转写结果`,
              provider: "tencent-cloud",
            },
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

    const fallbackResult = generateMockDemoAssessment({
      session,
      transcripts,
      totalDurationSeconds,
      transcriptProvider: transcripts.some((item) => item.transcript.startsWith("[Transcript unavailable:"))
        ? "demo-fallback"
        : "tencent-cloud",
    });

    try {
      const result = await generateMockAiAssessment({
        session,
        transcripts,
        totalDurationSeconds,
      });

      await consumeAnalysisCredits(supabase, usage, answeredCount);
      return NextResponse.json<MockAssessmentApiResponse>({
        ok: true,
        result,
        phases: {
          transcription: {
            status: "success",
            message: `已使用 ${transcripts.length} 道题的转写结果`,
            provider: result.transcriptProvider,
          },
          assessment: {
            status: "success",
            message: "已按逐题分析 + 总结汇总生成完整 AI 报告",
            provider: result.provider,
          },
        },
      });
    } catch (error) {
      const reason = error instanceof Error ? error.message : "Unknown AI report error.";
      console.error("Mock report route failed, falling back to demo report.", error);
      await consumeAnalysisCredits(supabase, usage, answeredCount);
      return NextResponse.json<MockAssessmentApiResponse>({
        ok: true,
        result: fallbackResult,
        warnings: ["AI 报告生成失败，本次已自动切换为兜底报告。"],
        phases: {
          transcription: {
            status: "success",
            message: `已使用 ${transcripts.length} 道题的转写结果`,
            provider: fallbackResult.transcriptProvider,
          },
          assessment: {
            status: "fallback",
            message: "逐题分析或汇总阶段失败，已切换为兜底报告",
            reason,
            provider: "demo-fallback",
          },
        },
      });
    }
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
