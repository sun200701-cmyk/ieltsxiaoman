import { NextResponse } from "next/server";

import {
  consumeAnalysisCredits,
  createSupabaseUserClient,
  ensureAccountUsage,
  getAvailableAnalysisCredits,
  getAuthenticatedUser,
} from "@/lib/account";
import { transcribeWithTencentOrFallback } from "@/lib/demo-assessment";
import { generateMockAiAssessment } from "@/lib/mock-ai-assessment";
import { generateMockDemoAssessment } from "@/lib/mock-demo-assessment";
import type {
  DemoQuestion,
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

function buildPromptQuestion(sessionId: string, item: MockPromptTranscript): DemoQuestion {
  return {
    id: `${sessionId}-${item.id}`,
    slug: item.id,
    title: item.topic,
    part: item.part,
    prompt: item.prompt,
    followUps: [],
    tags: [item.part],
    timeLimitLabel: `${Math.round(item.durationSeconds)} sec`,
    sectionLabel: item.part,
  };
}

function createPendingPhase(message: string): MockGenerationPhase {
  return { status: "pending", message };
}

export async function POST(request: Request) {
  const pendingPhases = {
    transcription: createPendingPhase("等待开始转写"),
    assessment: createPendingPhase("等待开始生成报告"),
  };

  const accessToken = getAccessToken(request);
  if (!accessToken) {
    return NextResponse.json<MockAssessmentApiResponse>(
      {
        ok: false,
        code: "login_required",
        error: "登录后才能生成整套全真模考报告。",
        phases: pendingPhases,
      },
      { status: 401 },
    );
  }

  try {
    const formData = await request.formData();
    const sessionRaw = formData.get("session");
    const metadataRaw = formData.get("metadata");
    const totalDurationSeconds = Number(formData.get("totalDurationSeconds") ?? 0);

    if (typeof sessionRaw !== "string" || typeof metadataRaw !== "string") {
      return NextResponse.json<MockAssessmentApiResponse>(
        {
          ok: false,
          code: "invalid_payload",
          error: "Mock session payload is missing.",
          phases: pendingPhases,
        },
        { status: 400 },
      );
    }

    const session = JSON.parse(sessionRaw) as MockTestSession;
    const metadata = JSON.parse(metadataRaw) as MockPromptTranscript[];

    const supabase = createSupabaseUserClient(accessToken);
    const user = await getAuthenticatedUser(supabase);
    const usage = await ensureAccountUsage(supabase, user);

    if (!usage.hasActiveMembership) {
      return NextResponse.json<MockAssessmentApiResponse>(
        {
          ok: false,
          code: "membership_required",
          error: "Free 用户当前只能体验全真模考答题流程，生成正式 Mock Report 前需要先开通 Pro 或 Ultra。",
          phases: pendingPhases,
        },
        { status: 403 },
      );
    }

    const answeredCount = metadata.length;
    if (!usage.hasAvailableAnalysis || getAvailableAnalysisCredits(usage) < answeredCount) {
      return NextResponse.json<MockAssessmentApiResponse>(
        {
          ok: false,
          code: "quota_exceeded",
          error: `当前可用次数不足，本次全真模考需要消耗 ${answeredCount} 次额度。`,
          phases: pendingPhases,
        },
        { status: 403 },
      );
    }

    const transcripts: MockPromptTranscript[] = [];
    const failedPromptIds: string[] = [];
    const transcriptionReasons: string[] = [];

    for (let index = 0; index < metadata.length; index += 1) {
      const item = metadata[index];
      const audio = formData.get(`audio_${index}`);

      if (!(audio instanceof File)) {
        return NextResponse.json<MockAssessmentApiResponse>(
          {
            ok: false,
            code: "missing_audio",
            error: `缺少第 ${index + 1} 题录音文件。`,
            phases: {
              transcription: {
                status: "failed",
                message: "转写阶段中断",
                reason: `audio_${index} 未上传成功。`,
                failedPromptIds: [item.id],
              },
              assessment: createPendingPhase("由于转写失败，未开始生成报告"),
            },
          },
          { status: 400 },
        );
      }

      const question = buildPromptQuestion(session.id, item);
      const { transcript, provider, error } = await transcribeWithTencentOrFallback(audio, question);

      if (provider === "demo-fallback") {
        failedPromptIds.push(item.id);
        if (error) {
          transcriptionReasons.push(`${item.prompt}: ${error}`);
        }
      }

      transcripts.push({
        ...item,
        transcript,
      });
    }

    const fallbackResult = generateMockDemoAssessment({
      session,
      transcripts,
      totalDurationSeconds,
      transcriptProvider: failedPromptIds.length ? "demo-fallback" : "tencent-cloud",
    });

    if (failedPromptIds.length) {
      await consumeAnalysisCredits(supabase, usage, answeredCount);
      return NextResponse.json<MockAssessmentApiResponse>({
        ok: true,
        result: fallbackResult,
        warnings: ["部分题目转写失败，本次已自动降级为兜底版报告。"],
        phases: {
          transcription: {
            status: "fallback",
            message: `转写完成，但有 ${failedPromptIds.length} 道题转写失败`,
            reason: transcriptionReasons.join(" | "),
            provider: "demo-fallback",
            failedPromptIds,
          },
          assessment: {
            status: "fallback",
            message: "由于转写不完整，本次使用兜底版报告",
            reason: "完整 AI 报告依赖每道题的可用 transcript。",
            provider: "demo-fallback",
          },
        },
      });
    }

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
            message: `转写完成，共处理 ${transcripts.length} 道题`,
            provider: "tencent-cloud",
          },
          assessment: {
            status: "success",
            message: "AI 报告生成完成",
            provider: "ai-scored",
          },
        },
      });
    } catch (error) {
      const reason = error instanceof Error ? error.message : "AI assessment failed.";
      console.error("Mock AI assessment failed, falling back to demo report.", error);
      await consumeAnalysisCredits(supabase, usage, answeredCount);
      return NextResponse.json<MockAssessmentApiResponse>({
        ok: true,
        result: fallbackResult,
        warnings: ["AI 报告生成失败，本次已自动降级为兜底版报告。"],
        phases: {
          transcription: {
            status: "success",
            message: `转写完成，共处理 ${transcripts.length} 道题`,
            provider: "tencent-cloud",
          },
          assessment: {
            status: "fallback",
            message: "AI 报告生成失败，已切换为兜底版报告",
            reason,
            provider: "demo-fallback",
          },
        },
      });
    }
  } catch (error) {
    console.error("Mock assessment route failed.", error);
    return NextResponse.json<MockAssessmentApiResponse>(
      {
        ok: false,
        code: "mock_assessment_failed",
        error: "Mock Report 生成失败，请稍后重试。",
        phases: {
          transcription: createPendingPhase("转写阶段未完成"),
          assessment: {
            status: "failed",
            message: "报告生成未完成",
            reason: error instanceof Error ? error.message : "Unknown server error.",
          },
        },
      },
      { status: 500 },
    );
  }
}
