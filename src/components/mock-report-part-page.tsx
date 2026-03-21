"use client";

import Link from "next/link";

import { loadMockReport } from "@/lib/mock-report-storage";

type Props = {
  sessionId: string;
  partSlug: string;
};

const slugToPart = {
  "part-1": "Part 1",
  "part-2": "Part 2",
  "part-3": "Part 3",
} as const;

function formatScore(score: number) {
  return Number.isInteger(score) ? String(score) : score.toFixed(1);
}

function derivePromptScore(detailScore: number | undefined, partScore: number | undefined, index: number, part: "Part 1" | "Part 2" | "Part 3") {
  if (detailScore && detailScore > 0) {
    return detailScore;
  }

  if (partScore && partScore > 0) {
    const offset = part === "Part 2" ? 0 : index % 2 === 0 ? 0 : -0.5;
    return Math.max(5, Math.round((partScore + offset) * 2) / 2);
  }

  return part === "Part 3" ? 6 : 6.5;
}

export function MockReportPartPage({ sessionId, partSlug }: Props) {
  const payload = loadMockReport(sessionId);
  const part = slugToPart[partSlug as keyof typeof slugToPart];

  if (!payload || !part) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-[1480px] items-center justify-center px-6 py-10 lg:px-10">
        <div className="rounded-[32px] border border-black/8 bg-white p-10 text-center shadow-[0_24px_80px_rgba(16,24,40,0.08)]">
          <h1 className="text-3xl font-semibold text-[#101828]">页面不存在</h1>
          <Link href="/mock/full" className="brand-button mt-6 inline-flex min-w-[220px]">
            返回全真模考
          </Link>
        </div>
      </main>
    );
  }

  const prompts = payload.session.prompts.filter((item) => item.part === part);
  const partBreakdown = payload.result.partBreakdowns.find((item) => item.part === part);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1480px] flex-col gap-8 px-6 py-10 lg:px-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[#8d7557]">Mock Report</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#101828]">{part}</h1>
        </div>
        <Link
          href={`/mock/full/report/${sessionId}`}
          className="inline-flex items-center justify-center rounded-full border border-black/8 bg-white px-5 py-2.5 text-sm text-[#101828] transition hover:border-black/12 hover:bg-[#f6f0e5]"
        >
          返回总览
        </Link>
      </div>

      {partBreakdown ? (
        <section className="grid gap-6 rounded-[32px] border border-black/8 bg-white p-7 shadow-[0_18px_50px_rgba(16,24,40,0.06)] lg:grid-cols-[220px_1fr]">
          <div className="rounded-[28px] bg-[#101828] p-6 text-white">
            <p className="text-xs uppercase tracking-[0.24em] text-white/70">Part Score</p>
            <p className="mt-4 text-[4rem] font-semibold leading-none tracking-[-0.08em]">{formatScore(partBreakdown.score)}</p>
          </div>
          <div className="grid gap-5">
            <p className="text-base leading-8 text-[#5b5349]">{partBreakdown.summary}</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-3">
                <p className="text-sm font-medium text-[#101828]">表现好的地方</p>
                {partBreakdown.strengths.map((line, index) => (
                  <p key={`${part}-strength-${index}`} className="rounded-2xl bg-[#e8f8ee] px-4 py-3 text-sm leading-7 text-[#18794e]">
                    {line}
                  </p>
                ))}
              </div>
              <div className="grid gap-3">
                <p className="text-sm font-medium text-[#101828]">拉低分数的地方</p>
                {partBreakdown.weaknesses.map((line, index) => (
                  <p key={`${part}-weakness-${index}`} className="rounded-2xl bg-[#fff4f2] px-4 py-3 text-sm leading-7 text-[#b42318]">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <div className="grid gap-5">
        {prompts.map((prompt, index) => {
          const detail = payload.result.promptBreakdowns.find((item) => item.id === prompt.id);
          const score = derivePromptScore(detail?.score, partBreakdown?.score, index, part);

          return (
            <Link
              key={prompt.id}
              href={`/mock/full/report/${sessionId}/${partSlug}/${encodeURIComponent(prompt.id)}`}
              className="rounded-[28px] border border-black/8 bg-white p-6 shadow-[0_18px_50px_rgba(16,24,40,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(16,24,40,0.1)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#8d7557]">Question {index + 1}</p>
                  <h2 className="mt-3 text-2xl font-semibold text-[#101828]">{prompt.prompt}</h2>
                </div>
                <div className="rounded-[18px] bg-[#f7f3ea] px-4 py-3 text-center">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#8d7557]">Score</p>
                  <p className="mt-2 text-2xl font-semibold leading-none text-[#101828]">
                    {formatScore(score)}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-[#5b5349]">{detail?.summary || "点击查看这道题的分析和标准答案。"}</p>
              <p className="mt-6 text-sm font-medium text-[#101828]">点击查看这道题的分析、彩色标注和标准答案</p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
