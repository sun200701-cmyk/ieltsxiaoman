"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { LoaderCircle, Mic, PauseCircle, Play } from "lucide-react";

import { useAuth } from "@/components/auth-provider";
import { TextToSpeechButton } from "@/components/text-to-speech-button";
import { orderedQuestions } from "@/lib/questions";
import { part2ReferenceAnswersById } from "@/lib/reference-answers";
import { requiredPart1AnswersByQuestionText } from "@/lib/reference-required-part1-answers";
import { referenceAnswersByQuestionText } from "@/lib/reference-question-answers";
import type { AssessmentResult, DemoQuestion } from "@/lib/types";

type PracticeStudioProps = {
  question: DemoQuestion;
};

type RecorderState = "idle" | "recording" | "ready" | "submitting";

const scoreLabelMap = {
  overall: { en: "Overall Band", zh: "总成绩" },
  fluency: { en: "Fluency", zh: "流利度" },
  lexical: { en: "Lexical", zh: "词汇" },
  grammar: { en: "Grammar", zh: "语法" },
  pronunciation: { en: "Pronunciation", zh: "发音" },
};

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
  const ranges = [
    ...getPhraseRanges(transcript, masteredPhrases),
    ...getCollocationRanges(transcript),
    ...getConnectorRanges(transcript),
    ...getGrammarRanges(transcript),
  ].sort((left, right) => left.start - right.start || left.end - right.end);

  const pieces: ReactNode[] = [];
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

function normalizeQuestionText(text: string) {
  return text.replace(/[?.!,:;()[\]"']/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
}

function sanitizeReferenceAnswer(raw: string) {
  if (!raw.trim()) {
    return "";
  }

  const text = raw.replace(/\s+/g, " ").trim();

  if (/[\u4e00-\u9fff]/.test(text)) {
    return "";
  }

  if (/^(Do|What|Why|How|When|Where|Who|Are|Is|Can|Should|Would|Have|Did|Will)\b/.test(text)) {
    return "";
  }

  return text.length >= 20 ? text : "";
}

function formatScore(score: number) {
  return Number.isInteger(score) ? String(score) : score.toFixed(1);
}

export function PracticeStudio({ question }: PracticeStudioProps) {
  const { accessToken, refreshUsage, usage, user } = useAuth();
  const router = useRouter();
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const recordingTimerRef = useRef<number | null>(null);

  const [recorderState, setRecorderState] = useState<RecorderState>("idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [status, setStatus] = useState("点击下方按钮开始录音。");
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  const nextTheme = useMemo(() => {
    const index = orderedQuestions.findIndex((item) => item.id === question.id);
    return orderedQuestions[(index + 1) % orderedQuestions.length];
  }, [question.id]);

  const isSequentialPart = question.part === "Part 1" || question.part === "Part 3";

  const cuePoints = useMemo(() => {
    if (!question.cueCard) {
      return [];
    }

    return question.cueCard
      .split("\n")
      .filter((line) => line.trim().startsWith("- "))
      .map((line) => line.replace(/^- /, "").trim());
  }, [question.cueCard]);

  const sequentialQuestions = useMemo(
    () => (isSequentialPart ? [question.prompt, ...question.followUps] : []),
    [isSequentialPart, question.followUps, question.prompt],
  );

  const currentQuestionText = useMemo(() => {
    if (!isSequentialPart) {
      return question.prompt;
    }

    return sequentialQuestions[activeQuestionIndex] ?? question.prompt;
  }, [activeQuestionIndex, isSequentialPart, question.prompt, sequentialQuestions]);

  const hasNextQuestionInSet = isSequentialPart && activeQuestionIndex < sequentialQuestions.length - 1;
  const hasPreviousQuestionInSet = isSequentialPart && activeQuestionIndex > 0;

  const normalizedReferenceAnswers = useMemo(() => {
    return Object.fromEntries(
      Object.entries({
        ...referenceAnswersByQuestionText,
        ...requiredPart1AnswersByQuestionText,
      }).map(([key, value]) => [normalizeQuestionText(key), value]),
    ) as Record<string, string>;
  }, []);

  const referenceAnswer = useMemo(() => {
    if (question.part === "Part 2") {
      return sanitizeReferenceAnswer(part2ReferenceAnswersById[question.id] || question.sampleAnswer?.trim() || "");
    }

    return sanitizeReferenceAnswer(
      requiredPart1AnswersByQuestionText[currentQuestionText] ||
        referenceAnswersByQuestionText[currentQuestionText] ||
        normalizedReferenceAnswers[normalizeQuestionText(currentQuestionText)] ||
        "",
    );
  }, [currentQuestionText, normalizedReferenceAnswers, question]);

  const polishedVersion = useMemo(() => {
    if (!result) {
      return "";
    }

    return result.polishedVersion || buildPolishedVersion(result.transcript);
  }, [result]);

  const scoreItems = useMemo(() => {
    if (!result) {
      return [];
    }

    return [
      { label: scoreLabelMap.fluency.en, zh: scoreLabelMap.fluency.zh, score: result.fluency },
      { label: scoreLabelMap.lexical.en, zh: scoreLabelMap.lexical.zh, score: result.lexical },
      { label: scoreLabelMap.grammar.en, zh: scoreLabelMap.grammar.zh, score: result.grammar },
      { label: scoreLabelMap.pronunciation.en, zh: scoreLabelMap.pronunciation.zh, score: result.pronunciation },
    ];
  }, [result]);

  const spokenText = useMemo(() => {
    if (isSequentialPart) {
      return currentQuestionText;
    }

    return cuePoints.length ? [question.prompt, "You should say", ...cuePoints].join(". ") : question.prompt;
  }, [cuePoints, currentQuestionText, isSequentialPart, question.prompt]);

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        window.clearInterval(recordingTimerRef.current);
      }

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }

      streamRef.current?.getTracks().forEach((track) => track.stop());

      if (typeof window !== "undefined") {
        window.speechSynthesis.cancel();
      }
    };
  }, [audioUrl]);

  const speakText = (text: string) => {
    if (typeof window === "undefined" || !text.trim()) {
      return;
    }

    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.92;
    utterance.pitch = 1;

    const voices = synth.getVoices();
    const englishVoice =
      voices.find((voice) => voice.lang.toLowerCase().startsWith("en-us")) ??
      voices.find((voice) => voice.lang.toLowerCase().startsWith("en")) ??
      null;

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    synth.speak(utterance);
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const timer = window.setTimeout(() => speakText(spokenText), 150);
    return () => window.clearTimeout(timer);
  }, [spokenText]);

  const resetAttemptState = () => {
    if (recordingTimerRef.current) {
      window.clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    setResult(null);
    setAudioBlob(null);
    setDurationSeconds(0);
    setRecorderState("idle");

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const preferredMimeType = [
        "audio/ogg;codecs=opus",
        "audio/ogg",
        "audio/webm;codecs=opus",
        "audio/webm",
      ].find((item) => MediaRecorder.isTypeSupported(item));
      const recorder = preferredMimeType
        ? new MediaRecorder(stream, { mimeType: preferredMimeType })
        : new MediaRecorder(stream);
      const startedAt = Date.now();

      chunksRef.current = [];
      streamRef.current = stream;
      recorderRef.current = recorder;
      setResult(null);
      setAudioBlob(null);
      setDurationSeconds(0);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        if (recordingTimerRef.current) {
          window.clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const nextAudioUrl = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(nextAudioUrl);
        setRecorderState("ready");
        setDurationSeconds(Math.max(1, Math.round((Date.now() - startedAt) / 1000)));
        setStatus("录音完成，可以回听后开始分析。");
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      if (recordingTimerRef.current) {
        window.clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      recordingTimerRef.current = window.setInterval(() => {
        setDurationSeconds((current) => current + 1);
      }, 1000);
      setRecorderState("recording");
      setStatus("正在录音，请直接回答当前题目。");
    } catch {
      setStatus("麦克风权限未开启，请允许浏览器访问麦克风后重试。");
    }
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderState === "recording") {
      recorderRef.current.stop();
    }
  };

  const liveDurationLabel = useMemo(() => {
    const minutes = Math.floor(durationSeconds / 60);
    const seconds = durationSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, [durationSeconds]);

  const submitAssessment = async () => {
    if (!audioBlob) {
      setStatus("请先完成录音。");
      return;
    }

    if (!user || !accessToken) {
      setShowLoginPrompt(true);
      setStatus("登录后才能使用真实 AI 分析。");
      return;
    }

    setRecorderState("submitting");
    setStatus("ChatGPT正在分析你的回答，请稍候...");
    setShowUpgradePrompt(false);

    const formData = new FormData();
    formData.append("audio", audioBlob, `${question.slug}.ogg`);
    formData.append("questionId", question.id);
    formData.append("durationSeconds", String(durationSeconds));
    formData.append("activeQuestionIndex", String(activeQuestionIndex));

    const response = await fetch("/api/assessment", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (response.status === 401) {
      setRecorderState("ready");
      setShowLoginPrompt(true);
      setStatus("请先登录，再使用真实 AI 分析。");
      return;
    }

    if (response.status === 403) {
      setRecorderState("ready");
      setShowUpgradePrompt(true);
      setStatus("当前可用次数已用完，请前往 AI 口语定价页面联系客服开通。");
      return;
    }

    if (!response.ok) {
      setRecorderState("ready");
      setStatus("分析失败了，请稍后再试。");
      return;
    }

    const nextResult = (await response.json()) as AssessmentResult;
    setResult(nextResult);
    setRecorderState("ready");
    setStatus("分析完成，可以查看你的冲刺建议和表达升级。");
    await refreshUsage();
  };
  const handleReanswer = () => {
    resetAttemptState();
    setStatus("Ready to record a new answer.");
  };

  const handleSelectQuestion = (index: number) => {
    setActiveQuestionIndex(index);
    resetAttemptState();
    setStatus("Switched to a new question. Please record your answer again.");
  };

  const handlePreviousQuestion = () => {
    if (!hasPreviousQuestionInSet) {
      return;
    }

    setActiveQuestionIndex((current) => current - 1);
    resetAttemptState();
    setStatus("Moved to the previous question. Please record your answer again.");
  };

  const handleNextQuestion = () => {
    if (hasNextQuestionInSet) {
      setActiveQuestionIndex((current) => current + 1);
      resetAttemptState();
      setStatus("Moved to the next question. Please record your answer again.");
      return;
    }

    router.push(`/practice/${nextTheme.slug}`);
  };

  const usageLine = !user
    ? "未登录状态下可以录音，但点击分析时会先引导你登录。"
    : usage?.hasActiveMembership
      ? `当前会员主额度剩余 ${usage.membershipQuotaRemaining} 次，加量包剩余 ${usage.activeAddonCreditsRemaining} 次。`
      : `当前免费次数剩余 ${usage?.freeTrialsRemaining ?? 0} 次。`;

  const nextButtonLabel = hasNextQuestionInSet ? "Next Question" : "Next Topic";
  const analysisLegend = [
    { label: "亮点表达", className: "bg-[#e8f8ee] text-[#18794e]" },
    { label: "搭配较好", className: "bg-[#fff4e8] text-[#b54708]" },
    { label: "连接结构", className: "bg-[#eef4ff] text-[#175cd3]" },
    { label: "语法问题", className: "bg-[#fff1f1] text-[#b42318]" },
  ];

  return (
    <>
      <section className="grid gap-8">
        <div className="grid gap-6 rounded-[28px] border border-black/8 bg-white px-4 py-5 shadow-[0_24px_80px_rgba(16,24,40,0.08)] sm:gap-8 sm:rounded-[36px] sm:px-6 sm:py-8 lg:px-10">
          <div className="grid gap-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#8d7557]">
              {question.sectionLabel ?? question.tags[0] ?? "Speaking"}
            </p>
            <h1 className="text-3xl font-semibold tracking-[-0.06em] text-[#101828] sm:text-5xl lg:text-6xl">
              {question.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-[#6f675c]">
              <span className="rounded-full border border-black/8 px-4 py-2">{question.part}</span>
              {question.isRequired ? (
                <span className="rounded-full bg-[#fff1f0] px-4 py-2 font-medium text-[#d92d20]">必考题</span>
              ) : null}
              <span className="rounded-full border border-black/8 px-4 py-2">{question.timeLimitLabel}</span>
            </div>
            {isSequentialPart ? (
              <div className="grid gap-5">
                <div className="rounded-[24px] bg-white p-4 text-center sm:p-6">
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <p className="text-sm text-[#8d7557]">Current Answer</p>
                    <span className="rounded-full border border-black/8 px-4 py-2 text-sm text-[#6f675c]">
                      Question {activeQuestionIndex + 1} / {sequentialQuestions.length}
                    </span>
                  </div>
                  <p className="mt-4 text-xl leading-8 text-[#101828] sm:text-[2rem] sm:leading-10">
                    {currentQuestionText}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center">
                  {sequentialQuestions.map((item, index) => {
                    const active = index === activeQuestionIndex;
                    return (
                      <button
                        key={`${question.id}-${index}`}
                        type="button"
                        onClick={() => handleSelectQuestion(index)}
                        className={`rounded-full px-4 py-2 text-sm transition ${
                          active
                            ? "bg-[#101828] text-white"
                            : "border border-black/8 bg-white text-[#6f675c] hover:border-black/15 hover:text-[#101828]"
                        }`}
                      >
                        Q{index + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="grid gap-5 text-left">
                <p className="text-lg leading-8 text-[#101828] sm:text-xl sm:leading-9">{question.prompt}</p>
                {cuePoints.length ? (
                  <div className="rounded-[24px] bg-white p-4 sm:p-5">
                    <p className="text-sm font-medium uppercase tracking-[0.28em] text-[#8d7557]">You should say</p>
                    <div className="mt-4 grid gap-3 text-base leading-8 text-[#344054]">
                      {cuePoints.map((point) => (
                        <p key={point}>• {point}</p>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <div className="grid gap-4">
            <div className="grid gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
              <button
                type="button"
                onClick={handlePreviousQuestion}
                disabled={!hasPreviousQuestionInSet}
                className="inline-flex min-h-14 items-center justify-center rounded-full border border-black/8 bg-white px-6 text-base font-medium text-[#101828] transition hover:border-black/12 hover:bg-[#f6f0e5] disabled:cursor-not-allowed disabled:text-[#98a2b3] sm:px-8"
              >
                Previous Question
              </button>

              <button
                type="button"
                onClick={handleReanswer}
                className="inline-flex min-h-14 items-center justify-center rounded-full border border-black/8 bg-white px-6 text-base font-medium text-[#101828] transition hover:border-black/12 hover:bg-[#f6f0e5] sm:px-8"
              >
                Re-Answer
              </button>

              {recorderState === "recording" ? (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#101828] px-6 text-base font-medium text-white transition hover:bg-[#1b2333] sm:px-8"
                >
                  <PauseCircle className="h-5 w-5" />
                  Stop Recording
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startRecording}
                  disabled={recorderState === "submitting"}
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#3f67f5] px-6 text-base font-medium text-white transition hover:bg-[#3556d2] disabled:cursor-not-allowed disabled:bg-[#9db0ff] sm:px-8"
                >
                  <Mic className="h-5 w-5" />
                  Start Answering
                </button>
              )}

              <button
                type="button"
                onClick={submitAssessment}
                disabled={!audioBlob || recorderState === "submitting"}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-black/8 bg-white px-6 text-base font-medium text-[#101828] transition hover:border-black/12 hover:bg-[#f6f0e5] disabled:cursor-not-allowed disabled:text-[#98a2b3] sm:px-8"
              >
                {recorderState === "submitting" ? (
                  <>
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                    Analyzing
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    Analyze Answer
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleNextQuestion}
                className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#101828] px-6 text-base font-medium text-white transition hover:bg-[#1b2333] sm:px-8"
              >
                {nextButtonLabel}
              </button>
            </div>

            <div className="grid gap-2 text-sm leading-6 text-[#6f675c]">
              <p>{status}</p>
              {recorderState === "recording" ? (
                <p className="font-medium text-[#b42318]">Recording Time: {liveDurationLabel}</p>
              ) : null}
              <p>{usageLine}</p>
            </div>

            {audioUrl ? (
              <audio
                controls
                src={audioUrl}
                className="mt-2 w-full rounded-2xl border border-black/8 bg-[#faf7f1] p-2"
              />
            ) : null}
          </div>
        </div>

        {result ? (
          <section className="grid gap-8">
            <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
              <div className="rounded-[28px] bg-[#101828] p-6 text-white shadow-[0_24px_60px_rgba(16,24,40,0.18)] sm:rounded-[32px] sm:p-8">
                <p className="text-[5rem] font-semibold leading-none tracking-[-0.08em]">
                  {formatScore(result.overallBand)}
                </p>
                <p className="mt-5 text-sm uppercase tracking-[0.32em] text-white/72">
                  {scoreLabelMap.overall.en}
                </p>
                <p className="mt-2 text-sm text-white/72">{scoreLabelMap.overall.zh}</p>
              </div>

              <div className="rounded-[28px] border border-black/8 bg-white p-5 shadow-[0_18px_50px_rgba(16,24,40,0.06)] sm:rounded-[32px] sm:p-6">
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                  {scoreItems.map((item) => (
                    <div key={item.label} className="grid gap-3">
                      <p className="text-[3rem] font-semibold leading-none tracking-[-0.06em] text-[#101828]">
                        {formatScore(item.score)}
                      </p>
                      <div>
                        <p className="text-sm uppercase tracking-[0.24em] text-[#6f675c]">{item.label}</p>
                        <p className="mt-1 text-sm text-[#8d7557]">{item.zh}</p>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-[#eef1f5]">
                        <div
                          className="h-full rounded-full bg-[#9a7c57]"
                          style={{ width: `${Math.min(100, (item.score / 9) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-black/8 bg-white p-5 shadow-[0_18px_50px_rgba(16,24,40,0.06)] sm:rounded-[32px] sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8d7557]">Next Band Gap</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#101828]">
                距离下一个分数段，还差什么
              </h2>
              <p className="mt-4 max-w-4xl text-base leading-8 text-[#344054]">{result.targetBandGap}</p>
            </div>

            <div className="rounded-[28px] border border-black/8 bg-white p-5 shadow-[0_18px_50px_rgba(16,24,40,0.06)] sm:rounded-[32px] sm:p-7">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#101828]">Detailed Analysis</h2>
                  <p className="mt-3 text-sm leading-7 text-[#6f675c]">
                    从亮点表达、词组搭配、连接结构和语法问题四个层面看这次回答。
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {analysisLegend.map((item) => (
                    <span
                      key={item.label}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium ${item.className}`}
                    >
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 text-base leading-9 text-[#101828] sm:text-lg sm:leading-[2.2]">
                {renderHighlightedTranscript(result.transcript, result.masteredPhrases)}
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
              <div className="rounded-[28px] border border-black/8 bg-white p-5 shadow-[0_18px_50px_rgba(16,24,40,0.06)] sm:rounded-[32px] sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8d7557]">Mastered Phrases</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {result.masteredPhrases.map((phrase) => (
                    <span
                      key={phrase}
                      className="rounded-2xl bg-[#e8f8ee] px-4 py-3 text-base font-medium text-[#18794e]"
                    >
                      {phrase}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-black/8 bg-[#f7f9fc] p-5 shadow-[0_18px_50px_rgba(16,24,40,0.05)] sm:rounded-[32px] sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8d7557]">点评</p>
                <p className="mt-5 text-base leading-8 text-[#1d2939] sm:text-lg sm:leading-10">{result.examinerFeedback}</p>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
              <div className="rounded-[28px] border border-black/8 bg-white p-5 shadow-[0_18px_50px_rgba(16,24,40,0.06)] sm:rounded-[32px] sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8d7557]">7-Day Focus</p>
                <h3 className="mt-3 text-xl font-semibold text-[#101828]">未来 7 天最该练什么</h3>
                <div className="mt-5 grid gap-3">
                  {result.weeklyFocus.map((item, index) => (
                    <p key={`${item}-${index}`} className="rounded-2xl bg-[#faf7f1] px-4 py-3 text-sm leading-7 text-[#344054]">
                      {item}
                    </p>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-black/8 bg-white p-5 shadow-[0_18px_50px_rgba(16,24,40,0.06)] sm:rounded-[32px] sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8d7557]">15 Minutes</p>
                <h3 className="mt-3 text-xl font-semibold text-[#101828]">每天练习 15 分钟做什么</h3>
                <div className="mt-5 grid gap-3">
                  {result.dailyFifteenPlan.map((item, index) => (
                    <p key={`${item}-${index}`} className="rounded-2xl bg-[#faf7f1] px-4 py-3 text-sm leading-7 text-[#344054]">
                      {item}
                    </p>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-black/8 bg-white p-5 shadow-[0_18px_50px_rgba(16,24,40,0.06)] sm:rounded-[32px] sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8d7557]">Score Killers</p>
                <h3 className="mt-3 text-xl font-semibold text-[#101828]">最影响分数的错误</h3>
                <div className="mt-5 grid gap-3">
                  {result.scoreKillers.map((item, index) => (
                    <p key={`${item}-${index}`} className="rounded-2xl bg-[#fff4f2] px-4 py-3 text-sm leading-7 text-[#b42318]">
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-black/8 bg-white p-5 shadow-[0_18px_50px_rgba(16,24,40,0.06)] sm:rounded-[32px] sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8d7557]">Sprint Plan</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#101828]">7 天冲刺计划</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {result.sevenDaySprintPlan.map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="rounded-[24px] border border-black/8 bg-[#fffdf8] p-5 text-sm leading-7 text-[#344054]"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8d7557]">
                      Day {index + 1}
                    </p>
                    <p className="mt-3">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {polishedVersion ? (
              <div className="rounded-[28px] border border-black/8 bg-white p-5 shadow-[0_18px_50px_rgba(16,24,40,0.06)] sm:rounded-[32px] sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8d7557]">Band 8 Polished Version</p>
                  <TextToSpeechButton text={polishedVersion} />
                </div>
                <p className="mt-4 text-sm leading-7 text-[#667085]">
                  This version keeps your original meaning, but upgrades the wording, sentence flow, and overall delivery to a stronger Band 8 level.
                </p>
                <p className="mt-6 text-base leading-8 text-[#101828] sm:text-lg sm:leading-10">{polishedVersion}</p>
              </div>
            ) : null}

            {referenceAnswer ? (
              <div className="rounded-[28px] border border-black/8 bg-white p-5 shadow-[0_18px_50px_rgba(16,24,40,0.06)] sm:rounded-[32px] sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8d7557]">Reference Answer</p>
                  <TextToSpeechButton text={referenceAnswer} />
                </div>
                <p className="mt-6 text-base leading-8 text-[#101828] sm:text-lg sm:leading-10">{referenceAnswer}</p>
              </div>
            ) : null}
          </section>
        ) : null}
      </section>

      {showLoginPrompt ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101828]/35 px-4">
          <div className="w-full max-w-md rounded-[24px] bg-white p-5 shadow-[0_24px_80px_rgba(16,24,40,0.18)] sm:rounded-[28px] sm:p-7">
            <h3 className="text-2xl font-semibold text-[#101828]">登录后再分析</h3>
            <p className="mt-3 text-sm leading-7 text-[#475467]">
              你现在可以继续录音，但真实语音转文字和 AI 评分只对已登录用户开放。
            </p>
            <div className="mt-6 grid gap-3 sm:flex">
              <button
                type="button"
                onClick={() => setShowLoginPrompt(false)}
                className="inline-flex flex-1 items-center justify-center rounded-full border border-black/8 bg-white px-4 py-3 text-sm text-[#101828] transition hover:border-black/15 hover:bg-[#f7f1e7]"
              >
                稍后再说
              </button>
              <Link
                href="/me"
                className="inline-flex flex-1 items-center justify-center rounded-full bg-[#101828] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#1b2333]"
              >
                去登录
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      {showUpgradePrompt ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101828]/35 px-4">
          <div className="w-full max-w-lg rounded-[24px] bg-white p-5 shadow-[0_24px_80px_rgba(16,24,40,0.18)] sm:rounded-[28px] sm:p-7">
            <h3 className="text-2xl font-semibold text-[#101828]">当前次数已用完</h3>
            <p className="mt-3 text-sm leading-7 text-[#475467]">
              你可以前往 AI 口语定价页面查看 Free、Pro、Ultra 和加量包方案，再扫码联系客服开通。
            </p>
            <div className="mt-6 grid gap-3 sm:flex">
              <button
                type="button"
                onClick={() => setShowUpgradePrompt(false)}
                className="inline-flex flex-1 items-center justify-center rounded-full border border-black/8 bg-white px-4 py-3 text-sm text-[#101828] transition hover:border-black/15 hover:bg-[#f7f1e7]"
              >
                关闭
              </button>
              <Link
                href="/me/pricing"
                className="inline-flex flex-1 items-center justify-center rounded-full bg-[#101828] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#1b2333]"
              >
                查看 AI 口语定价
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
