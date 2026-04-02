import Link from "next/link";
import { ArrowRight } from "lucide-react";

const scenarios = [
  {
    title: "复试英语",
    description: "面对陌生问题时，也能稳定组织表达，不会只停留在背过的模板上。",
  },
  {
    title: "面试回答",
    description: "把零散想法说成完整答案，让表达听起来更自然、更可信。",
  },
  {
    title: "展示发言",
    description: "从自我介绍到课堂展示，减少卡顿、重复和临场慌乱。",
  },
];

const reasons = [
  {
    title: "很多人的难点在于开口表达",
    body: "看得懂、写得出，不代表说得出来。真正影响复试、面试和展示表现的，往往是你能不能在有限时间里把想法组织成自然表达。",
  },
  {
    title: "模板能应付熟题，但撑不起真实场景",
    body: "一旦问题换了表达方式，背过的内容就很容易失效。口语素养训练更关注思路、展开和表达稳定性，而不只是记答案。",
  },
  {
    title: "表达能力是长期收益，不只服务一次考试",
    body: "你练的是自我介绍、观点表达、经历描述、临场组织语言这些会反复用到的能力，而不只是某一套题。",
  },
];

const outcomes = [
  "把“会想不会说”练成“能直接开口说”",
  "让 30 到 60 秒的回答更完整、更有结构",
  "面对陌生话题也能稳定展开，不会只停留在背模板的状态",
  "让复试、面试、展示和日常交流都更从容",
];

const practiceFlow = [
  "进入题库，选一个和你最接近的真实场景开始练。",
  "直接录音回答，系统给你转写、评分和表达反馈。",
  "按提示重练，把表达从“会一点”练成“更自然”。",
];

export function RegularEnglishLanding() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1480px] flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <section className="mx-auto w-full max-w-[1380px]">
        <div className="border-b border-black/8 pb-14 pt-8 sm:pb-18 sm:pt-12">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.34em] text-[#8d7557]">
            Regular English
          </p>
          <h1 className="mx-auto mt-6 max-w-5xl text-center text-5xl font-semibold leading-[1.02] tracking-[-0.09em] text-[#101828] sm:text-7xl lg:text-[7rem]">
            口语素养，
            <br />
            让表达能力真正练出来
          </h1>
          <p className="mx-auto mt-8 max-w-4xl text-center text-base leading-8 text-[#5b5349] sm:text-xl sm:leading-10">
            复试、面试、自我介绍、展示发言这些场景里，真正能拉开差距的，往往是能不能自然开口、顺畅展开，
            把想法讲清楚。
          </p>
          <div className="mt-10 flex justify-center">
            <Link href="/regular-english/library" className="brand-button min-w-[250px] justify-center">
              进入题库开始练
            </Link>
          </div>
        </div>

        <div className="grid gap-8 border-b border-black/8 py-14 sm:py-18 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#8d7557]">Why Students Need This</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.06em] text-[#101828] sm:text-5xl">
              它和雅思题库的方向不同，
              <br />
              更贴近现实场景里的表达训练
            </h2>
          </div>

          <div className="grid gap-6">
            {reasons.map((item) => (
              <article key={item.title} className="border-t border-black/8 pt-6 first:border-t-0 first:pt-0">
                <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#101828]">{item.title}</h3>
                <p className="mt-3 text-base leading-8 text-[#5b5349] sm:text-lg sm:leading-9">{item.body}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="border-b border-black/8 py-14 sm:py-18">
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#8d7557]">Where It Helps</p>
            <h2 className="text-3xl font-semibold tracking-[-0.06em] text-[#101828] sm:text-5xl">
              适合那些不能只靠模板应付的时刻
            </h2>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-3">
            {scenarios.map((item) => (
              <article key={item.title} className="border-t border-black/8 pt-6">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8d7557]">{item.title}</p>
                <p className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-[#101828]">{item.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="grid gap-8 border-b border-black/8 py-14 sm:py-18 lg:grid-cols-[1fr_0.9fr]">
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#8d7557]">What You Get</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.06em] text-[#101828] sm:text-5xl">
              你真正得到的，
              <br />
              是更稳定的表达能力
            </h2>

            <div className="mt-10 grid gap-4">
              {outcomes.map((item) => (
                <div key={item} className="border-t border-black/8 py-4 text-base leading-8 text-[#344054] sm:text-lg sm:leading-9">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[32px] border border-black/8 bg-[rgba(255,255,255,0.72)] px-6 py-6 shadow-[0_18px_40px_rgba(16,24,40,0.04)] sm:px-8 sm:py-8">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#8d7557]">How It Works</p>
            <h3 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#101828]">开始练习只要 3 步</h3>
            <div className="mt-8 grid gap-6">
              {practiceFlow.map((item, index) => (
                <div key={item} className="border-t border-black/8 pt-5 first:border-t-0 first:pt-0">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8d7557]">Step {index + 1}</p>
                  <p className="mt-2 text-base leading-8 text-[#344054]">{item}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="py-14 text-center sm:py-18">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#8d7557]">Start Practicing</p>
          <h2 className="mx-auto mt-4 max-w-4xl text-3xl font-semibold tracking-[-0.06em] text-[#101828] sm:text-5xl">
            先从一个最熟悉的话题开始，
            <br />
            把“能说一点”练成“说得出来”
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-[#5b5349] sm:text-lg sm:leading-9">
            题库覆盖自我介绍、学校生活、职业规划、沟通表达等高频场景。
            你不需要一次学会所有内容，只需要先开始练第一题。
          </p>
          <div className="mt-10 flex justify-center">
            <Link href="/regular-english/library" className="brand-button min-w-[260px] justify-center">
              进入题库开始练
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
