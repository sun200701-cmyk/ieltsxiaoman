"use client";

import Link from "next/link";
import { useMemo } from "react";

import { loadMockReport } from "@/lib/mock-report-storage";

type Props = {
  sessionId: string;
};

const partSlugMap = {
  "Part 1": "part-1",
  "Part 2": "part-2",
  "Part 3": "part-3",
} as const;

function formatScore(score: number) {
  return Number.isInteger(score) ? String(score) : score.toFixed(1);
}

function derivePartScore(
  result: NonNullable<ReturnType<typeof loadMockReport>>["result"],
  part: "Part 1" | "Part 2" | "Part 3",
) {
  const direct = result.partBreakdowns.find((item) => item.part === part)?.score ?? 0;
  if (direct > 0) {
    return direct;
  }

  const promptScores = result.promptBreakdowns
    .filter((item) => item.part === part && item.score > 0)
    .map((item) => item.score);

  if (!promptScores.length) {
    return 0;
  }

  const average = promptScores.reduce((sum, score) => sum + score, 0) / promptScores.length;
  return Math.round(average * 2) / 2;
}

export function MockReportOverview({ sessionId }: Props) {
  const payload = loadMockReport(sessionId);

  const grouped = useMemo(() => {
    if (!payload) {
      return [];
    }

    return (["Part 1", "Part 2", "Part 3"] as const).map((part) => {
      const breakdown = payload.result.partBreakdowns.find((item) => item.part === part);
      return {
        part,
        count: payload.session.prompts.filter((item) => item.part === part).length,
        summary: breakdown?.summary || "这一部分没有生成结构化总结，请打开分题页查看原始转写和逐题结果。",
        score: derivePartScore(payload.result, part),
        strengths: breakdown?.strengths ?? [],
        weaknesses: breakdown?.weaknesses ?? [],
      };
    });
  }, [payload]);

  if (!payload) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-[1480px] items-center justify-center px-6 py-10 lg:px-10">
        <div className="rounded-[32px] border border-black/8 bg-white p-10 text-center shadow-[0_24px_80px_rgba(16,24,40,0.08)]">
          <h1 className="text-3xl font-semibold text-[#101828]">模考报告不存在</h1>
          <p className="mt-4 text-base leading-8 text-[#5b5349]">请先重新完成一次全真模考，再查看报告。</p>
          <Link href="/mock/full" className="brand-button mt-6 inline-flex min-w-[220px]">
            返回全真模考
          </Link>
        </div>
      </main>
    );
  }

  const { result } = payload;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1480px] flex-col gap-8 px-6 py-10 lg:px-10">
      <section className="rounded-[36px] border border-black/8 bg-white p-8 shadow-[0_24px_80px_rgba(16,24,40,0.08)]">
        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          <div className="rounded-[32px] bg-[#101828] p-8 text-white">
            <p className="text-xs uppercase tracking-[0.3em] text-white/72">Predicted Overall Band</p>
            <p className="mt-5 text-[5rem] font-semibold leading-none tracking-[-0.08em]">
              {formatScore(result.predictedOverallBand)}
            </p>
          </div>

          <div className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Fluency", zh: "流利度", value: result.fluency },
                { label: "Lexical", zh: "词汇", value: result.lexical },
                { label: "Grammatical", zh: "语法", value: result.grammar },
                { label: "Pronunciation", zh: "发音", value: result.pronunciation },
              ].map((item) => (
                <div key={item.label} className="rounded-[24px] border border-black/8 bg-[#fffdf8] p-5">
                  <p className="text-[3rem] font-semibold leading-none tracking-[-0.06em] text-[#101828]">
                    {formatScore(item.value)}
                  </p>
                  <p className="mt-3 text-sm uppercase tracking-[0.24em] text-[#6f675c]">{item.label}</p>
                  <p className="mt-1 text-sm text-[#8d7557]">{item.zh}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[24px] border border-black/8 bg-[#fffdf8] p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-[#8d7557]">Part 1 Themes</p>
                <p className="mt-3 text-base leading-8 text-[#101828]">{result.part1Theme}</p>
              </div>
              <div className="rounded-[24px] border border-black/8 bg-[#fffdf8] p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-[#8d7557]">Part 2 Topic</p>
                <p className="mt-3 text-base leading-8 text-[#101828]">{result.part2Topic}</p>
              </div>
              <div className="rounded-[24px] border border-black/8 bg-[#fffdf8] p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-[#8d7557]">Part 3 Topic</p>
                <p className="mt-3 text-base leading-8 text-[#101828]">{result.part3Topic}</p>
              </div>
            </div>

            <div className="rounded-[24px] bg-[#f7f3ea] p-5 text-sm leading-7 text-[#5b5349]">
              {result.confidenceNote}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {grouped.map((item) => (
          <Link
            key={item.part}
            href={`/mock/full/report/${sessionId}/${partSlugMap[item.part]}`}
            className="rounded-[32px] border border-black/8 bg-white p-7 shadow-[0_18px_50px_rgba(16,24,40,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(16,24,40,0.1)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#8d7557]">{item.part}</p>
                <h2 className="mt-3 text-2xl font-semibold text-[#101828]">{item.count} 道题</h2>
              </div>
              <div className="rounded-[20px] bg-[#101828] px-4 py-3 text-center text-white">
                <p className="text-xs uppercase tracking-[0.2em] text-white/70">Score</p>
                <p className="mt-2 text-3xl font-semibold leading-none">
                  {item.score > 0 ? formatScore(item.score) : "--"}
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-[#5b5349]">{item.summary}</p>

            <div className="mt-5 grid gap-3">
              {item.strengths.slice(0, 1).map((line, index) => (
                <p key={`${item.part}-strength-${index}`} className="rounded-2xl bg-[#e8f8ee] px-4 py-3 text-sm leading-7 text-[#18794e]">
                  {line}
                </p>
              ))}
              {item.weaknesses.slice(0, 1).map((line, index) => (
                <p key={`${item.part}-weakness-${index}`} className="rounded-2xl bg-[#fff4f2] px-4 py-3 text-sm leading-7 text-[#b42318]">
                  {line}
                </p>
              ))}
            </div>

            <p className="mt-6 text-sm font-medium text-[#101828]">查看这一部分的逐题分析</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
