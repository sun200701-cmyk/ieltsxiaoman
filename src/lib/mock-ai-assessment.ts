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

  const payload = parseJsonContent(content);
  const criteria = sanitizeCriterion(payload.criteria);
  const partBreakdowns = sanitizePartBreakdowns(payload.partBreakdowns);
  const promptBreakdowns = sanitizePromptBreakdowns(payload.promptBreakdowns);
  const improvementPlan = sanitizeStringArray(payload.improvementPlan, 5);

  if (criteria.length !== 4) {
    throw new Error("Mock assessment criteria are incomplete.");
  }
  if (partBreakdowns.length !== 3) {
    throw new Error("Mock assessment part breakdowns are incomplete.");
  }
  if (promptBreakdowns.length !== options.transcripts.length) {
    throw new Error("Mock assessment prompt breakdowns are incomplete.");
  }
  if (improvementPlan.length < 3) {
    throw new Error("Mock assessment improvement plan is incomplete.");
  }

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
    criteria,
    partBreakdowns,
    promptBreakdowns,
    improvementPlan,
    transcripts: options.transcripts,
    provider: "ai-scored",
    transcriptProvider: "tencent-cloud",
  };
}
