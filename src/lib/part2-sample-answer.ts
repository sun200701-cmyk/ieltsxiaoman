import type { DemoQuestion } from "@/lib/types";

function titleFromPrompt(prompt: string) {
  const normalized = prompt.replace(/^Describe\s+/i, "").replace(/[?.]$/, "").trim();
  return normalized ? normalized[0].toLowerCase() + normalized.slice(1) : "something memorable";
}

function sentenceFromCuePoint(cuePoint: string, index: number) {
  const point = cuePoint.replace(/^and explain\s+/i, "").replace(/^what\s+/i, "what ").trim();

  switch (index) {
    case 0:
      return `The first thing I should mention is ${point.charAt(0).toLowerCase() + point.slice(1)}, because that sets the scene clearly.`;
    case 1:
      return `I would then go on to explain ${point.charAt(0).toLowerCase() + point.slice(1)}, which helps make the story more specific and natural.`;
    case 2:
      return `After that, I could add details about ${point.charAt(0).toLowerCase() + point.slice(1)} so the answer feels more vivid.`;
    default:
      return `Finally, I would talk about ${point.charAt(0).toLowerCase() + point.slice(1)} to make the response feel complete.`;
  }
}

export function generatePart2SampleAnswer(question: DemoQuestion) {
  const cuePoints =
    question.cueCard
      ?.split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("- "))
      .map((line) => line.replace(/^- /, "").trim()) ?? [];

  const topic = titleFromPrompt(question.prompt);
  const opening = `I’d like to talk about ${topic}. It is a topic I can relate to quite easily, and I think it would make a strong IELTS Part 2 answer because I can describe it from both a personal and a reflective angle.`;

  const body = cuePoints.length
    ? cuePoints.map((item, index) => sentenceFromCuePoint(item, index)).join(" ")
    : `I would start with a clear background, then explain what happened in a logical order, and finally focus on why this experience stayed in my mind.`;

  const closing = `Overall, this is the kind of answer that can work well for Band 8 because it is specific, well-organized, and easy to follow, while still sounding personal rather than memorized.`;

  return [opening, body, closing].join(" ");
}
