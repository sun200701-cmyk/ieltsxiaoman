import { NextResponse } from "next/server";

import {
  consumeAnalysisCredit,
  createSupabaseUserClient,
  ensureAccountUsage,
  getAuthenticatedUser,
} from "@/lib/account";
import { generateAiAssessment } from "@/lib/ai-assessment";
import { generateDemoAssessment, transcribeWithTencentOrFallback } from "@/lib/demo-assessment";
import { getQuestionById } from "@/lib/questions";

function getAccessToken(request: Request) {
  const authorization = request.headers.get("authorization") || "";
  const token = authorization.replace(/^Bearer\s+/i, "").trim();
  return token || null;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const audio = formData.get("audio");
  const questionId = formData.get("questionId");
  const durationSeconds = Number(formData.get("durationSeconds") ?? 0);
  const activeQuestionIndex = Number(formData.get("activeQuestionIndex") ?? 0);

  if (!(audio instanceof File) || typeof questionId !== "string") {
    return NextResponse.json({ error: "Missing audio or question id." }, { status: 400 });
  }

  const accessToken = getAccessToken(request);
  if (!accessToken) {
    return NextResponse.json(
      {
        code: "login_required",
        error: "登录后才能使用真实 AI 评分和语音转文字。",
      },
      { status: 401 },
    );
  }

  const question = getQuestionById(questionId);
  if (!question) {
    return NextResponse.json({ error: "Question not found." }, { status: 404 });
  }

  try {
    const supabase = createSupabaseUserClient(accessToken);
    const user = await getAuthenticatedUser(supabase);
    const usage = await ensureAccountUsage(supabase, user);

    if (!usage.hasAvailableAnalysis) {
      return NextResponse.json(
        {
          code: "quota_exceeded",
          error: "当前账号可用次数已用完，请前往 AI口语定价 页面联系客服开通套餐或加量包。",
          usage,
        },
        { status: 403 },
      );
    }

    const { transcript, provider: transcriptProvider } = await transcribeWithTencentOrFallback(
      audio,
      question,
    );

    const sequentialQuestions =
      question.part === "Part 1" || question.part === "Part 3"
        ? [question.prompt, ...question.followUps]
        : [];
    const currentQuestionText =
      question.part === "Part 1" || question.part === "Part 3"
        ? sequentialQuestions[activeQuestionIndex] ?? question.prompt
        : question.prompt;

    const demoResult = generateDemoAssessment({
      question,
      durationSeconds,
      transcript,
      audioBytes: audio.size,
      provider: transcriptProvider,
      transcriptProvider,
    });

    let finalResult = demoResult;

    try {
      const aiResult = await generateAiAssessment({
        question,
        currentQuestionText,
        transcript,
        durationSeconds,
      });

      finalResult = {
        ...demoResult,
        ...aiResult,
        provider: "ai-scored",
        transcriptProvider,
        completedAt: new Date().toISOString(),
      };
    } catch {
      finalResult = demoResult;
    }

    await consumeAnalysisCredit(supabase, usage);

    await supabase.from("practice_attempts").insert({
      question_id: question.id,
      question_title:
        question.part === "Part 1" || question.part === "Part 3"
          ? `${question.title} / Q${activeQuestionIndex + 1}`
          : question.title,
      part: question.part,
      overall_band: finalResult.overallBand,
      transcript: finalResult.transcript,
      feedback: {
        ...finalResult,
        currentPrompt: currentQuestionText,
        currentIndex: activeQuestionIndex,
      },
      duration_seconds: durationSeconds,
    });

    return NextResponse.json(finalResult);
  } catch {
    return NextResponse.json(
      {
        code: "login_required",
        error: "登录状态已失效，请重新登录后再试。",
      },
      { status: 401 },
    );
  }
}
