import type { DemoQuestion } from "@/lib/types";

export type ThinkingFramework = {
  kicker: string;
  title: string;
  opening: string;
  checkpoints: string[];
  structure: string[];
  phrases: string[];
  avoid: string[];
};

const keywordBanks = [
  {
    match: ["food", "meal", "cook", "restaurant"],
    opening: "先明确你的偏好，再补一个具体场景，最后解释为什么这个选择对你有意义。",
    checkpoints: ["先说你最喜欢什么", "补一个真实经历或固定习惯", "用口味、方便、情绪价值去解释"],
    phrases: ["what I like most is...", "one reason is that...", "it reminds me of..."],
    avoid: ["不要只说 delicious", "不要只有菜名，没有原因"],
  },
  {
    match: ["animal", "pet"],
    opening: "先讲对象，再讲特点，最后讲你和它的关系或你为什么偏爱它。",
    checkpoints: ["先点名是哪种动物", "抓一两个显著特点", "补充个人原因或文化背景"],
    phrases: ["I’m especially fond of...", "what stands out is...", "it gives me a sense of..."],
    avoid: ["不要只说 cute", "不要把所有特点堆在一起"],
  },
  {
    match: ["work", "study", "subject", "school", "job"],
    opening: "先交代你现在的学习/工作状态，再展开具体内容，最后说明未来计划或个人感受。",
    checkpoints: ["先给身份背景", "讲具体学科/工作内容", "收束到未来计划或价值判断"],
    phrases: ["at the moment...", "what I mainly do is...", "in the long run..."],
    avoid: ["不要背景过长", "不要只列任务，不讲感受"],
  },
  {
    match: ["home", "accommodation", "room", "house", "apartment"],
    opening: "先说居住类型，再讲最有感受的空间细节，最后落到舒适感和日常使用。",
    checkpoints: ["先说住在哪里", "补空间布局或氛围", "解释为什么住起来舒服或不舒服"],
    phrases: ["I currently live in...", "the part I like most is...", "it feels... because..."],
    avoid: ["不要只说大或小", "不要没有生活化细节"],
  },
  {
    match: ["hometown", "city", "area", "neighborhood"],
    opening: "先定位地点，再讲特点，再讲你和这个地方的关系。",
    checkpoints: ["先交代地理位置或规模", "讲环境/人/节奏", "加入成长经历或归属感"],
    phrases: ["it’s located in...", "what I appreciate most is...", "I feel attached to it because..."],
    avoid: ["不要只给地名", "不要只有客观信息，没有个人连接"],
  },
  {
    match: ["technology", "phone", "app", "computer", "online"],
    opening: "先表态它带来了什么变化，再讲具体例子，最后补一层正反两面的评价。",
    checkpoints: ["先给核心观点", "举出生活中的真实例子", "最后稍微平衡一下利弊"],
    phrases: ["it has changed...", "for example...", "at the same time..."],
    avoid: ["不要只有宏观判断", "不要没有例子支撑"],
  },
  {
    match: ["travel", "trip", "journey", "place"],
    opening: "先说地点或经历，再讲过程中的亮点，最后讲感受或影响。",
    checkpoints: ["先交代时间地点", "抓一个最有画面的细节", "收尾讲感受或收获"],
    phrases: ["what I remember most is...", "during the trip...", "it left a strong impression on me"],
    avoid: ["不要流水账", "不要没有重点瞬间"],
  },
];

function pickBank(text: string) {
  const lower = text.toLowerCase();
  return (
    keywordBanks.find((bank) => bank.match.some((keyword) => lower.includes(keyword))) ?? {
      opening: "先直接回答，再补细节，最后给一个简短总结或个人态度。",
      checkpoints: ["先给主答案", "补一个例子或原因", "最后总结一下"],
      phrases: ["personally speaking...", "for instance...", "overall..."],
      avoid: ["不要绕开问题", "不要只讲抽象观点"],
    }
  );
}

export function generateThinkingFramework(question: DemoQuestion, currentPrompt?: string): ThinkingFramework {
  const prompt = currentPrompt ?? question.prompt;
  const bank = pickBank(`${question.title} ${prompt}`);

  if (question.part === "Part 1") {
    return {
      kicker: "Part 1 Framework",
      title: `围绕“${prompt}”的 20-30 秒回答框架`,
      opening: bank.opening,
      checkpoints: [
        "第一句直接回应问题，不要铺垫太久",
        ...bank.checkpoints,
      ].slice(0, 4),
      structure: [
        "1. 先用一句话直接表明你的答案或偏好。",
        "2. 用一到两个细节解释为什么。",
        "3. 如果有余量，补一个小例子或对比。",
        "4. 最后用一句短总结收尾。",
      ],
      phrases: bank.phrases,
      avoid: bank.avoid,
    };
  }

  const cuePoints =
    question.cueCard
      ?.split("\n")
      .filter((line) => line.startsWith("- "))
      .map((line) => line.replace("- ", "").trim()) ?? [];

  return {
    kicker: "Part 2 Framework",
    title: `围绕“${question.title}”的 1-2 分钟展开框架`,
    opening: "先用一句话点题，再按顺序把 cue card 的信息展开，不要一上来就丢细节。",
    checkpoints: cuePoints.length > 0 ? cuePoints : bank.checkpoints,
    structure: [
      "1. 开头一句直接告诉考官你要讲谁/什么。",
      "2. 中间按 cue card 顺序展开，每一点至少补一个细节。",
      "3. 选一个最有画面的瞬间重点描述。",
      "4. 结尾解释为什么这个经历/对象值得你讲。",
    ],
    phrases: [
      "I’d like to talk about...",
      "what made it memorable was...",
      "another detail worth mentioning is...",
      "overall, the reason it stands out is that...",
    ],
    avoid: ["不要把 cue card 逐字念出来", "不要每一点都只说一句", "结尾不要突然停住"],
  };
}
