import { part2ReferenceAnswersById } from "@/lib/reference-answers";
import { requiredPart1AnswersByQuestionText } from "@/lib/reference-required-part1-answers";
import { referenceAnswersByQuestionText } from "@/lib/reference-question-answers";
import type { MockPrompt } from "@/lib/types";

function normalize(text: string) {
  return text.replace(/[?.!,:;()[\]"']/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
}

function sanitize(raw: string) {
  const text = raw.replace(/\s+/g, " ").trim();
  if (!text || /[\u4e00-\u9fff]/.test(text)) {
    return "";
  }
  return text;
}

const normalizedAnswers = Object.fromEntries(
  Object.entries({
    ...referenceAnswersByQuestionText,
    ...requiredPart1AnswersByQuestionText,
  }).map(([key, value]) => [normalize(key), value]),
) as Record<string, string>;

export function getMockPromptReferenceAnswer(prompt: MockPrompt) {
  if (prompt.part === "Part 2") {
    const baseId = prompt.id.replace(/-p2$/, "");
    return sanitize(part2ReferenceAnswersById[baseId] || "");
  }

  return sanitize(
    requiredPart1AnswersByQuestionText[prompt.prompt] ||
      referenceAnswersByQuestionText[prompt.prompt] ||
      normalizedAnswers[normalize(prompt.prompt)] ||
      "",
  );
}
