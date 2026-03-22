"use client";

import Link from "next/link";

import { TextToSpeechButton } from "@/components/text-to-speech-button";
import { getMockPromptReferenceAnswer } from "@/lib/mock-reference-answer";
import { loadMockReport } from "@/lib/mock-report-storage";

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
  return {
    summary: cleaned ? "这道题暂时没有生成结构化点评，下面展示保留下来的原始转写内容。" : "这道题没有可用转写，因此没有生成逐题点评。",
    score: 0,
    strengths: cleaned ? ["已保留原始转写，可据此继续人工复盘。"] : [],
    weaknesses: cleaned ? ["系统未生成可用的逐题分析，请稍后重新生成完整报告。"] : ["当前没有可用 transcript，无法判断具体问题。"],
    conclusion: cleaned ? "建议稍后重新生成完整报告，避免基于不完整分析做判断。" : "请优先重新提交录音并完成转写。",
    masteredPhrases: [],
    polishedVersion: "",
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
          <h1 className="text-3xl font-semibold text-[#101828]">这道题的详情找不到了</h1>
          <Link href={`/mock/full/report/${sessionId}/${partSlug}`} className="brand-button mt-6 inline-flex min-w-[220px]">
            返回这一部分
          </Link>
        </div>
      </main>
    );
  }

  const referenceAnswer = getMockPromptReferenceAnswer(prompt);
  const fallbackDetail = buildFallbackDetail(transcript.transcript);
  const resolvedDetail = detail
    ? {
        ...detail,
        score: detail.score > 0 ? detail.score : fallbackDetail.score,
        masteredPhrases: detail.masteredPhrases?.length ? detail.masteredPhrases : fallbackDetail.masteredPhrases,
        polishedVersion: detail.polishedVersion || fallbackDetail.polishedVersion,
        summary: detail.summary || fallbackDetail.summary,
        strengths: detail.strengths?.length ? detail.strengths : fallbackDetail.strengths,
        weaknesses: detail.weaknesses?.length ? detail.weaknesses : fallbackDetail.weaknesses,
        conclusion: detail.conclusion || fallbackDetail.conclusion,
      }
    : {
        id: prompt.id,
        part: prompt.part,
        topic: prompt.topic,
        prompt: prompt.prompt,
        ...fallbackDetail,
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
          <p className="mt-5 text-[4.5rem] font-semibold leading-none tracking-[-0.08em]">
            {resolvedDetail.score > 0 ? formatScore(resolvedDetail.score) : "--"}
          </p>
        </div>

        <div className="rounded-[32px] border border-black/8 bg-white p-7 shadow-[0_18px_50px_rgba(16,24,40,0.06)]">
          <div className="flex flex-wrap gap-3 text-xs">
            <span className="rounded-full bg-[#e8f8ee] px-3 py-1.5 text-[#18794e]">绿色: 已识别亮点表达</span>
            <span className="rounded-full bg-[#fff4e8] px-3 py-1.5 text-[#b54708]">橙色: 常见搭配</span>
            <span className="rounded-full bg-[#eef4ff] px-3 py-1.5 text-[#175cd3]">蓝色: 连接表达</span>
            <span className="rounded-full bg-[#fff1f1] px-3 py-1.5 text-[#b42318]">红色: 疑似语法或搭配问题</span>
          </div>
          <p className="mt-6 text-xs uppercase tracking-[0.24em] text-[#8d7557]">Transcript</p>
          <p className="mt-4 text-lg leading-10 text-[#101828]">
            {transcript.transcript ? renderHighlightedTranscript(transcript.transcript, resolvedDetail.masteredPhrases) : "No transcript available."}
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
                {resolvedDetail.strengths.length ? resolvedDetail.strengths.map((line, index) => (
                  <p key={`${resolvedDetail.id}-strength-${index}`} className="rounded-2xl bg-[#e8f8ee] px-4 py-3 text-sm leading-7 text-[#18794e]">
                    {line}
                  </p>
                )) : <p className="text-sm leading-7 text-[#667085]">暂无可展示的亮点点评。</p>}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-[#101828]">主要问题</p>
              <div className="mt-3 grid gap-3">
                {resolvedDetail.weaknesses.length ? resolvedDetail.weaknesses.map((line, index) => (
                  <p key={`${resolvedDetail.id}-weakness-${index}`} className="rounded-2xl bg-[#fff4f2] px-4 py-3 text-sm leading-7 text-[#b42318]">
                    {line}
                  </p>
                )) : <p className="text-sm leading-7 text-[#667085]">暂无可展示的问题定位。</p>}
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
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.24em] text-[#8d7557]">Band 8 Polished Version</p>
              <TextToSpeechButton text={resolvedDetail.polishedVersion || ""} />
            </div>
            <p className="mt-4 text-sm leading-7 text-[#667085]">
              这里只展示真实生成出的优化答案；如果本次没有生成，就保持为空，不再补默认内容。
            </p>
            <div className="mt-5 rounded-2xl bg-[#eef4ff] p-5">
              <p className="mt-0 text-sm leading-7 text-[#344054]">{resolvedDetail.polishedVersion || "Polished version is not available."}</p>
            </div>
          </div>

          <div className="rounded-[32px] border border-black/8 bg-white p-7 shadow-[0_18px_50px_rgba(16,24,40,0.06)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.24em] text-[#8d7557]">Reference Answer</p>
              <TextToSpeechButton text={referenceAnswer} />
            </div>
            <p className="mt-4 text-base leading-8 text-[#101828]">
              {referenceAnswer || "Reference answer is not available yet."}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
