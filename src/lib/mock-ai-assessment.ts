import type {
  MockAssessmentResult,
  MockCriterionBreakdown,
  MockPartBreakdown,
  MockPromptBreakdown,
  MockPromptTranscript,
  MockTestSession,
} from "@/lib/types";

type GenerateMockAssessmentOptions = {
  session: MockTestSession;
  transcripts: MockPromptTranscript[];
  totalDurationSeconds: number;
};

type ChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string | Array<{ type?: string; text?: string }>;
    };
  }>;
};

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

function sanitizePromptBreakdowns(value: unknown): MockPromptBreakdown[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map((item) => {
      const upgrades =
        typeof item.upgrades === "object" && item.upgrades !== null ? (item.upgrades as Record<string, unknown>) : {};

      return {
        id: typeof item.id === "string" ? item.id.trim() : "",
        part: (item.part as MockPromptBreakdown["part"]) || "Part 1",
        topic: typeof item.topic === "string" ? item.topic.trim() : "",
        prompt: typeof item.prompt === "string" ? item.prompt.trim() : "",
        score: clampBand(Number(item.score ?? 0)),
        summary: typeof item.summary === "string" ? item.summary.trim() : "",
        strengths: sanitizeStringArray(item.strengths, 3),
        weaknesses: sanitizeStringArray(item.weaknesses, 3),
        conclusion: typeof item.conclusion === "string" ? item.conclusion.trim() : "",
        masteredPhrases: sanitizeStringArray(item.masteredPhrases, 4),
        polishedVersion:
          typeof item.polishedVersion === "string"
            ? item.polishedVersion.trim()
            : typeof upgrades.band8 === "string"
              ? upgrades.band8.trim()
              : "",
      };
    })
    .filter((item) => item.id && item.prompt);
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
      ? "这道题暂时没有生成完整结构化点评，当前先保留原始转写，便于继续人工复盘。"
      : "这道题暂时没有可用转写，因此没有生成逐题点评。",
    strengths: cleaned ? ["已保留原始转写，可继续检查是否切题、是否有展开。"] : [],
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
        : "这一部分暂时没有生成完整结构化总结，建议查看逐题转写并稍后重新生成报告。",
    strengths: promptScores.length > 0 ? ["已保留该部分的逐题结果，可先结合单题页面继续复盘。"] : [],
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
      weakness: "如果想拿到更高分，需要继续提升展开深度与连续表达。",
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
      weakness: "仅基于转写做保守估计，建议结合录音继续复盘。",
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

function mergePromptBreakdowns(transcripts: MockPromptTranscript[], promptBreakdowns: MockPromptBreakdown[]) {
  const breakdownMap = new Map(promptBreakdowns.map((item) => [item.id, item]));

  return transcripts.map((transcript) => {
    const matched = breakdownMap.get(transcript.id);
    const fallback = buildFallbackPromptBreakdown(transcript);

    if (!matched) {
      return fallback;
    }

    return {
      ...fallback,
      ...matched,
      score: matched.score > 0 ? matched.score : fallback.score,
      summary: matched.summary || fallback.summary,
      strengths: matched.strengths.length ? matched.strengths : fallback.strengths,
      weaknesses: matched.weaknesses.length ? matched.weaknesses : fallback.weaknesses,
      conclusion: matched.conclusion || fallback.conclusion,
      masteredPhrases: matched.masteredPhrases.length ? matched.masteredPhrases : fallback.masteredPhrases,
      polishedVersion: matched.polishedVersion || fallback.polishedVersion,
    };
  });
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

function buildPrompt({ session, transcripts, totalDurationSeconds }: GenerateMockAssessmentOptions) {
  const transcriptBlock = transcripts
    .map(
      (item, index) => `#${index + 1}
Part: ${item.part}
Topic: ${item.topic}
Prompt: ${item.prompt}
Duration: ${item.durationSeconds}s
Transcript:
${item.transcript}`,
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

Candidate responses:
${transcriptBlock}

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
  "promptBreakdowns": [
    {
      "id": string,
      "part": "Part 1" | "Part 2" | "Part 3",
      "topic": string,
      "prompt": string,
      "score": number,
      "summary": string,
      "strengths": string[],
      "weaknesses": string[],
      "conclusion": string,
      "masteredPhrases": string[],
      "polishedVersion": string
    }
  ],
  "improvementPlan": string[]
}

Requirements:
- Band scores use 0.5 steps.
- criteria must contain exactly 4 entries.
- partBreakdowns must contain exactly Part 1, Part 2, and Part 3.
- promptBreakdowns must contain one entry for every prompt above.
- Each partBreakdown and promptBreakdown must include a score using 0.5 band steps.
- Each promptBreakdown should include 2-4 mastered phrases and one complete English Band 8 polished version based on the candidate's original answer. Keep the original meaning and key information, allow moderate completion, and do not invent a different story.
- improvementPlan must contain 5 actionable Chinese steps.
- confidenceNote should clearly say this is based on a full mock test and for practice reference.
  `.trim();
}

export async function generateMockAiAssessment(
  options: GenerateMockAssessmentOptions,
): Promise<MockAssessmentResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing.");
  }

  const baseUrl = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/+$/, "");
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const prompt = buildPrompt(options);

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
    throw new Error(`Mock assessment request failed with ${response.status}.`);
  }

  const data = (await response.json()) as ChatCompletionResponse;
  const content = extractContent(data);
  if (!content) {
    throw new Error("Mock assessment response content is empty.");
  }

  const payload = parseJsonContent(content) as Record<string, unknown>;
  const criteria = sanitizeCriterion(payload.criteria);
  const sanitizedPartBreakdowns = sanitizePartBreakdowns(payload.partBreakdowns);
  const sanitizedPromptBreakdowns = sanitizePromptBreakdowns(payload.promptBreakdowns);
  const promptBreakdowns = mergePromptBreakdowns(options.transcripts, sanitizedPromptBreakdowns);
  const partBreakdowns = mergePartBreakdowns(options.transcripts, sanitizedPartBreakdowns, promptBreakdowns);
  const improvementPlan = sanitizeStringArray(payload.improvementPlan, 5);
  const resolvedCriteria = criteria.length === 4 ? criteria : buildFallbackCriteria(payload);
  const resolvedImprovementPlan =
    improvementPlan.length >= 3
      ? improvementPlan
      : [
          "先逐题复盘转写，确认每道题是否直接回应了问题。",
          "优先补强回答展开，尽量形成“观点 + 原因 + 例子”的结构。",
          "把高频口语搭配和连接表达整理成清单，做一轮跟读和替换练习。",
        ];

  return {
    predictedOverallBand: clampBand(Number(payload.predictedOverallBand ?? 0)),
    fluency: clampBand(Number(payload.fluency ?? 0)),
    lexical: clampBand(Number(payload.lexical ?? 0)),
    grammar: clampBand(Number(payload.grammar ?? 0)),
    pronunciation: clampBand(Number(payload.pronunciation ?? 0)),
    completedAt: new Date().toISOString(),
    totalDurationSeconds: options.totalDurationSeconds,
    part1Theme: `${options.session.part1RequiredTheme} / ${options.session.part1GeneralTheme}`,
    part2Topic: options.session.part2Topic,
    part3Topic: options.session.part3Topic,
    confidenceNote:
      typeof payload.confidenceNote === "string" && payload.confidenceNote.trim()
        ? payload.confidenceNote.trim()
        : "本次分数基于完整全真模考的录音与转写生成，仅供练习参考。",
    criteria: resolvedCriteria,
    partBreakdowns,
    promptBreakdowns,
    improvementPlan: resolvedImprovementPlan,
    transcripts: options.transcripts,
    provider: "ai-scored",
    transcriptProvider: "tencent-cloud",
  };
}
