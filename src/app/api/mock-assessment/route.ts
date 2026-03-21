import { NextResponse } from "next/server";

import {
  consumeAnalysisCredits,
  createSupabaseUserClient,
  ensureAccountUsage,
  getAvailableAnalysisCredits,
  getAuthenticatedUser,
} from "@/lib/account";
import { buildFallbackMockAssessment, generateMockAiAssessment } from "@/lib/mock-ai-assessment";
import { transcribeWithTencentOrFallback } from "@/lib/demo-assessment";
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
      { code: "login_required", error: "登录后才能生成整套模考报告。" },
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
    let transcriptProvider: "tencent-cloud" | "demo-fallback" = "tencent-cloud";

    for (let index = 0; index < metadata.length; index += 1) {
      const item = metadata[index];
      const audio = formData.get(`audio_${index}`);

      if (!(audio instanceof File)) {
        return NextResponse.json({ error: `Missing audio for prompt ${index + 1}.` }, { status: 400 });
      }

      const question = buildPromptQuestion(session.id, item);
      const { transcript, provider } = await transcribeWithTencentOrFallback(audio, question);

      if (provider === "demo-fallback") {
        transcriptProvider = "demo-fallback";
      }

      transcripts.push({
        ...item,
        transcript,
      });
    }

    const fallback = buildFallbackMockAssessment({
      session,
      transcripts,
      totalDurationSeconds,
      transcriptProvider,
    });

    let result = fallback;

    try {
      const aiResult = await generateMockAiAssessment({
        session,
        transcripts,
        totalDurationSeconds,
      });

      result = {
        ...fallback,
        ...aiResult,
        completedAt: new Date().toISOString(),
        totalDurationSeconds,
        part1Theme: `${session.part1RequiredTheme} / ${session.part1GeneralTheme}`,
        part2Topic: session.part2Topic,
        part3Topic: session.part3Topic,
        transcripts,
        provider: "ai-scored",
        transcriptProvider,
      };
    } catch {
      result = fallback;
    }

    await consumeAnalysisCredits(supabase, usage, answeredCount);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { code: "login_required", error: "登录状态已失效，请重新登录后再试。" },
      { status: 401 },
    );
  }
}
