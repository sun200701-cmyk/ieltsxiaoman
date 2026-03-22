"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  ChartColumnIncreasing,
  Check,
  CirclePlay,
  ClipboardList,
  MessageSquareQuote,
  Sparkles,
  Target,
} from "lucide-react";

import { AuthModal } from "@/components/auth-modal";
import { useAuth } from "@/components/auth-provider";

const navAnchors = [
  { href: "#features", label: "功能" },
  { href: "#showcase", label: "体验" },
  { href: "#entry", label: "开始使用" },
];

const scoreRows = [
  { label: "流利度与连贯性", score: "7.0", note: "表达顺畅，整体结构比较自然" },
  { label: "词汇资源", score: "7.0", note: "有较丰富替换，表达更灵活" },
  { label: "语法范围与准确性", score: "6.5", note: "复杂句已出现，但稳定性还可继续提升" },
  { label: "发音", score: "7.0", note: "整体清晰自然，重音和节奏较稳" },
];

const featureSteps = [
  {
    num: "01",
    title: "先看清楚你为什么没有上到目标分",
    summary: "雅小满会按 IELTS 官方口语维度拆分评分，让你知道问题到底出在哪一项。",
    bullets: [
      "总分之外，还会单独展示流利度、词汇、语法、发音四项表现",
      "每一项都有简短解释，不只是一个数字",
      "你能马上看出，自己是卡在表达、语法还是发音",
    ],
    callout: "先看清问题，提分才会更快。",
    demo: (
      <div className="grid gap-3">
        {scoreRows.map((row) => (
          <div key={row.label} className="rounded-[26px] border border-black/8 bg-white p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[#101828]">{row.label}</p>
                <p className="mt-1 text-sm text-[#667085]">{row.note}</p>
              </div>
              <p className="text-2xl font-semibold tracking-[-0.05em] text-[#101828]">{row.score}</p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#ece3d6]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#171717,#8d7557)]"
                style={{ width: `${(Number(row.score) / 9) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    num: "02",
    title: "再给你一个更像 Band 7+ 的参考说法",
    summary: "系统不只指出问题，还会基于你的原意生成更高分表达，让你知道下一次可以怎么说。",
    bullets: [
      "高分示例不会完全脱离你的回答，而是沿着原意升级",
      "普通回答和更高分说法并排展示，差距一眼能看出来",
      "你能直接模仿更自然的连接、展开和细节表达",
    ],
    callout: "知道哪里不好是一回事，知道更好的答案怎么说更重要。",
    demo: (
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[30px] border border-black/8 bg-[#f6efe4] p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[#8d7557]">你的原始回答</p>
          <p className="mt-4 text-lg leading-8 text-[#4f463d]">
            When I need to relax, I usually go for a long walk near my apartment and listen to music.
          </p>
          <div className="mt-5 flex items-end justify-between">
            <span className="text-sm text-[#8d7557]">表达自然，但细节还能更丰富</span>
            <span className="text-3xl font-semibold tracking-[-0.05em] text-[#101828]">6.5</span>
          </div>
        </div>
        <div className="rounded-[30px] border border-[#8d7557]/16 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[#8d7557]">更高分示例</p>
          <p className="mt-4 text-lg leading-8 text-[#101828]">
            If I feel stressed after class, I prefer to step outside, slow down a little, and clear my
            head with music.
          </p>
          <div className="mt-5 flex items-end justify-between">
            <span className="text-sm text-[#8d7557]">连接更自然，内容更完整</span>
            <span className="text-3xl font-semibold tracking-[-0.05em] text-[#101828]">7.5</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    num: "03",
    title: "最后把结果变成一份你今天就能执行的提分计划",
    summary: "你不需要再猜自己该练什么。雅小满会把短板、目标分数和当天任务一起给出来。",
    bullets: [
      "自动告诉你应该先突破哪一项",
      "给出更清楚的阶段目标，而不是一句笼统建议",
      "你可以按计划去练，而不是反复盲练",
    ],
    callout: "有分数很重要，但知道下一步怎么练更重要。",
    demo: (
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["目标分数", "7.5", "在现有基础上继续冲击 7.5"],
          ["优先突破", "语法", "重点提高复杂句稳定性和细节展开"],
          ["今日任务", "20 分钟", "跟读 6 分钟 + 复述 8 分钟 + 自答 6 分钟"],
        ].map(([title, value, detail]) => (
          <div key={title} className="rounded-[28px] border border-black/8 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-[#8d7557]">{title}</p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-[#101828]">{value}</p>
            <p className="mt-3 text-sm leading-7 text-[#5b5349]">{detail}</p>
          </div>
        ))}
      </div>
    ),
  },
];

const showcaseCards = [
  {
    title: "评分结果页",
    desc: "像老师批改一样看到维度分数、问题摘要和重点短板。",
    icon: ChartColumnIncreasing,
  },
  {
    title: "高分示例对照",
    desc: "普通回答和更高分说法同时出现，方便你直接模仿。",
    icon: MessageSquareQuote,
  },
  {
    title: "提分训练计划",
    desc: "把结果变成每日动作和阶段目标，不再只是看完报告就结束。",
    icon: Target,
  },
  {
    title: "提分任务拆解",
    desc: "把口语问题拆成更容易执行的小任务，帮助你更快进入备考状态。",
    icon: ClipboardList,
  },
];

export function HomeExperience() {
  const { user } = useAuth();
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <main className="mx-auto flex w-full max-w-[1480px] flex-col px-4 pb-16 pt-4 sm:px-6 sm:pb-20 sm:pt-6 lg:px-10 lg:pb-24">
        <section className="rounded-[38px] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,241,232,0.93))] shadow-[0_24px_80px_rgba(16,24,40,0.06)]">
          <div className="flex items-center justify-between border-b border-black/6 px-4 py-4 sm:px-6 lg:px-8">
            <div className="text-2xl font-semibold tracking-[-0.05em] text-[#101828]">雅小满</div>
            <nav className="hidden items-center gap-8 md:flex">
              {navAnchors.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm text-[#6b6255] transition hover:text-[#101828]"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="grid gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-[minmax(0,1.08fr)_520px] lg:gap-12 lg:px-10 lg:py-16">
            <div className="flex flex-col justify-center">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-black/8 bg-white px-4 py-2 text-[11px] font-medium uppercase tracking-[0.24em] text-[#7f6c55]">
                <Sparkles className="h-3.5 w-3.5" />
                GPT-5.4 定制化口语评分
              </div>

              <h1 className="mt-5 max-w-[920px] text-[2.3rem] font-semibold tracking-[-0.08em] text-[#101828] sm:mt-6 sm:text-[4.4rem] lg:text-[5.4rem] lg:leading-[0.94]">
                让每一次口语练习，
                <br />
                都离目标分更近一点
              </h1>

              <p className="mt-5 max-w-[700px] text-sm leading-7 text-[#4f463d] sm:mt-6 sm:text-lg sm:leading-8">
                雅小满会先按 IELTS 官方维度为你的口语打分，再给出更高分示例和专属提分计划。
                你不只是看到结果，还会知道下一步怎么练。
              </p>

              <div className="mt-7 grid gap-3 sm:mt-8 sm:flex sm:flex-wrap">
                <a href="#features" className="brand-button">
                  看看它怎么帮你提分
                  <ArrowRight className="h-4 w-4" />
                </a>
                <Link href="/speaking-practice" className="ghost-button sm:w-auto">
                  直接进入
                  <CirclePlay className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="rounded-[30px] border border-black/8 bg-white p-4 shadow-[0_18px_50px_rgba(16,24,40,0.05)] sm:rounded-[34px] sm:p-5">
              <div className="flex items-start justify-between gap-4 border-b border-black/6 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[#8d7557]">口语评分预览</p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[#101828]">Band 7.0</p>
                </div>
                <div className="rounded-full bg-[#101828] px-4 py-2 text-xs font-semibold tracking-[0.2em] text-white uppercase">
                  GPT-5.4
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {scoreRows.map((row) => (
                  <div key={row.label} className="rounded-[24px] border border-black/8 bg-[#fffdf9] p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm text-[#5b5349]">{row.label}</p>
                      <p className="text-lg font-semibold text-[#101828]">{row.score}</p>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#ece3d6]">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,#171717,#8d7557)]"
                        style={{ width: `${(Number(row.score) / 9) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[28px] border border-[#8d7557]/14 bg-[#f7f1e8] p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-[#8d7557]">本次总结</p>
                <p className="mt-3 text-sm leading-7 text-[#4f463d]">
                  你的表达已经比较自然，发音和流利度表现稳定。接下来如果继续提升语法复杂度和细节展开，分数还有机会往上走。
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 border-y border-black/8 py-6">
          <div className="grid gap-5 text-center sm:grid-cols-2 md:grid-cols-4">
            <div>
              <p className="text-3xl font-semibold tracking-[-0.05em] text-[#101828]">4 项</p>
              <p className="mt-2 text-sm text-[#6b6255]">官方口语维度拆分评分</p>
            </div>
            <div>
              <p className="text-3xl font-semibold tracking-[-0.05em] text-[#101828]">1 次</p>
              <p className="mt-2 text-sm text-[#6b6255]">练习就能看到完整分析</p>
            </div>
            <div>
              <p className="text-3xl font-semibold tracking-[-0.05em] text-[#101828]">3 步</p>
              <p className="mt-2 text-sm text-[#6b6255]">评分、示例、提分计划</p>
            </div>
            <div>
              <p className="text-3xl font-semibold tracking-[-0.05em] text-[#101828]">0 门槛</p>
              <p className="mt-2 text-sm text-[#6b6255]">帮助初学者快速掌握雅思口语考试</p>
            </div>
          </div>
        </section>

        <section id="features" className="pt-16 sm:pt-24">
          <div className="mb-12 flex items-center gap-4 sm:mb-16 sm:gap-6">
            <div className="h-px flex-1 bg-black/8" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8d7557]">Features</span>
            <div className="h-px flex-1 bg-black/8" />
          </div>

          <div className="grid gap-14 sm:gap-20">
            {featureSteps.map((step, index) => (
              <section
                key={step.num}
                className={`grid grid-cols-1 gap-8 border-b border-black/8 pb-14 last:border-b-0 last:pb-0 sm:gap-10 sm:pb-18 lg:grid-cols-12 lg:gap-16 ${
                  index % 2 === 1 ? "lg:[&>div:first-child]:order-2 lg:[&>div:last-child]:order-1" : ""
                }`}
              >
                <div className="lg:col-span-5">
                  <div className="space-y-6 lg:sticky lg:top-24">
                    <span className="block text-[clamp(4rem,8vw,7rem)] leading-none font-semibold tracking-[-0.08em] text-[#101828]/8">
                      {step.num}
                    </span>

                    <div className="max-w-md space-y-4">
                      <h2 className="text-xl font-semibold tracking-[-0.05em] text-[#101828] sm:text-3xl">
                        {step.title}
                      </h2>
                      <div className="rounded-[24px] border border-[#8d7557]/12 bg-[linear-gradient(180deg,#f7f1e8,#f4ede2)] px-5 py-4">
                        <p className="text-base font-medium leading-7 text-[#2a2218]">{step.summary}</p>
                      </div>
                    </div>

                    <ul className="space-y-3">
                      {step.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-3 text-sm leading-7 text-[#5b5349]">
                          <span className="mt-[0.55rem] h-1.5 w-1.5 rounded-full bg-[#8d7557]" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="border-l-2 border-[#8d7557]/40 bg-[#faf6ef] py-3 pl-4">
                      <p className="text-sm leading-7 text-[#4f463d]">{step.callout}</p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <div className="rounded-[28px] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(249,244,236,0.96))] p-4 shadow-[0_20px_56px_rgba(16,24,40,0.05)] sm:rounded-[34px] sm:p-7">
                    {step.demo}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </section>

        <section id="showcase" className="pt-16 sm:pt-24">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8d7557]">Experience</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.06em] text-[#101828] sm:text-[3.4rem]">
              练完之后，你会得到的不只是一个分数
            </h2>
            <p className="mt-5 text-base leading-8 text-[#5b5349]">
              你会看到自己的问题、能参考的高分表达，以及接下来怎么练。这样每一次练习都更有方向。
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {showcaseCards.map((card) => (
              <div
                key={card.title}
                className="rounded-[30px] border border-black/8 bg-white p-6 shadow-[0_18px_48px_rgba(16,24,40,0.04)]"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5ede1]">
                  <card.icon className="h-5 w-5 text-[#8d7557]" />
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-[-0.04em] text-[#101828]">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5b5349]">{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[28px] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,241,232,0.96))] p-5 shadow-[0_18px_56px_rgba(16,24,40,0.04)] sm:rounded-[34px] sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[#8d7557]">你会体验到什么</p>
                <h3 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#101828]">
                  每一次练习，都会比“做完就结束”更进一步
                </h3>
                <div className="mt-6 grid gap-3">
                  {[
                    "知道自己为什么拿这个分",
                    "看到更高分的表达应该怎么说",
                    "知道下一步最值得练什么",
                    "可以直接进入题库继续练下去",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm text-[#4f463d]">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f5ede1]">
                        <Check className="h-4 w-4 text-[#8d7557]" />
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-black/8 bg-white p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-[#8d7557]">适合什么阶段</p>
                <p className="mt-4 text-base leading-8 text-[#4f463d]">
                  如果你已经练过很多题，但还是不知道自己到底差在哪里，或者总觉得“好像说得还行，却一直上不去分”，这套评分方式会更适合你。
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="entry"
          className="mt-16 grid gap-6 rounded-[30px] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,241,232,0.95))] px-4 py-6 shadow-[0_24px_80px_rgba(16,24,40,0.05)] sm:mt-24 sm:rounded-[40px] sm:px-8 sm:py-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-10"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#8d7557]">Ready To Start</p>
            <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-[-0.07em] text-[#101828] sm:text-[3.4rem]">
              现在就开始一轮口语练习
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-[#5b5349]">
              从题库练习到口语评分，再到高分示例和提分计划，你可以直接体验完整的雅思口语练习流程。
            </p>
          </div>

          <div className="grid gap-4 rounded-[28px] border border-black/8 bg-white p-4 sm:rounded-[32px] sm:p-5">
            {user ? (
              <Link
                href="/speaking-practice"
                className="group rounded-[28px] border border-black/8 bg-[linear-gradient(180deg,#fffdf9,#f6efe4)] p-6 shadow-[0_14px_34px_rgba(16,24,40,0.05)] transition hover:-translate-y-0.5 hover:border-[#8d7557]/20"
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-[#8d7557]">已登录</p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-[#101828]">直接进入练习</h3>
                    <p className="mt-3 max-w-md text-sm leading-7 text-[#5b5349]">
                      继续进入题库练习，体验口语评分、高分示例和提分计划。
                    </p>
                  </div>
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#101828] text-white transition group-hover:translate-x-0.5">
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </div>
              </Link>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("register");
                    setAuthOpen(true);
                  }}
                  className="brand-button w-full justify-between"
                >
                  注册
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("login");
                    setAuthOpen(true);
                  }}
                  className="ghost-button w-full justify-between"
                >
                  登录
                  <ArrowRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </section>
      </main>

      <AuthModal open={authOpen} mode={authMode} onClose={() => setAuthOpen(false)} />
    </>
  );
}
