import type {
  MockAssessmentResult,
  MockCriterionBreakdown,
  MockPartBreakdown,
  MockPromptBreakdown,
  MockPromptTranscript,
  MockTestSession,
} from "@/lib/types";

type ChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string | Array<{ type?: string; text?: string }>;
    };
  }>;
};

type GenerateMockPromptAssessmentOptions = {
  transcript: MockPromptTranscript;
};

type GenerateMockSummaryAssessmentOptions = {
  session: MockTestSession;
  transcripts: MockPromptTranscript[];
  totalDurationSeconds: number;
  promptBreakdowns: MockPromptBreakdown[];
};

const DEFAULT_PROMPT_ASSESSMENT_CONCURRENCY = 3;
const MAX_PROMPT_ASSESSMENT_ATTEMPTS = 3;
const MAX_SUMMARY_ASSESSMENT_ATTEMPTS = 3;

function clampBand(score: number) {
  const rounded = Math.round(Math.min(9, Math.max(0, score)) * 2) / 2;
  return Number(rounded.toFixed(1));
}

function extractContent(response: ChatCompletionResponse) {
  const content = response.choices?.[0]?.message?.content;
  if (typeof content === "string") {
    return content;
  }
  if (Array.isArray(content)) {
    return content.map((item) => item.text || "").join("").trim();
  }
  return "";
}

function parseJsonContent(content: string) {
  const direct = content.trim();
  if (direct.startsWith("{") && direct.endsWith("}")) {
    return JSON.parse(direct);
  }
  const match = content.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("Mock assessment response did not contain JSON.");
  }
  return JSON.parse(match[0]);
}

function sanitizeStringArray(value: unknown, max: number) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0).slice(0, max);
}

function sanitizeCriterion(value: unknown): MockCriterionBreakdown[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map((item) => ({
      criterion: (item.criterion as MockCriterionBreakdown["criterion"]) || "Fluency",
      score: clampBand(Number(item.score ?? 0)),
      strengths: sanitizeStringArray(item.strengths, 3),
      weaknesses: sanitizeStringArray(item.weaknesses, 3),
      conclusion: typeof item.conclusion === "string" ? item.conclusion.trim() : "",
    }))
    .filter((item) => item.conclusion);
}

function sanitizePartBreakdowns(value: unknown): MockPartBreakdown[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map((item) => ({
      part: (item.part as MockPartBreakdown["part"]) || "Part 1",
      topic: typeof item.topic === "string" ? item.topic.trim() : "",
      score: clampBand(Number(item.score ?? 0)),
      summary: typeof item.summary === "string" ? item.summary.trim() : "",
      strengths: sanitizeStringArray(item.strengths, 3),
      weaknesses: sanitizeStringArray(item.weaknesses, 3),
    }))
    .filter((item) => item.topic && item.summary);
}

function buildFallbackAnswerThinking(part: MockPromptTranscript["part"]) {
  if (part === "Part 2") {
    return [
      "先用一句话点明你要讲的人、事、物或经历。",
      "按时间或场景顺序交代 2 到 3 个关键信息。",
      "重点展开一个细节、感受或转折，让内容更具体。",
      "最后总结这段经历为什么重要，或它带来的影响。",
    ];
  }

  if (part === "Part 3") {
    return [
      "先直接表明观点，避免一开始过于模糊。",
      "给出一个最核心的理由，建立主线。",
      "补一个例子、对比或结果影响，把论证说透。",
      "最后回扣题目，用一句总结收尾。",
    ];
  }

  return [
    "先直接回答问题，给出最明确的第一反应。",
    "补一个具体原因，让回答不只停留在简短结论。",
    "再加一个个人经历、习惯或例子，把内容展开。",
    "最后补一句感受或总结，让答案完整结束。",
  ];
}

function sanitizePromptBreakdown(item: Record<string, unknown>, transcript: MockPromptTranscript): MockPromptBreakdown {
  return {
    id: transcript.id,
    part: transcript.part,
    topic: transcript.topic,
    prompt: transcript.prompt,
    score: clampBand(Number(item.score ?? 0)),
    summary: typeof item.summary === "string" ? item.summary.trim() : "",
    answerThinking: sanitizeStringArray(item.answerThinking, 4),
    strengths: sanitizeStringArray(item.strengths, 3),
    weaknesses: sanitizeStringArray(item.weaknesses, 3),
    conclusion: typeof item.conclusion === "string" ? item.conclusion.trim() : "",
    masteredPhrases: sanitizeStringArray(item.masteredPhrases, 4),
    polishedVersion: typeof item.polishedVersion === "string" ? item.polishedVersion.trim() : "",
  };
}

function isPromptBreakdownComplete(value: MockPromptBreakdown) {
  return Boolean(
    value.summary.trim() &&
    value.conclusion.trim() &&
    value.answerThinking.length === 4 &&
    value.strengths.length >= 1 &&
    value.weaknesses.length >= 1 &&
    value.polishedVersion.trim(),
  );
}

function buildFallbackPromptBreakdown(transcript: MockPromptTranscript): MockPromptBreakdown {
  const cleaned = transcript.transcript.trim();

  return {
    id: transcript.id,
    part: transcript.part,
    topic: transcript.topic,
    prompt: transcript.prompt,
    score: 0,
    summary: cleaned
      ? "这道题暂时没有生成完整的结构化点评，当前先保留原始转写，方便继续人工复盘。"
      : "这道题暂时没有可用转写，因此还不能生成逐题点评。",
    answerThinking: buildFallbackAnswerThinking(transcript.part),
    strengths: cleaned ? ["已保留原始转写，你可以先检查是否切题、是否有展开。"] : [],
    weaknesses: cleaned
      ? ["模型没有返回这道题的完整逐题分析，建议稍后重新生成完整报告。"]
      : ["当前没有可用 transcript，暂时无法判断这道题的具体问题。"],
    conclusion: cleaned
      ? "建议稍后重新生成完整报告，避免基于不完整分析做判断。"
      : "建议先确保录音转写成功，再重新生成完整报告。",
    masteredPhrases: [],
    polishedVersion: "",
  };
}

function buildFallbackPartBreakdown(
  part: "Part 1" | "Part 2" | "Part 3",
  transcripts: MockPromptTranscript[],
  prompts: MockPromptBreakdown[],
): MockPartBreakdown {
  const promptScores = prompts.map((item) => item.score).filter((score) => score > 0);
  const averageScore = promptScores.length
    ? Math.round((promptScores.reduce((sum, score) => sum + score, 0) / promptScores.length) * 2) / 2
    : 0;

  return {
    part,
    topic: transcripts[0]?.topic ?? part,
    score: averageScore,
    summary:
      promptScores.length > 0
        ? "这一部分的结构化总结不完整，当前先根据已返回的逐题结果保留概要。"
        : "这一部分暂时没有生成完整总结，建议先查看逐题转写并稍后重新生成报告。",
    strengths: promptScores.length > 0 ? ["该部分已有逐题结果，可以先结合单题页面继续复盘。"] : [],
    weaknesses: ["当前模型没有完整返回该部分总结，建议稍后重新生成完整报告。"],
  };
}

function buildFallbackCriteria(payload: Record<string, unknown>): MockCriterionBreakdown[] {
  const definitions: Array<{
    criterion: MockCriterionBreakdown["criterion"];
    scoreKey: "fluency" | "lexical" | "grammar" | "pronunciation";
    strength: string;
    weakness: string;
  }> = [
    {
      criterion: "Fluency",
      scoreKey: "fluency",
      strength: "回答基本完成，具备继续稳定输出的基础。",
      weakness: "如果想拿到更高分，需要继续提升展开深度与连贯表达。",
    },
    {
      criterion: "Lexical",
      scoreKey: "lexical",
      strength: "已有基础词汇可用于完成答题。",
      weakness: "需要补充更具体、更自然的主题词汇与搭配。",
    },
    {
      criterion: "Grammatical",
      scoreKey: "grammar",
      strength: "基本句型可以支撑完成回答。",
      weakness: "语法稳定性和句式层次仍有提升空间。",
    },
    {
      criterion: "Pronunciation",
      scoreKey: "pronunciation",
      strength: "当前回答可用于继续训练语音语调。",
      weakness: "这里只能基于转写做保守估计，建议结合录音继续复盘。",
    },
  ];

  return definitions.map((item) => ({
    criterion: item.criterion,
    score: clampBand(Number(payload[item.scoreKey] ?? 0)),
    strengths: [item.strength],
    weaknesses: [item.weakness],
    conclusion: `${item.criterion} 维度已保留基础评分，建议在完整报告恢复后继续查看更细分析。`,
  }));
}

function isSummaryComplete(
  criteria: MockCriterionBreakdown[],
  partBreakdowns: MockPartBreakdown[],
  improvementPlan: string[],
) {
  const hasAllParts = (["Part 1", "Part 2", "Part 3"] as const).every((part) =>
    partBreakdowns.some((item) => item.part === part && item.summary.trim()),
  );

  return criteria.length === 4 && hasAllParts && improvementPlan.length >= 5;
}

function mergePartBreakdowns(
  transcripts: MockPromptTranscript[],
  partBreakdowns: MockPartBreakdown[],
  promptBreakdowns: MockPromptBreakdown[],
) {
  const partMap = new Map(partBreakdowns.map((item) => [item.part, item]));

  return (["Part 1", "Part 2", "Part 3"] as const).map((part) => {
    const matched = partMap.get(part);
    if (matched) {
      return matched;
    }

    return buildFallbackPartBreakdown(
      part,
      transcripts.filter((item) => item.part === part),
      promptBreakdowns.filter((item) => item.part === part),
    );
  });
}

async function mapWithConcurrency<TInput, TOutput>(
  items: TInput[],
  concurrency: number,
  mapper: (item: TInput, index: number) => Promise<TOutput>,
) {
  const results = new Array<TOutput>(items.length);
  const workerCount = Math.max(1, Math.min(concurrency, items.length));
  let nextIndex = 0;

  async function worker() {
    while (true) {
      const currentIndex = nextIndex;
      nextIndex += 1;

      if (currentIndex >= items.length) {
        return;
      }

      results[currentIndex] = await mapper(items[currentIndex], currentIndex);
    }
  }

  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  return results;
}

async function requestJsonFromModel(prompt: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing.");
  }

  const baseUrl = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/+$/, "");
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are an IELTS mock speaking scoring engine. Return strict JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Mock assessment request failed with ${response.status}: ${text.slice(0, 200)}`);
  }

  const data = (await response.json()) as ChatCompletionResponse;
  const content = extractContent(data);
  if (!content) {
    throw new Error("Mock assessment response content is empty.");
  }

  return parseJsonContent(content) as Record<string, unknown>;
}

function buildPromptAssessmentPrompt(transcript: MockPromptTranscript) {
  return `
You are a strict IELTS Speaking examiner.
Return valid JSON only.
All explanations must be in Simplified Chinese.

Candidate response:
- Part: ${transcript.part}
- Topic: ${transcript.topic}
- Prompt: ${transcript.prompt}
- Duration seconds: ${transcript.durationSeconds}
- Transcript:
${transcript.transcript}

Return JSON with exactly this shape:
{
  "score": number,
  "summary": string,
  "answerThinking": string[],
  "strengths": string[],
  "weaknesses": string[],
  "conclusion": string,
  "masteredPhrases": string[],
  "polishedVersion": string
}

Requirements:
- score must use 0.5 steps.
- answerThinking: exactly 4 concise Chinese steps that give a complete answer plan from opening, key point, expansion/example, to ending.
- strengths: 1 to 3 concise Chinese points.
- weaknesses: 1 to 3 concise Chinese points.
- summary and conclusion must be concise Chinese feedback.
- masteredPhrases must contain 2 to 4 short English phrases actually used well by the candidate when possible.
- polishedVersion must be one complete English Band 8 answer based on the candidate's original answer. Keep the original meaning and key information, allow moderate completion, and do not invent a different story.
  `.trim();
}

function buildSummaryAssessmentPrompt({
  session,
  transcripts,
  totalDurationSeconds,
  promptBreakdowns,
}: GenerateMockSummaryAssessmentOptions) {
  const promptBlock = promptBreakdowns
    .map(
      (item, index) => `#${index + 1}
Part: ${item.part}
Topic: ${item.topic}
Prompt: ${item.prompt}
Transcript: ${transcripts.find((transcript) => transcript.id === item.id)?.transcript ?? ""}
Prompt score: ${item.score}
Prompt summary: ${item.summary}
Strengths: ${item.strengths.join(" | ") || "N/A"}
Weaknesses: ${item.weaknesses.join(" | ") || "N/A"}`,
    )
    .join("\n\n");

  return `
You are a strict IELTS Speaking mock-test examiner.
Return valid JSON only.
All explanations must be in Simplified Chinese.

Mock session metadata:
- Part 1 themes: ${session.part1RequiredTheme}, ${session.part1GeneralTheme}
- Part 2 topic: ${session.part2Topic}
- Part 3 topic: ${session.part3Topic}
- Total duration seconds: ${totalDurationSeconds}

Per-question analysis:
${promptBlock}

Return JSON with exactly this shape:
{
  "predictedOverallBand": number,
  "fluency": number,
  "lexical": number,
  "grammar": number,
  "pronunciation": number,
  "confidenceNote": string,
  "criteria": [
    {
      "criterion": "Fluency" | "Lexical" | "Grammatical" | "Pronunciation",
      "score": number,
      "strengths": string[],
      "weaknesses": string[],
      "conclusion": string
    }
  ],
  "partBreakdowns": [
    {
      "part": "Part 1" | "Part 2" | "Part 3",
      "topic": string,
      "score": number,
      "summary": string,
      "strengths": string[],
      "weaknesses": string[]
    }
  ],
  "improvementPlan": string[]
}

Requirements:
- Band scores use 0.5 steps.
- criteria must contain exactly 4 entries.
- partBreakdowns must contain exactly Part 1, Part 2, and Part 3.
- improvementPlan must contain 5 actionable Chinese steps.
- confidenceNote should clearly say this is based on a full mock test and for practice reference.
  `.trim();
}

export async function generateMockPromptAssessment(options: GenerateMockPromptAssessmentOptions): Promise<MockPromptBreakdown> {
  const fallback = buildFallbackPromptBreakdown(options.transcript);

  for (let attempt = 1; attempt <= MAX_PROMPT_ASSESSMENT_ATTEMPTS; attempt += 1) {
    try {
      const payload = await requestJsonFromModel(buildPromptAssessmentPrompt(options.transcript));
      const sanitized = sanitizePromptBreakdown(payload, options.transcript);

      const merged = {
        ...fallback,
        ...sanitized,
        score: sanitized.score > 0 ? sanitized.score : fallback.score,
        summary: sanitized.summary || fallback.summary,
        answerThinking: sanitized.answerThinking.length ? sanitized.answerThinking : fallback.answerThinking,
        strengths: sanitized.strengths.length ? sanitized.strengths : fallback.strengths,
        weaknesses: sanitized.weaknesses.length ? sanitized.weaknesses : fallback.weaknesses,
        conclusion: sanitized.conclusion || fallback.conclusion,
        masteredPhrases: sanitized.masteredPhrases.length ? sanitized.masteredPhrases : fallback.masteredPhrases,
        polishedVersion: sanitized.polishedVersion || fallback.polishedVersion,
      };

      if (isPromptBreakdownComplete(merged) || attempt === MAX_PROMPT_ASSESSMENT_ATTEMPTS) {
        return merged;
      }
    } catch {
      if (attempt === MAX_PROMPT_ASSESSMENT_ATTEMPTS) {
        return fallback;
      }
    }
  }

  return fallback;
}

export async function generateMockSummaryAssessment(
  options: GenerateMockSummaryAssessmentOptions,
): Promise<Omit<MockAssessmentResult, "completedAt" | "transcripts" | "provider" | "transcriptProvider" | "promptBreakdowns">> {
  let latestResult: Omit<MockAssessmentResult, "completedAt" | "transcripts" | "provider" | "transcriptProvider" | "promptBreakdowns"> | null = null;

  for (let attempt = 1; attempt <= MAX_SUMMARY_ASSESSMENT_ATTEMPTS; attempt += 1) {
    const payload = await requestJsonFromModel(buildSummaryAssessmentPrompt(options));
    const criteria = sanitizeCriterion(payload.criteria);
    const partBreakdowns = mergePartBreakdowns(
      options.transcripts,
      sanitizePartBreakdowns(payload.partBreakdowns),
      options.promptBreakdowns,
    );
    const improvementPlan = sanitizeStringArray(payload.improvementPlan, 5);

    latestResult = {
      predictedOverallBand: clampBand(Number(payload.predictedOverallBand ?? 0)),
      fluency: clampBand(Number(payload.fluency ?? 0)),
      lexical: clampBand(Number(payload.lexical ?? 0)),
      grammar: clampBand(Number(payload.grammar ?? 0)),
      pronunciation: clampBand(Number(payload.pronunciation ?? 0)),
      totalDurationSeconds: options.totalDurationSeconds,
      part1Theme: `${options.session.part1RequiredTheme} / ${options.session.part1GeneralTheme}`,
      part2Topic: options.session.part2Topic,
      part3Topic: options.session.part3Topic,
      confidenceNote:
        typeof payload.confidenceNote === "string" && payload.confidenceNote.trim()
          ? payload.confidenceNote.trim()
          : "本次分数基于完整全真模考的录音与转写生成，仅供练习参考。",
      criteria: criteria.length === 4 ? criteria : buildFallbackCriteria(payload),
      partBreakdowns,
      improvementPlan:
        improvementPlan.length >= 3
          ? improvementPlan
          : [
              "先逐题复盘转写，确认每道题是否直接回应了问题。",
              "优先补强回答展开，尽量形成“观点 + 原因 + 例子”的结构。",
              "把高频口语搭配和连接表达整理成清单，做一轮跟读和替换练习。",
            ],
    };

    if (isSummaryComplete(latestResult.criteria, latestResult.partBreakdowns, latestResult.improvementPlan)) {
      return latestResult;
    }
  }

  if (!latestResult) {
    throw new Error("Mock summary assessment did not produce a usable result.");
  }

  return latestResult;
}

export async function generateMockAiAssessment(
  options: Omit<GenerateMockSummaryAssessmentOptions, "promptBreakdowns">,
): Promise<MockAssessmentResult> {
  const promptBreakdowns = await mapWithConcurrency(
    options.transcripts,
    DEFAULT_PROMPT_ASSESSMENT_CONCURRENCY,
    async (transcript) => generateMockPromptAssessment({ transcript }),
  );

  const summary = await generateMockSummaryAssessment({
    ...options,
    promptBreakdowns,
  });

  return {
    ...summary,
    completedAt: new Date().toISOString(),
    promptBreakdowns,
    transcripts: options.transcripts,
    provider: "ai-scored",
    transcriptProvider: "tencent-cloud",
  };
}
