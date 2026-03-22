"use client";

import Link from "next/link";
import { ArrowRight, Clock3, Layers3, Mic2 } from "lucide-react";

const entryCards = [
  {
    href: "/question-bank",
    eyebrow: "Question Bank Mock",
    title: "题库模考",
    description: "从 2026 年 1-4 月雅思口语题库中选择题目，按 Part 1 / Part 2 / Part 3 进入单题练习与模考。",
    meta: "适合按题型拆练，快速查缺补漏",
    icon: Layers3,
  },
  {
    href: "/mock/full",
    eyebrow: "Full Mock Test",
    title: "全真模考",
    description: "完整模拟真实雅思口语流程，包含考官开场、Part 1、Part 2、Part 3，并在结束后生成整套报告。",
    meta: "适合整套计时训练，检验临场表现",
    icon: Clock3,
  },
] as const;

export function SpeakingPracticeHub() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1480px] flex-col px-6 py-10 lg:px-10">
      <section className="surface-card mx-auto w-full max-w-[1380px] px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="flex flex-col gap-4 text-center">
          <div className="status-chip mx-auto">
            <Mic2 className="h-4 w-4" />
            Speaking Practice
          </div>
          <h1 className="text-4xl font-semibold tracking-[-0.06em] text-[#101828] sm:text-5xl lg:text-[4.8rem]">
            2026年1-4月雅思口语题库
          </h1>
          <p className="mx-auto max-w-3xl text-base leading-8 text-[#5b5349]">
            先选择练习方式，再进入对应功能页面。你可以按题库拆分练习，也可以直接开始一整套全真模考。
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {entryCards.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={index === 0 ? "brand-button min-w-[148px]" : "ghost-button min-w-[148px]"}
            >
              {item.title}
            </Link>
          ))}
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {entryCards.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={`question-card flex h-full flex-col justify-between p-7 ${
                index === 0 ? "bg-[linear-gradient(180deg,#fffdf9,#f6efe4)]" : ""
              }`}
            >
              <div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5ede1]">
                  <item.icon className="h-5 w-5 text-[#8d7557]" />
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-[#8d7557]">
                  {item.eyebrow}
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#101828]">{item.title}</h2>
                <p className="mt-4 text-base leading-8 text-[#4f463d]">{item.description}</p>
              </div>

              <div className="mt-8 flex items-center justify-between gap-4">
                <p className="text-sm text-[#8d7557]">{item.meta}</p>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#101828] text-white">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
