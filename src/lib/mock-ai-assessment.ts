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

export function buildFallbackMockAssessment({
  session,
  transcripts,
  totalDurationSeconds,
  transcriptProvider,
}: GenerateMockAssessmentOptions & { transcriptProvider: "tencent-cloud" | "demo-fallback" }): MockAssessmentResult {
  const criteria: MockCriterionBreakdown[] = [
    {
      criterion: "Fluency",
      score: 6.5,
      strengths: ["整套回答能够持续输出内容，基本没有完全卡住。", "Part 1 和 Part 3 的应答速度还不错。"],
      weaknesses: ["部分回答仍有明显停顿。", "展开的稳定性还不够，越往后越容易变短。"],
      conclusion: "流利度已经具备中档基础，但还需要通过更稳定的展开和更自然的连接来冲击更高分。",
    },
    {
      criterion: "Lexical",
      score: 6.5,
      strengths: ["能够使用一些主题相关词汇。", "个别回答有一定概括表达能力。"],
      weaknesses: ["高分词组的稳定使用还不够。", "有些表达仍然偏普通，替换空间较大。"],
      conclusion: "词汇处于中档水平，接下来要重点做表达升级和搭配积累。",
    },
    {
      criterion: "Grammatical",
      score: 6,
      strengths: ["基本句子结构是完整的。", "大部分信息都能够表达清晰。"],
      weaknesses: ["复杂句比例不高。", "个别动词形式和时态细节还不稳定。"],
      conclusion: "语法是当前提分瓶颈之一，需要通过稳定复杂句和细节纠错来提升。",
    },
    {
      criterion: "Pronunciation",
      score: 6.5,
      strengths: ["整体可懂度尚可。", "关键词基本能被识别。"],
      weaknesses: ["部分句子节奏不够自然。", "重音和连读的表现还有提升空间。"],
      conclusion: "发音可以作为辅助提分项，重点要提高节奏感和重点表达的清晰度。",
    },
  ];

  const partBreakdowns: MockPartBreakdown[] = [
    {
      part: "Part 1",
      topic: `${session.part1RequiredTheme} / ${session.part1GeneralTheme}`,
      score: 6.5,
      summary: "Part 1 整体切题，但短答的稳定性和展开完整度还可以继续加强。",
      strengths: ["进入回答速度较快。", "主题覆盖较完整。"],
      weaknesses: ["个别小题展开偏短。", "观点和例子的层次感不够强。"],
    },
    {
      part: "Part 2",
      topic: session.part2Topic,
      score: 6.5,
      summary: "Part 2 有基本结构，但故事细节和亮点表达仍然不足。",
      strengths: ["能够围绕 cue card 回答。", "核心信息基本完整。"],
      weaknesses: ["细节不够丰富。", "亮点句型和自然衔接不够。"],
    },
    {
      part: "Part 3",
      topic: session.part3Topic,
      score: 6,
      summary: "Part 3 有一定思路，但抽象讨论时还需要更清晰的观点和论证。",
      strengths: ["能够回应抽象问题。", "观点表达有基础。"],
      weaknesses: ["论证深度不足。", "连接词和逻辑组织还需要加强。"],
    },
  ];

  const promptBreakdowns: MockPromptBreakdown[] = transcripts.map((item) => ({
    id: item.id,
    part: item.part,
    topic: item.topic,
    prompt: item.prompt,
    score: item.part === "Part 3" ? 6 : 6.5,
    summary: "这道题基本完成了核心回答，但仍然有继续展开和优化表达的空间。",
    strengths: ["能够正面回应题目。", "有基本的观点表达。"],
    weaknesses: ["细节支撑还不够。", "高分表达和复杂句比例不足。"],
    conclusion: "先把这道题练到“观点 + 原因 + 例子”的完整结构，会更接近高分回答。",
    masteredPhrases: ["in my opinion", "for example", "in real life", "as a result"],
    polishedVersion:
      item.transcript.trim().length > 0
        ? item.transcript
            .replace(/\bI think\b/gi, "I would say")
            .replace(/\breally\b/gi, "genuinely")
            .replace(/\bvery\b/gi, "fairly")
            .replace(/\bgood\b/gi, "beneficial")
            .replace(/\bbad\b/gi, "less effective")
        : "",
  }));

  return {
    predictedOverallBand: 6.5,
    fluency: 6.5,
    lexical: 6.5,
    grammar: 6,
    pronunciation: 6.5,
    completedAt: new Date().toISOString(),
    totalDurationSeconds,
    part1Theme: `${session.part1RequiredTheme} / ${session.part1GeneralTheme}`,
    part2Topic: session.part2Topic,
    part3Topic: session.part3Topic,
    confidenceNote: "本次分数基于完整 Mock Test 的整体表现生成，仅供练习参考。",
    criteria,
    partBreakdowns,
    promptBreakdowns,
    improvementPlan: [
      "先把 Part 1 的每一道题稳定到“观点 + 原因 + 例子”的三步结构。",
      "Part 2 重点补细节，避免只说骨架不说画面。",
      "Part 3 练习抽象题时的立场表达和论证深度。",
      "每天复盘 3 个可复用的高分词组，并主动带入回答。",
      "针对语法和发音做录音回听，优先修正最影响可懂度的问题。",
    ],
    transcripts,
    provider: "demo-fallback",
    transcriptProvider,
  };
}

export async function generateMockAiAssessment(
  options: GenerateMockAssessmentOptions,
): Promise<
  Omit<
    MockAssessmentResult,
    "completedAt" | "totalDurationSeconds" | "part1Theme" | "part2Topic" | "part3Topic" | "transcripts" | "provider" | "transcriptProvider"
  >
> {
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

  const payload = parseJsonContent(content);

  return {
    predictedOverallBand: clampBand(Number(payload.predictedOverallBand ?? 0)),
    fluency: clampBand(Number(payload.fluency ?? 0)),
    lexical: clampBand(Number(payload.lexical ?? 0)),
    grammar: clampBand(Number(payload.grammar ?? 0)),
    pronunciation: clampBand(Number(payload.pronunciation ?? 0)),
    confidenceNote:
      typeof payload.confidenceNote === "string" && payload.confidenceNote.trim()
        ? payload.confidenceNote.trim()
        : "本次分数基于完整 Mock Test 的整体表现生成，仅供练习参考。",
    criteria: sanitizeCriterion(payload.criteria),
    partBreakdowns: sanitizePartBreakdowns(payload.partBreakdowns),
    promptBreakdowns: sanitizePromptBreakdowns(payload.promptBreakdowns),
    improvementPlan: sanitizeStringArray(payload.improvementPlan, 5),
  };
}
