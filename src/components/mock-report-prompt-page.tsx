"use client";

import Link from "next/link";

import { loadMockReport } from "@/lib/mock-report-storage";
import { getMockPromptReferenceAnswer } from "@/lib/mock-reference-answer";

type Props = {
  sessionId: string;
  partSlug: string;
  promptId: string;
};

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function cleanToken(token: string) {
  return token.toLowerCase().replace(/[^a-z]/g, "");
}

function getPhraseRanges(transcript: string, phrases: string[]) {
  const ranges: Array<{ start: number; end: number; type: "phrase" }> = [];

  phrases
    .filter((phrase) => phrase.trim().length >= 4)
    .forEach((phrase) => {
      const regex = new RegExp(`\\b${escapeRegExp(phrase.trim())}\\b`, "gi");
      let match: RegExpExecArray | null;

      while ((match = regex.exec(transcript)) !== null) {
        ranges.push({
          start: match.index,
          end: match.index + match[0].length,
          type: "phrase",
        });
      }
    });

  return ranges;
}

function getFallbackPhraseRanges(transcript: string) {
  const ranges: Array<{ start: number; end: number; type: "phrase" }> = [];
  const matches = transcript.matchAll(/\b([a-z]{4,}\s+[a-z]{4,}(?:\s+[a-z]{4,})?)\b/gi);

  for (const match of matches) {
    if (typeof match.index !== "number") {
      continue;
    }

    ranges.push({
      start: match.index,
      end: match.index + match[0].length,
      type: "phrase",
    });

    if (ranges.length >= 3) {
      break;
    }
  }

  return ranges;
}

function getConnectorRanges(transcript: string) {
  const connectors = [
    "first",
    "first of all",
    "also",
    "besides",
    "because",
    "so",
    "however",
    "for example",
    "for instance",
    "in addition",
    "as a result",
    "on the one hand",
    "on the other hand",
  ];

  const ranges: Array<{ start: number; end: number; type: "connector" }> = [];

  connectors.forEach((phrase) => {
    const regex = new RegExp(`\\b${escapeRegExp(phrase)}\\b`, "gi");
    let match: RegExpExecArray | null;

    while ((match = regex.exec(transcript)) !== null) {
      ranges.push({
        start: match.index,
        end: match.index + match[0].length,
        type: "connector",
      });
    }
  });

  return ranges;
}

function getCollocationRanges(transcript: string) {
  const collocations = [
    "in real life",
    "artificial intelligence",
    "be interested in",
    "play an important role",
    "make progress",
    "learn from",
    "deal with",
    "benefit from",
    "take part in",
    "spend time",
    "communicate with",
    "focus on",
  ];
  const ranges: Array<{ start: number; end: number; type: "collocation" }> = [];

  collocations.forEach((phrase) => {
    const regex = new RegExp(`\\b${escapeRegExp(phrase)}\\b`, "gi");
    let match: RegExpExecArray | null;

    while ((match = regex.exec(transcript)) !== null) {
      ranges.push({
        start: match.index,
        end: match.index + match[0].length,
        type: "collocation",
      });
    }
  });

  return ranges;
}

function getGrammarRanges(transcript: string) {
  const tokens = transcript.match(/\S+/g) ?? [];
  const ranges: Array<{ start: number; end: number; type: "issue" }> = [];
  const linkingVerbs = new Set(["am", "is", "are", "was", "were"]);
  const baseVerbs = new Set(["build", "design", "make", "control", "study", "go", "learn", "improve"]);

  let cursor = 0;
  const positions = tokens.map((token) => {
    const start = transcript.indexOf(token, cursor);
    const end = start + token.length;
    cursor = end;
    return { token, start, end };
  });

  positions.forEach((current, index) => {
    const clean = cleanToken(current.token);
    const next = positions[index + 1];
    const afterNext = positions[index + 2];

    if (linkingVerbs.has(clean) && next && baseVerbs.has(cleanToken(next.token))) {
      ranges.push({ start: current.start, end: next.end, type: "issue" });
    }

    if (clean === "and" && next && afterNext) {
      if (baseVerbs.has(cleanToken(next.token)) && /^[a-z]+ed$/.test(cleanToken(afterNext.token))) {
        ranges.push({ start: current.start, end: next.end, type: "issue" });
      }
    }
  });

  return ranges;
}

function renderHighlightedTranscript(transcript: string, masteredPhrases: string[]) {
  const baseRanges = [
    ...getPhraseRanges(transcript, masteredPhrases),
    ...getCollocationRanges(transcript),
    ...getConnectorRanges(transcript),
    ...getGrammarRanges(transcript),
  ];

  const ranges = (baseRanges.length ? baseRanges : [...getFallbackPhraseRanges(transcript), ...getConnectorRanges(transcript)]).sort(
    (left, right) => left.start - right.start || left.end - right.end,
  );

  const pieces: React.ReactNode[] = [];
  let cursor = 0;

  ranges.forEach((range, index) => {
    if (range.start < cursor) {
      return;
    }

    if (range.start > cursor) {
      pieces.push(<span key={`plain-${index}-${cursor}`}>{transcript.slice(cursor, range.start)}</span>);
    }

    const className =
      range.type === "phrase"
        ? "rounded-md bg-[#e8f8ee] px-1.5 py-0.5 text-[#18794e]"
        : range.type === "collocation"
          ? "rounded-md bg-[#fff4e8] px-1.5 py-0.5 text-[#b54708]"
          : range.type === "connector"
            ? "rounded-md bg-[#eef4ff] px-1.5 py-0.5 text-[#175cd3]"
            : "rounded-md bg-[#fff1f1] px-1.5 py-0.5 text-[#b42318] underline decoration-[#b42318] decoration-2 underline-offset-4";

    pieces.push(
      <span key={`mark-${index}-${range.start}`} className={className}>
        {transcript.slice(range.start, range.end)}
      </span>,
    );
    cursor = range.end;
  });

  if (cursor < transcript.length) {
    pieces.push(<span key={`tail-${cursor}`}>{transcript.slice(cursor)}</span>);
  }

  return pieces;
}

function buildFallbackDetail(transcript: string) {
  const cleaned = transcript.trim();
  const wordCount = cleaned ? cleaned.split(/\s+/).length : 0;
  const polishedVersion =
    cleaned.length > 0
      ? `A more polished version of this answer could be: ${cleaned
          .replace(/\bi think\b/gi, "I would say")
          .replace(/\breally\b/gi, "particularly")
          .replace(/\bvery\b/gi, "quite")
          .replace(/\bgood\b/gi, "beneficial")
          .replace(/\bbad\b/gi, "less effective")}`
      : "A polished version is not available yet because the transcript is empty.";

  return {
    summary:
      wordCount >= 35
        ? "这道题已经完成了基本展开，但表达层次和高分词句还可以继续加强。"
        : "这道题目前回答偏短，切题基础有了，但展开和支撑明显不够。",
    score: wordCount >= 45 ? 6.5 : wordCount >= 25 ? 6 : 5.5,
    strengths: transcript
      ? [
          "回答内容已成功保存，说明这道题的基本作答链路是完整的。",
          wordCount >= 30 ? "整体回答已经有一定长度，说明你能够持续输出观点。" : "回答没有完全偏题，核心信息仍然能够被理解。",
        ]
      : ["当前没有可用转写内容。"],
    weaknesses: transcript
      ? [
          "这道题的高质量表达和细节支撑还不够，导致分数上限受限。",
          "建议继续检查语法准确度、连接词使用和论证展开。",
        ]
      : ["由于缺少转写，暂时无法给出更细的逐题问题定位。"],
    conclusion: "先把回答扩展到“观点 + 原因 + 例子”的完整结构，再做表达升级，效果会更明显。",
    masteredPhrases: cleaned ? [] : ["for example", "in my opinion"],
    upgrades: {
      band6: "",
      band7: "",
      band8: polishedVersion,
    },
  };
}

function formatScore(score: number) {
  return Number.isInteger(score) ? String(score) : score.toFixed(1);
}

export function MockReportPromptPage({ sessionId, partSlug, promptId }: Props) {
  const payload = loadMockReport(sessionId);

  if (!payload) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-[1480px] items-center justify-center px-6 py-10 lg:px-10">
        <div className="rounded-[32px] border border-black/8 bg-white p-10 text-center shadow-[0_24px_80px_rgba(16,24,40,0.08)]">
          <h1 className="text-3xl font-semibold text-[#101828]">报告不存在</h1>
          <Link href="/mock/full" className="brand-button mt-6 inline-flex min-w-[220px]">
            返回全真模考
          </Link>
        </div>
      </main>
    );
  }

  const resolvedPromptId = decodeURIComponent(promptId);
  const prompt =
    payload.session.prompts.find((item) => item.id === promptId) ??
    payload.session.prompts.find((item) => item.id === resolvedPromptId);
  const transcript =
    payload.result.transcripts.find((item) => item.id === promptId) ??
    payload.result.transcripts.find((item) => item.id === resolvedPromptId);
  const detail =
    payload.result.promptBreakdowns.find((item) => item.id === promptId) ??
    payload.result.promptBreakdowns.find((item) => item.id === resolvedPromptId);

  if (!prompt || !transcript) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-[1480px] items-center justify-center px-6 py-10 lg:px-10">
        <div className="rounded-[32px] border border-black/8 bg-white p-10 text-center shadow-[0_24px_80px_rgba(16,24,40,0.08)]">
          <h1 className="text-3xl font-semibold text-[#101828]">该题目的详情找不到</h1>
          <Link href={`/mock/full/report/${sessionId}/${partSlug}`} className="brand-button mt-6 inline-flex min-w-[220px]">
            返回这一部分
          </Link>
        </div>
      </main>
    );
  }

  const referenceAnswer = getMockPromptReferenceAnswer(prompt);
  const resolvedDetail = detail
    ? {
        ...detail,
        score: detail.score > 0 ? detail.score : buildFallbackDetail(transcript.transcript).score,
        masteredPhrases: detail.masteredPhrases?.length ? detail.masteredPhrases : buildFallbackDetail(transcript.transcript).masteredPhrases,
        upgrades: {
          band6: detail.upgrades?.band6 || "",
          band7: detail.upgrades?.band7 || "",
          band8: detail.upgrades?.band8 || buildFallbackDetail(transcript.transcript).upgrades.band8,
        },
        summary: detail.summary || buildFallbackDetail(transcript.transcript).summary,
        strengths: detail.strengths?.length ? detail.strengths : buildFallbackDetail(transcript.transcript).strengths,
        weaknesses: detail.weaknesses?.length ? detail.weaknesses : buildFallbackDetail(transcript.transcript).weaknesses,
        conclusion: detail.conclusion || buildFallbackDetail(transcript.transcript).conclusion,
      }
    : {
    id: prompt.id,
    part: prompt.part,
    topic: prompt.topic,
    prompt: prompt.prompt,
    ...buildFallbackDetail(transcript.transcript),
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1480px] flex-col gap-8 px-6 py-10 lg:px-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[#8d7557]">{prompt.part}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#101828]">{prompt.prompt}</h1>
        </div>
        <Link
          href={`/mock/full/report/${sessionId}/${partSlug}`}
          className="inline-flex items-center justify-center rounded-full border border-black/8 bg-white px-5 py-2.5 text-sm text-[#101828] transition hover:border-black/12 hover:bg-[#f6f0e5]"
        >
          返回这一部分
        </Link>
      </div>

      <section className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="rounded-[32px] bg-[#101828] p-8 text-white shadow-[0_18px_50px_rgba(16,24,40,0.12)]">
          <p className="text-xs uppercase tracking-[0.3em] text-white/72">Question Score</p>
          <p className="mt-5 text-[4.5rem] font-semibold leading-none tracking-[-0.08em]">{formatScore(resolvedDetail.score)}</p>
        </div>

        <div className="rounded-[32px] border border-black/8 bg-white p-7 shadow-[0_18px_50px_rgba(16,24,40,0.06)]">
          <div className="flex flex-wrap gap-3 text-xs">
            <span className="rounded-full bg-[#e8f8ee] px-3 py-1.5 text-[#18794e]">绿色：亮点表达</span>
            <span className="rounded-full bg-[#fff4e8] px-3 py-1.5 text-[#b54708]">橙色：较好搭配</span>
            <span className="rounded-full bg-[#eef4ff] px-3 py-1.5 text-[#175cd3]">蓝色：连接结构</span>
            <span className="rounded-full bg-[#fff1f1] px-3 py-1.5 text-[#b42318]">红色：语法或搭配问题</span>
          </div>
          <p className="mt-6 text-xs uppercase tracking-[0.24em] text-[#8d7557]">Detailed Analysis</p>
          <p className="mt-4 text-lg leading-10 text-[#101828]">
            {renderHighlightedTranscript(transcript.transcript, resolvedDetail.masteredPhrases)}
          </p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] border border-black/8 bg-white p-7 shadow-[0_18px_50px_rgba(16,24,40,0.06)]">
          <p className="text-xs uppercase tracking-[0.24em] text-[#8d7557]">点评</p>
          <p className="mt-4 text-base leading-8 text-[#5b5349]">{resolvedDetail.summary}</p>

          <div className="mt-6 grid gap-5">
            <div>
              <p className="text-sm font-medium text-[#101828]">表现好的地方</p>
              <div className="mt-3 grid gap-3">
                {resolvedDetail.strengths.map((line, index) => (
                  <p key={`${resolvedDetail.id}-strength-${index}`} className="rounded-2xl bg-[#e8f8ee] px-4 py-3 text-sm leading-7 text-[#18794e]">
                    {line}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-[#101828]">拉低分数的地方</p>
              <div className="mt-3 grid gap-3">
                {resolvedDetail.weaknesses.map((line, index) => (
                  <p key={`${resolvedDetail.id}-weakness-${index}`} className="rounded-2xl bg-[#fff4f2] px-4 py-3 text-sm leading-7 text-[#b42318]">
                    {line}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-[#101828]">结论</p>
              <p className="mt-3 rounded-2xl bg-[#f7f3ea] px-4 py-4 text-sm leading-7 text-[#5b5349]">
                {resolvedDetail.conclusion}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="rounded-[32px] border border-black/8 bg-white p-7 shadow-[0_18px_50px_rgba(16,24,40,0.06)]">
            <p className="text-xs uppercase tracking-[0.24em] text-[#8d7557]">标准答案</p>
            <p className="mt-4 text-base leading-8 text-[#101828]">
              {referenceAnswer || "这道题当前还没有可直接展示的标准答案，后续可以继续补充。"}
            </p>
          </div>

          <div className="rounded-[32px] border border-black/8 bg-white p-7 shadow-[0_18px_50px_rgba(16,24,40,0.06)]">
            <p className="text-xs uppercase tracking-[0.24em] text-[#8d7557]">Polished Version</p>
            <div className="mt-5 rounded-2xl bg-[#eef4ff] p-5">
              <p className="text-sm font-semibold text-[#101828]">AI polished version</p>
              <p className="mt-3 text-sm leading-7 text-[#344054]">{resolvedDetail.upgrades.band8 || referenceAnswer || "Polished version is not available yet."}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
