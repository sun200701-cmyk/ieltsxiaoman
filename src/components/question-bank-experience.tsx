"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useMemo, useState } from "react";

import { questions } from "@/lib/questions";

const filters = ["全部", "Part 1", "Part 2", "Part 3"] as const;

export function QuestionBankExperience() {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("全部");

  const filteredQuestions = useMemo(() => {
    const baseQuestions =
      activeFilter === "全部" ? questions : questions.filter((question) => question.part === activeFilter);

    return [...baseQuestions].sort((left, right) => {
      if (left.isRequired !== right.isRequired) {
        return left.isRequired ? -1 : 1;
      }

      const order = { "Part 1": 1, "Part 2": 2, "Part 3": 3 };
      const byPart = order[left.part] - order[right.part];

      if (byPart !== 0) {
        return byPart;
      }

      return left.id.localeCompare(right.id);
    });
  }, [activeFilter]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1480px] flex-col px-6 py-10 lg:px-10">
      <section className="mx-auto flex w-full max-w-[1380px] flex-col">
        <Link
          href="/speaking-practice"
          className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-black/8 bg-[#fffdf8] px-4 py-2 text-sm text-[#6f675c] transition hover:border-black/12 hover:text-[#101828]"
        >
          <ChevronLeft className="h-4 w-4" />
          返回选择模考方式
        </Link>

        <div className="flex flex-col gap-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8d7557]">Question Bank Practice</p>
          <h1 className="text-4xl font-semibold tracking-[-0.06em] text-[#101828] sm:text-5xl lg:text-[4.8rem]">
            2026年1-4月雅思口语题库
          </h1>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`rounded-full border px-5 py-2.5 text-sm transition ${
                activeFilter === filter
                  ? "border-[#101828] bg-[#101828] text-white"
                  : "border-black/8 bg-[#fffdf8] text-[#6f675c] hover:bg-[#f3eee5] hover:text-[#101828]"
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <div className="grid gap-0 border-t border-black/8">
          {filteredQuestions.map((question) => {
            const previewLines =
              question.part === "Part 2" ? [question.prompt] : [question.prompt, ...question.followUps];

            return (
              <Link
                key={question.id}
                href={`/practice/${question.slug}`}
                className="grid gap-3 border-b border-black/8 py-6 transition hover:bg-black/[0.015] md:grid-cols-[140px_1fr_180px]"
              >
                <div className="text-sm font-medium text-[#9f968b]">{question.part}</div>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-medium tracking-[-0.03em] text-[#101828]">{question.title}</h3>
                    {question.isRequired ? (
                      <span className="rounded-full bg-[#fff1f1] px-3 py-1 text-xs font-semibold tracking-[0.16em] text-[#b42318]">
                        必考题
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-2 space-y-1">
                    {previewLines.slice(0, 4).map((item, index) => (
                      <p key={`${question.id}-${index}`} className="text-sm leading-7 text-[#5b5349]">
                        {index + 1}. {item}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-[#9f968b] md:text-right">
                  <div>{question.timeLimitLabel}</div>
                  <div className="mt-2">{question.sectionLabel}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
