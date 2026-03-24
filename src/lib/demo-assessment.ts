import type { AssessmentResult, DemoQuestion } from "@/lib/types";
import { transcribeWithTencentAsr } from "@/lib/tencent-asr";

type AssessmentOptions = {
  question: DemoQuestion;
  transcript: string;
  durationSeconds: number;
  audioBytes: number;
  provider: AssessmentResult["provider"];
  transcriptProvider?: AssessmentResult["transcriptProvider"];
};

function hashSeed(input: string) {
  return input.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
}

function clampBand(score: number) {
  return Number((Math.round(Math.min(8, Math.max(5, score)) * 2) / 2).toFixed(1));
}

function buildFallbackTranscript(question: DemoQuestion) {
  return `[Transcript unavailable: ${question.part} ${question.title}]`;
}

function buildPolishedVersion(transcript: string) {
  const cleaned = transcript.replace(/\s+/g, " ").trim();
  if (!cleaned) {
    return "";
  }

  return cleaned
    .replace(/\bI think\b/gi, "I would say")
    .replace(/\breally\b/gi, "genuinely")
    .replace(/\bvery\b/gi, "fairly")
    .replace(/\bgood\b/gi, "beneficial")
    .replace(/\bbad\b/gi, "less effective");
}

function buildAnswerThinking(question: DemoQuestion) {
  if (question.part === "Part 2") {
    return [
      "先用一句话点明你要讲的人、事、物或经历，别绕圈。",
      "按照时间或场景顺序交代 2 到 3 个关键信息，让考官容易跟上。",
      "重点展开一个最有画面感的细节或感受，把故事说具体。",
      "最后总结这件事为什么重要，或它对你有什么影响。",
    ];
  }

  if (question.part === "Part 3") {
    return [
      "先直接表明立场，不要一开始说得太模糊。",
      "马上给出一个核心原因，说明你为什么这样看。",
      "补一个社会现象、对比例子或结果影响，让观点更有深度。",
      "最后回扣问题，用一句总结把观点收住。",
    ];
  }

  return [
    "先直接回答问题，给出最清楚的第一反应。",
    "补充一个具体原因，让回答不只停留在 yes/no。",
    "接着加一个个人经历、习惯或小例子，把内容说实。",
    "最后补一句感受或补充说明，让整段回答更完整。",
  ];
}

export async function transcribeWithTencentOrFallback(audio: File, question: DemoQuestion) {
  try {
    const transcript = await transcribeWithTencentAsr(audio);
    return {
      transcript,
      provider: "tencent-cloud" as const,
      error: null,
    };
  } catch (error) {
    return {
      transcript: buildFallbackTranscript(question),
      provider: "demo-fallback" as const,
      error: error instanceof Error ? error.message : "Tencent ASR transcription failed.",
    };
  }
}

export function generateDemoAssessment({
  question,
  transcript,
  durationSeconds,
  audioBytes,
  provider,
  transcriptProvider,
}: AssessmentOptions): AssessmentResult {
  const seed = hashSeed(`${question.id}${durationSeconds}${audioBytes}`);
  const base = 5.6 + (seed % 18) / 10;
  const fluency = clampBand(base + 0.2);
  const lexical = clampBand(base - 0.1);
  const grammar = clampBand(base);
  const pronunciation = clampBand(base + 0.1);
  const overallBand = clampBand((fluency + lexical + grammar + pronunciation) / 4);

  return {
    overallBand,
    fluency,
    lexical,
    grammar,
    pronunciation,
    estimatedLevel: overallBand >= 7 ? "具备稳定 Band 7 基础" : "距离稳定高分还有明显提升空间",
    transcript,
    answerThinking: buildAnswerThinking(question),
    strengths: [
      "回答结构基本完整，能够围绕题目展开。",
      "内容里有个人信息和例子，听感不会太空泛。",
    ],
    nextSteps: [
      "先把回答扩成“观点 + 原因 + 例子”的三步结构。",
      "减少 very good 这类普通表达，换成更具体的词组。",
      "重点检查动词形式和句子连接，不要说到一半断掉。",
    ],
    masteredPhrases: [
      "completely transformed",
      "limited by distance",
      "in real life",
      "artificial intelligence",
    ],
    examinerFeedback:
      "这次回答基本切题，但距离更高分数段还差在表达不够具体、句式层次不够以及语法稳定性不足。下一步要优先练“展开观点”和“把普通表达换成更自然的高分表达”。",
    targetBandGap:
      "距离下一个分数段，主要差在用词还不够具体、答案展开深度不足，以及语法形式偶尔不稳定。",
    weeklyFocus: [
      "优先练“观点 + 原因 + 例子”这套展开方式。",
      "每天积累 3 组更自然的高分表达，替换普通词。",
      "专门检查动词形式、时态和主谓一致。",
    ],
    dailyFifteenPlan: [
      "前 5 分钟：大声复述 1 个参考答案里的高分表达。",
      "中间 5 分钟：围绕今天题目说 2 次，每次只讲 30 到 45 秒。",
      "最后 5 分钟：对照点评，改掉最影响分数的 1 到 2 个错误。",
    ],
    scoreKillers: [
      "表达太泛，只说 good / nice / very important 这类普通词。",
      "句子连接弱，回答像堆信息，缺少清晰展开。",
      "动词形式和语法细节不稳定，容易丢分。",
    ],
    sevenDaySprintPlan: [
      "Day 1：只练审题和一句话开头，确保回答直接切题。",
      "Day 2：把每个观点都补上一个原因。",
      "Day 3：给每道题都补一个个人例子。",
      "Day 4：集中替换普通表达，积累 Band 6 说法。",
      "Day 5：继续把表达升级到更自然的 Band 7 说法。",
      "Day 6：重点检查语法稳定性和句子连接。",
      "Day 7：完整模拟一轮，录音并复盘本周最常见的问题。",
    ],
    polishedVersion: buildPolishedVersion(transcript),
    provider,
    transcriptProvider,
    completedAt: new Date().toISOString(),
    durationSeconds,
  };
}
