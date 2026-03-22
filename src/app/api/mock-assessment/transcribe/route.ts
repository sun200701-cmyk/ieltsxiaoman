import { NextResponse } from "next/server";

import { createSupabaseUserClient, getAuthenticatedUser } from "@/lib/account";
import { transcribeWithTencentOrFallback } from "@/lib/demo-assessment";
import type {
  DemoQuestion,
  MockGenerationPhase,
  MockPromptTranscript,
  MockTestSession,
  MockTranscriptionApiResponse,
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
  const accessToken = getAccessToken(request);
  if (!accessToken) {
    return NextResponse.json<MockTranscriptionApiResponse>(
      {
        ok: false,
        code: "login_required",
        error: "登录后才能生成整套全真模考报告。",
        phases: {
          transcription: createPendingPhase("等待登录后开始转写"),
          assessment: createPendingPhase("等待转写完成后生成报告"),
        },
      },
      { status: 401 },
    );
  }

  try {
    const formData = await request.formData();
    const sessionRaw = formData.get("session");
    const metadataRaw = formData.get("metadata");

    if (typeof sessionRaw !== "string" || typeof metadataRaw !== "string") {
      return NextResponse.json<MockTranscriptionApiResponse>(
        {
          ok: false,
          code: "invalid_payload",
          error: "Mock session payload is missing.",
          phases: {
            transcription: { status: "failed", message: "转写阶段未开始", reason: "缺少 session 或 metadata。" },
            assessment: createPendingPhase("等待转写完成后生成报告"),
          },
        },
        { status: 400 },
      );
    }

    const supabase = createSupabaseUserClient(accessToken);
    await getAuthenticatedUser(supabase);

    const session = JSON.parse(sessionRaw) as MockTestSession;
    const metadata = JSON.parse(metadataRaw) as MockPromptTranscript[];
    const transcripts: MockPromptTranscript[] = [];
    const failedPromptIds: string[] = [];
    const reasons: string[] = [];

    for (let index = 0; index < metadata.length; index += 1) {
      const item = metadata[index];
      const audio = formData.get(`audio_${index}`);

      if (!(audio instanceof File)) {
        return NextResponse.json<MockTranscriptionApiResponse>(
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
          reasons.push(`${item.prompt}: ${error}`);
        }
      }

      transcripts.push({
        ...item,
        transcript,
      });
    }

    return NextResponse.json<MockTranscriptionApiResponse>({
      ok: true,
      transcripts,
      warnings: failedPromptIds.length ? ["部分题目转写失败，后续报告将自动降级。"] : [],
      phases: {
        transcription: failedPromptIds.length
          ? {
              status: "fallback",
              message: `转写完成，但有 ${failedPromptIds.length} 道题转写失败`,
              reason: reasons.join(" | "),
              provider: "demo-fallback",
              failedPromptIds,
            }
          : {
              status: "success",
              message: `转写完成，共处理 ${transcripts.length} 道题`,
              provider: "tencent-cloud",
            },
        assessment: createPendingPhase("转写完成后，可开始生成 AI 报告"),
      },
    });
  } catch (error) {
    console.error("Mock transcription route failed.", error);
    return NextResponse.json<MockTranscriptionApiResponse>(
      {
        ok: false,
        code: "transcription_failed",
        error: "录音转写失败，请稍后重试。",
        phases: {
          transcription: {
            status: "failed",
            message: "转写阶段失败",
            reason: error instanceof Error ? error.message : "Unknown server error.",
          },
          assessment: createPendingPhase("由于转写失败，未开始生成报告"),
        },
      },
      { status: 500 },
    );
  }
}
