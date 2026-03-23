import { questions } from "@/lib/questions";
import type { DemoQuestion, MockPrompt, MockTestSession } from "@/lib/types";

function shuffle<T>(items: T[]) {
  const list = [...items];

  for (let index = list.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [list[index], list[target]] = [list[target], list[index]];
  }

  return list;
}

function pickPart1QuestionCount(total: number) {
  if (total <= 4) return total;
  return 4 + Math.floor(Math.random() * Math.min(2, total - 3));
}

function buildPart1Prompts(question: DemoQuestion): MockPrompt[] {
  const prompts = shuffle([question.prompt, ...question.followUps]);
  const count = pickPart1QuestionCount(prompts.length);

  return prompts
    .slice(0, count)
    .map((prompt, index) => ({
      id: `${question.id}-p1-${index + 1}`,
      part: "Part 1",
      title: question.title,
      topic: question.title,
      prompt,
      cuePoints: [],
      timeLimitSeconds: 40,
    }));
}

function buildPart2Prompt(question: DemoQuestion): MockPrompt {
  const cuePoints =
    question.cueCard
      ?.split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("- "))
      .map((line) => line.replace(/^- /, "").trim()) ?? [];

  return {
    id: `${question.id}-p2`,
    part: "Part 2",
    title: question.title,
    topic: question.title,
    prompt: question.prompt,
    cuePoints,
    prepSeconds: 60,
    timeLimitSeconds: 120,
  };
}

function buildPart3Prompts(question: DemoQuestion): MockPrompt[] {
  return question.followUps.slice(0, 4).map((prompt, index) => ({
    id: `${question.id}-p3-${index + 1}`,
    part: "Part 3",
    title: question.linkedPart3Topic || `${question.title} Discussion`,
    topic: question.linkedPart3Topic || `${question.title} Discussion`,
    prompt,
    cuePoints: [],
    timeLimitSeconds: 55,
  }));
}

export function createFullMockTestSession(): MockTestSession {
  const part1RequiredThemes = questions.filter((question) => question.part === "Part 1" && question.isRequired);
  const part1GeneralThemes = questions.filter((question) => question.part === "Part 1" && !question.isRequired);
  const part2Questions = questions.filter((question) => question.part === "Part 2");

  const requiredTheme = shuffle(part1RequiredThemes)[0];
  const generalTheme = shuffle(part1GeneralThemes)[0];
  const part2Question = shuffle(part2Questions)[0];

  if (!requiredTheme || !generalTheme || !part2Question) {
    throw new Error("Question bank is incomplete for mock test generation.");
  }

  const part1RequiredPrompts = buildPart1Prompts(requiredTheme);
  const part1GeneralPrompts = buildPart1Prompts(generalTheme);
  const part2Prompt = buildPart2Prompt(part2Question);
  const part3Prompts = buildPart3Prompts(part2Question);

  return {
    id: `mock-${Date.now()}`,
    part1RequiredTheme: requiredTheme.title,
    part1GeneralTheme: generalTheme.title,
    part2Topic: part2Question.title,
    part3Topic: part2Question.linkedPart3Topic || `${part2Question.title} Discussion`,
    prompts: [...part1RequiredPrompts, ...part1GeneralPrompts, part2Prompt, ...part3Prompts],
  };
}
