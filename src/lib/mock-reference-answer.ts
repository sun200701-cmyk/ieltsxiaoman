import { part2ReferenceAnswersById } from "@/lib/reference-answers";
import { findReferenceAnswerByQuestionText } from "@/lib/reference-answer-lookup";
import type { MockPrompt } from "@/lib/types";

function sanitize(raw: string) {
  const text = raw.replace(/\s+/g, " ").trim();
  if (!text || /[\u4e00-\u9fff]/.test(text)) {
    return "";
  }
  return text;
}

export function getMockPromptReferenceAnswer(prompt: MockPrompt) {
  if (prompt.part === "Part 2") {
    const baseId = prompt.id.replace(/-p2$/, "");
    return sanitize(part2ReferenceAnswersById[baseId] || "");
  }

  return sanitize(findReferenceAnswerByQuestionText(prompt.prompt));
}
