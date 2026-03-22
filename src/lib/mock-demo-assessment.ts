import type {
  MockAssessmentResult,
  MockCriterionBreakdown,
  MockPartBreakdown,
  MockPromptBreakdown,
  MockPromptTranscript,
  MockTestSession,
} from "@/lib/types";

type GenerateMockDemoAssessmentOptions = {
  session: MockTestSession;
  transcripts: MockPromptTranscript[];
  totalDurationSeconds: number;
  transcriptProvider: MockAssessmentResult["transcriptProvider"];
};

function clampBand(score: number) {
  const rounded = Math.round(Math.min(9, Math.max(0, score)) * 2) / 2;
  return Number(rounded.toFixed(1));
}

function hasUnavailableTranscript(transcript: string) {
  return transcript.startsWith("[Transcript unavailable:");
}

function estimatePromptScore(item: MockPromptTranscript) {
  if (hasUnavailableTranscript(item.transcript)) {
    return 0;
  }

  const words = item.transcript.split(/\s+/).filter(Boolean).length;
  const durationFactor = Math.min(1.2, item.durationSeconds / 45);
  return clampBand(4.5 + Math.min(2.0, words / 35) * durationFactor);
}

function buildPromptBreakdown(item: MockPromptTranscript): MockPromptBreakdown {
  const score = estimatePromptScore(item);
  const unavailable = hasUnavailableTranscript(item.transcript);

  return {
    id: item.id,
    part: item.part,
    topic: item.topic,
    prompt: item.prompt,
    score,
    summary: unavailable
      ? "这道题的录音转写失败，因此暂时没有生成完整 AI 点评。"
      : "这道题已保留原始转写，当前报告为系统兜底版，建议后续重新生成 AI 完整报告。",
    strengths: unavailable
      ? []
      : ["已保留答题转写，可以先检查是否切题、是否有展开、是否有明显重复表达。"],
    weaknesses: unavailable
      ? ["当前没有可用 transcript，无法完成这道题的结构化分析。"]
      : ["当前版本未拿到完整 AI 逐题分析，细粒度点评和高分润色答案可能暂时缺失。"],
    conclusion: unavailable
      ? "建议优先检查录音和转写链路，再重新生成完整报告。"
      : "可以先基于转写人工复盘，稍后再重新生成完整 AI 报告。",
    masteredPhrases: [],
    polishedVersion: "",
  };
}

function buildPartBreakdown(
  part: "Part 1" | "Part 2" | "Part 3",
  prompts: MockPromptBreakdown[],
  transcripts: MockPromptTranscript[],
): MockPartBreakdown {
  const scored = prompts.map((item) => item.score).filter((score) => score > 0);
  const average = scored.length
    ? clampBand(scored.reduce((sum, score) => sum + score, 0) / scored.length)
    : 0;
  const hasUnavailable = transcripts.some((item) => hasUnavailableTranscript(item.transcript));

  return {
    part,
    topic: transcripts[0]?.topic ?? part,
    score: average,
    summary: hasUnavailable
      ? "这一部分至少有一道题转写失败，因此当前只保留基础结果。"
      : "这一部分的 AI 总结暂时不可用，当前保留可继续查看的基础结果。",
    strengths: scored.length
      ? ["录音与题目结构已保留，可以先按部分维度复盘回答内容。"]
      : [],
    weaknesses: [
      hasUnavailable
        ? "转写链路不稳定会直接影响完整 mock report 的质量。"
        : "当前没有拿到完整 AI part summary，建议稍后重新生成。",
    ],
  };
}

function buildCriteria(overallBand: number): MockCriterionBreakdown[] {
  const definitions: Array<{
    criterion: MockCriterionBreakdown["criterion"];
    delta: number;
    strength: string;
    weakness: string;
  }> = [
    {
      criterion: "Fluency",
      delta: 0,
      strength: "当前回答可用于继续复盘整体流利度。",
      weakness: "仍建议进一步增强展开与连续表达。",
    },
    {
      criterion: "Lexical",
      delta: -0.5,
      strength: "已有基础词汇支撑基本表达。",
      weakness: "需要补充更具体的主题词汇和自然搭配。",
    },
    {
      criterion: "Grammatical",
      delta: 0,
      strength: "基本句型可以支撑完成答题。",
      weakness: "语法稳定性和句式层次仍有提升空间。",
    },
    {
      criterion: "Pronunciation",
      delta: 0,
      strength: "当前录音可继续用于回听和纠音。",
      weakness: "这里只能做保守估计，建议结合原始音频复盘。",
    },
  ];

  return definitions.map((item) => ({
    criterion: item.criterion,
    score: clampBand(overallBand + item.delta),
    strengths: [item.strength],
    weaknesses: [item.weakness],
    conclusion: `${item.criterion} 维度当前为兜底评估结果，建议后续重新生成完整 AI 报告。`,
  }));
}

export function generateMockDemoAssessment({
  session,
  transcripts,
  totalDurationSeconds,
  transcriptProvider,
}: GenerateMockDemoAssessmentOptions): MockAssessmentResult {
  const promptBreakdowns = transcripts.map(buildPromptBreakdown);
  const partBreakdowns = (["Part 1", "Part 2", "Part 3"] as const).map((part) =>
    buildPartBreakdown(
      part,
      promptBreakdowns.filter((item) => item.part === part),
      transcripts.filter((item) => item.part === part),
    ),
  );

  const scoredPrompts = promptBreakdowns.map((item) => item.score).filter((score) => score > 0);
  const overallBand = scoredPrompts.length
    ? clampBand(scoredPrompts.reduce((sum, score) => sum + score, 0) / scoredPrompts.length)
    : 0;

  return {
    predictedOverallBand: overallBand,
    fluency: clampBand(overallBand),
    lexical: clampBand(Math.max(0, overallBand - 0.5)),
    grammar: clampBand(overallBand),
    pronunciation: clampBand(overallBand),
    completedAt: new Date().toISOString(),
    totalDurationSeconds,
    part1Theme: `${session.part1RequiredTheme} / ${session.part1GeneralTheme}`,
    part2Topic: session.part2Topic,
    part3Topic: session.part3Topic,
    confidenceNote:
      transcriptProvider === "demo-fallback"
        ? "本次报告使用了兜底链路，因为部分录音转写或 AI 评分失败。可先查看转写和基础结果，建议稍后重新生成完整报告。"
        : "本次报告使用了兜底链路，因为 AI 评分暂时不可用。可先查看基础结果，建议稍后重新生成完整报告。",
    criteria: buildCriteria(overallBand),
    partBreakdowns,
    promptBreakdowns,
    improvementPlan: [
      "先逐题检查转写内容，确认回答是否真正切题。",
      "优先补强回答展开，尽量形成“观点 + 原因 + 例子”的结构。",
      "把重复使用的简单词替换成更具体的表达和搭配。",
      "回听录音，重点关注停顿、重复和语法断裂的位置。",
      "待转写和 AI 服务稳定后，再重新生成完整 mock report 做精细复盘。",
    ],
    transcripts,
    provider: "demo-fallback",
    transcriptProvider,
  };
}
