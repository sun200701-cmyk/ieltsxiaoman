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
import type { DemoQuestion, MockPromptTranscript, MockTestSession } from "@/lib/types";

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

export async function POST(request: Request) {
  const accessToken = getAccessToken(request);
  if (!accessToken) {
    return NextResponse.json(
      { code: "login_required", error: "登录后才能生成整套全真模考报告。" },
      { status: 401 },
    );
  }

  const formData = await request.formData();
  const sessionRaw = formData.get("session");
  const metadataRaw = formData.get("metadata");
  const totalDurationSeconds = Number(formData.get("totalDurationSeconds") ?? 0);

  if (typeof sessionRaw !== "string" || typeof metadataRaw !== "string") {
    return NextResponse.json({ error: "Mock session payload is missing." }, { status: 400 });
  }

  const session = JSON.parse(sessionRaw) as MockTestSession;
  const metadata = JSON.parse(metadataRaw) as MockPromptTranscript[];

  try {
    const supabase = createSupabaseUserClient(accessToken);
    const user = await getAuthenticatedUser(supabase);
    const usage = await ensureAccountUsage(supabase, user);

    if (!usage.hasActiveMembership) {
      return NextResponse.json(
        {
          code: "membership_required",
          error: "Free 用户当前仅可体验全真模考答题流程，生成正式 Mock Report 前需要先开通 Pro 或 Ultra。",
          usage,
        },
        { status: 403 },
      );
    }

    const answeredCount = metadata.length;

    if (!usage.hasAvailableAnalysis || getAvailableAnalysisCredits(usage) < answeredCount) {
      return NextResponse.json(
        {
          code: "quota_exceeded",
          error: `当前可用次数不足，本次全真模考需要消耗 ${answeredCount} 次额度。`,
          usage,
        },
        { status: 403 },
      );
    }

    const transcripts: MockPromptTranscript[] = [];

    for (let index = 0; index < metadata.length; index += 1) {
      const item = metadata[index];
      const audio = formData.get(`audio_${index}`);

      if (!(audio instanceof File)) {
        return NextResponse.json({ error: `Missing audio for prompt ${index + 1}.` }, { status: 400 });
      }

      const question = buildPromptQuestion(session.id, item);
      const { transcript, provider } = await transcribeWithTencentOrFallback(audio, question);

      if (provider === "demo-fallback") {
        return NextResponse.json(
          {
            code: "transcript_unavailable",
            error: "本次录音转写失败，系统已停止生成报告，未写入任何模拟 transcript 或默认评分。请稍后重试。",
          },
          { status: 503 },
        );
      }

      transcripts.push({
        ...item,
        transcript,
      });
    }

    try {
      const result = await generateMockAiAssessment({
        session,
        transcripts,
        totalDurationSeconds,
      });

      await consumeAnalysisCredits(supabase, usage, answeredCount);
      return NextResponse.json(result);
    } catch {
      return NextResponse.json(
        {
          code: "assessment_unavailable",
          error: "本次 AI 评分未成功生成，系统没有回填任何默认分数或默认点评。请稍后重试。",
        },
        { status: 503 },
      );
    }
  } catch {
    return NextResponse.json(
      { code: "login_required", error: "登录状态已失效，请重新登录后再试。" },
      { status: 401 },
    );
  }
}
