import { requiredPart1AnswersByQuestionText } from "@/lib/reference-required-part1-answers";
import { referenceAnswersByQuestionText } from "@/lib/reference-question-answers";

const mergedReferenceAnswers = {
  ...referenceAnswersByQuestionText,
  ...requiredPart1AnswersByQuestionText,
};

function normalizeQuotes(text: string) {
  return text
    .replace(/[’‘`´]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[？]/g, "?")
    .replace(/[！]/g, "!")
    .replace(/[，]/g, ",")
    .replace(/[：]/g, ":")
    .replace(/[；]/g, ";");
}

export function normalizeReferenceKey(text: string) {
  return normalizeQuotes(text)
    .replace(/\\+"/g, " ")
    .replace(/[?.!,:;()[\]"'/\\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function looseNormalizeReferenceKey(text: string) {
  return normalizeReferenceKey(text).replace(/[^a-z0-9]+/g, "");
}

type ReferenceEntry = {
  key: string;
  normalized: string;
  loose: string;
  answer: string;
};

const referenceEntries: ReferenceEntry[] = Object.entries(mergedReferenceAnswers).map(([key, answer]) => ({
  key,
  normalized: normalizeReferenceKey(key),
  loose: looseNormalizeReferenceKey(key),
  answer,
}));

const normalizedAnswerMap = new Map(referenceEntries.map((entry) => [entry.normalized, entry.answer]));
const looseAnswerMap = new Map(referenceEntries.map((entry) => [entry.loose, entry.answer]));

export function findReferenceAnswerByQuestionText(questionText: string) {
  const direct = mergedReferenceAnswers[questionText];
  if (direct) {
    return direct;
  }

  const normalized = normalizeReferenceKey(questionText);
  const exactNormalized = normalizedAnswerMap.get(normalized);
  if (exactNormalized) {
    return exactNormalized;
  }

  const loose = looseNormalizeReferenceKey(questionText);
  const exactLoose = looseAnswerMap.get(loose);
  if (exactLoose) {
    return exactLoose;
  }

  const candidates = referenceEntries
    .map((entry) => {
      if (!entry.loose || !loose) {
        return { entry, score: 0 };
      }

      if (entry.loose.includes(loose) || loose.includes(entry.loose)) {
        return {
          entry,
          score: Math.min(entry.loose.length, loose.length) / Math.max(entry.loose.length, loose.length),
        };
      }

      const entryTokens = new Set(entry.normalized.split(" ").filter(Boolean));
      const promptTokens = new Set(normalized.split(" ").filter(Boolean));
      const overlap = [...promptTokens].filter((token) => entryTokens.has(token)).length;
      const score = overlap / Math.max(promptTokens.size, entryTokens.size, 1);

      return { entry, score };
    })
    .filter((item) => item.score >= 0.72)
    .sort((left, right) => right.score - left.score);

  return candidates[0]?.entry.answer || "";
}
