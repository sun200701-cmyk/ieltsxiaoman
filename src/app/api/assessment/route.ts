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
import type { PracticeAssessmentApiResponse } from "@/lib/types";

function getAccessToken(request: Request) {
  const authorization = request.headers.get("authorization") || "";
  const token = authorization.replace(/^Bearer\s+/i, "").trim();
  return token || null;
}

function createPendingPhase(message: string) {
  return { status: "pending" as const, message };
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const audio = formData.get("audio");
  const questionId = formData.get("questionId");
  const durationSeconds = Number(formData.get("durationSeconds") ?? 0);
  const activeQuestionIndex = Number(formData.get("activeQuestionIndex") ?? 0);

  if (!(audio instanceof File) || typeof questionId !== "string") {
    return NextResponse.json<PracticeAssessmentApiResponse>(
      {
        ok: false,
        code: "invalid_payload",
        error: "Missing audio or question id.",
        phases: {
          transcription: {
            status: "failed",
            message: "语音转文字未开始",
            reason: "缺少录音或题目 ID。",
          },
          assessment: createPendingPhase("等待转写完成后再分析"),
        },
      },
      { status: 400 },
    );
  }

  const accessToken = getAccessToken(request);
  if (!accessToken) {
    return NextResponse.json<PracticeAssessmentApiResponse>(
      {
        ok: false,
        code: "login_required",
        error: "登录后才能使用真实 AI 评分和语音转文字。",
        phases: {
          transcription: createPendingPhase("等待登录后开始转写"),
          assessment: createPendingPhase("等待登录后开始分析"),
        },
      },
      { status: 401 },
    );
  }

  const question = getQuestionById(questionId);
  if (!question) {
    return NextResponse.json<PracticeAssessmentApiResponse>(
      {
        ok: false,
        code: "question_not_found",
        error: "Question not found.",
        phases: {
          transcription: {
            status: "failed",
            message: "语音转文字未开始",
            reason: "题目不存在。",
          },
          assessment: createPendingPhase("等待有效题目后再分析"),
        },
      },
      { status: 404 },
    );
  }

  try {
    const supabase = createSupabaseUserClient(accessToken);
    const user = await getAuthenticatedUser(supabase);
    const usage = await ensureAccountUsage(supabase, user);

    if (!usage.hasAvailableAnalysis) {
      return NextResponse.json<PracticeAssessmentApiResponse>(
        {
          ok: false,
          code: "quota_exceeded",
          error: "当前账号可用次数已用完，请前往 AI 口语定价页面联系开通。",
          phases: {
            transcription: createPendingPhase("额度不足，未开始转写"),
            assessment: createPendingPhase("额度不足，未开始分析"),
          },
        },
        { status: 403 },
      );
    }

    const { transcript, provider: transcriptProvider, error: transcriptionError } = await transcribeWithTencentOrFallback(
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
    let assessmentPhase: PracticeAssessmentApiResponse["phases"]["assessment"] = {
      status: "fallback",
      message: "分析暂不可用，已切换为兜底结果",
      provider: "demo-fallback",
    };

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

      assessmentPhase = {
        status: "success",
        message: "分析完成",
        provider: "ai-scored",
      };
    } catch (error) {
      assessmentPhase = {
        status: "fallback",
        message: "分析失败，已切换为兜底结果",
        provider: "demo-fallback",
        reason: error instanceof Error ? error.message : "Unknown AI error.",
      };
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

    return NextResponse.json<PracticeAssessmentApiResponse>({
      ok: true,
      result: finalResult,
      warnings: assessmentPhase.status === "fallback" ? ["本次已切换为兜底版分析结果。"] : [],
      phases: {
        transcription:
          transcriptProvider === "demo-fallback"
            ? {
                status: "fallback",
                message: "语音转文字失败，已切换为兜底转写",
                provider: "demo-fallback",
                reason: transcriptionError || "Tencent ASR failed.",
              }
            : {
                status: "success",
                message: "语音转文字完成",
                provider: "tencent-cloud",
              },
        assessment: assessmentPhase,
      },
    });
  } catch (error) {
    return NextResponse.json<PracticeAssessmentApiResponse>(
      {
        ok: false,
        code: "assessment_failed",
        error: "分析失败了，请稍后再试。",
        phases: {
          transcription: createPendingPhase("语音转文字未完成"),
          assessment: {
            status: "failed",
            message: "分析失败",
            reason: error instanceof Error ? error.message : "Unknown server error.",
          },
        },
      },
      { status: 500 },
    );
  }
}
