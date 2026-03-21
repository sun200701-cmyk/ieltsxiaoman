import { part2ReferenceAnswersById } from "@/lib/reference-answers";
import { referenceAnswersByQuestionText } from "@/lib/reference-question-answers";
import { requiredPart1AnswersByQuestionText } from "@/lib/reference-required-part1-answers";
import type { AssessmentResult, DemoQuestion } from "@/lib/types";

type GenerateAiAssessmentOptions = {
  question: DemoQuestion;
  currentQuestionText: string;
  transcript: string;
  durationSeconds: number;
};

type AiAssessmentPayload = Pick<
  AssessmentResult,
  | "overallBand"
  | "fluency"
  | "lexical"
  | "grammar"
  | "pronunciation"
  | "estimatedLevel"
  | "strengths"
  | "nextSteps"
  | "masteredPhrases"
  | "examinerFeedback"
  | "targetBandGap"
  | "weeklyFocus"
  | "dailyFifteenPlan"
  | "scoreKillers"
  | "sevenDaySprintPlan"
  | "expressionUpgrades"
>;

type ChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string | Array<{ type?: string; text?: string }>;
    };
  }>;
};

function normalizeQuestionKey(text: string) {
  return text
    .replace(/[?.!,:;()[\]"']/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function clampBand(score: number) {
  const rounded = Math.round(Math.min(9, Math.max(0, score)) * 2) / 2;
  return Number(rounded.toFixed(1));
}

function getReferenceAnswer(question: DemoQuestion, currentQuestionText: string) {
  if (question.part === "Part 2") {
    return part2ReferenceAnswersById[question.id] || question.sampleAnswer || "";
  }

  const normalizedCurrent = normalizeQuestionKey(currentQuestionText);
  const merged = {
    ...referenceAnswersByQuestionText,
    ...requiredPart1AnswersByQuestionText,
  };

  return (
    merged[currentQuestionText] ||
    Object.entries(merged).find(([key]) => normalizeQuestionKey(key) === normalizedCurrent)?.[1] ||
    ""
  );
}

function buildPrompt({
  question,
  currentQuestionText,
  transcript,
  durationSeconds,
}: GenerateAiAssessmentOptions) {
  const cueCard = question.cueCard?.trim() || "";
  const referenceAnswer = getReferenceAnswer(question, currentQuestionText);

  return `
You are a strict IELTS Speaking coach and examiner.
Evaluate the candidate's answer and return valid JSON only.

Scoring rules:
- Score IELTS Speaking from 0 to 9 using 0.5 steps.
- Evaluate fluency/coherence, lexical resource, grammar, and pronunciation.
- Since only transcript text is available, estimate pronunciation conservatively.
- All explanatory feedback must be in Simplified Chinese.
- masteredPhrases and expressionUpgrades must stay in English.

Question metadata:
- Part: ${question.part}
- Topic title: ${question.title}
- Current prompt: ${currentQuestionText}
- Cue card: ${cueCard || "N/A"}
- Suggested reference answer: ${referenceAnswer || "N/A"}
- Duration seconds: ${durationSeconds}

Candidate transcript:
${transcript}

Return JSON with exactly this shape:
{
  "overallBand": number,
  "fluency": number,
  "lexical": number,
  "grammar": number,
  "pronunciation": number,
  "estimatedLevel": string,
  "strengths": string[],
  "nextSteps": string[],
  "masteredPhrases": string[],
  "examinerFeedback": string,
  "targetBandGap": string,
  "weeklyFocus": string[],
  "dailyFifteenPlan": string[],
  "scoreKillers": string[],
  "sevenDaySprintPlan": string[],
  "expressionUpgrades": [
    {
      "original": string,
      "band6": string,
      "band7": string,
      "band8": string
    }
  ]
}

Additional requirements:
- strengths: 2 concise Chinese points
- nextSteps: 3 concise Chinese actions
- masteredPhrases: 3 to 6 short English phrases actually used well by the candidate when possible
- examinerFeedback: 80 to 140 Chinese characters
- targetBandGap: explain in Chinese what mainly blocks the next band score
- weeklyFocus: exactly 3 Chinese items about the next 7 days
- dailyFifteenPlan: exactly 3 Chinese steps for a 15-minute daily routine
- scoreKillers: exactly 3 Chinese items
- sevenDaySprintPlan: exactly 7 Chinese items, one for each day
- expressionUpgrades: 2 or 3 entries, choose simple expressions from the candidate if possible; if the transcript is too advanced, choose common plain expressions related to the answer
- Return JSON only, no markdown fences, no extra explanation
  `.trim();
}

function extractContent(response: ChatCompletionResponse) {
  const content = response.choices?.[0]?.message?.content;
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => item.text || "")
      .join("")
      .trim();
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
    throw new Error("AI assessment response did not contain JSON.");
  }

  return JSON.parse(match[0]);
}

function sanitizeStringArray(value: unknown, max = 10) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0).slice(0, max);
}

function sanitizeExpressionUpgrades(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map((item) => ({
      original: typeof item.original === "string" ? item.original.trim() : "",
      band6: typeof item.band6 === "string" ? item.band6.trim() : "",
      band7: typeof item.band7 === "string" ? item.band7.trim() : "",
      band8: typeof item.band8 === "string" ? item.band8.trim() : "",
    }))
    .filter((item) => item.original && item.band6 && item.band7 && item.band8)
    .slice(0, 3);
}

function sanitizeAiAssessment(payload: unknown): AiAssessmentPayload {
  const data = payload as Partial<AiAssessmentPayload>;

  return {
    overallBand: clampBand(Number(data.overallBand ?? 0)),
    fluency: clampBand(Number(data.fluency ?? 0)),
    lexical: clampBand(Number(data.lexical ?? 0)),
    grammar: clampBand(Number(data.grammar ?? 0)),
    pronunciation: clampBand(Number(data.pronunciation ?? 0)),
    estimatedLevel:
      typeof data.estimatedLevel === "string" && data.estimatedLevel.trim()
        ? data.estimatedLevel.trim()
        : "当前表达基础还在提升阶段",
    strengths: sanitizeStringArray(data.strengths, 2),
    nextSteps: sanitizeStringArray(data.nextSteps, 3),
    masteredPhrases: sanitizeStringArray(data.masteredPhrases, 6),
    examinerFeedback:
      typeof data.examinerFeedback === "string" && data.examinerFeedback.trim()
        ? data.examinerFeedback.trim()
        : "这次回答基本切题，但内容展开、语法稳定性和表达自然度仍有提升空间。",
    targetBandGap:
      typeof data.targetBandGap === "string" && data.targetBandGap.trim()
        ? data.targetBandGap.trim()
        : "距离下一个分数段，主要差在表达不够展开、句式层次不够和用词精确度不足。",
    weeklyFocus: sanitizeStringArray(data.weeklyFocus, 3),
    dailyFifteenPlan: sanitizeStringArray(data.dailyFifteenPlan, 3),
    scoreKillers: sanitizeStringArray(data.scoreKillers, 3),
    sevenDaySprintPlan: sanitizeStringArray(data.sevenDaySprintPlan, 7),
    expressionUpgrades: sanitizeExpressionUpgrades(data.expressionUpgrades),
  };
}

export async function generateAiAssessment(options: GenerateAiAssessmentOptions) {
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
          content: "You are an IELTS speaking scoring engine. Return strict JSON only.",
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
    throw new Error(`AI assessment request failed with ${response.status}.`);
  }

  const data = (await response.json()) as ChatCompletionResponse;
  const content = extractContent(data);
  if (!content) {
    throw new Error("AI assessment response content is empty.");
  }

  return sanitizeAiAssessment(parseJsonContent(content));
}
