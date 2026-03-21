"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LoaderCircle, Mic, PauseCircle, Play, Volume2 } from "lucide-react";

import { useAuth } from "@/components/auth-provider";
import {
  deletePendingMockSubmission,
  loadPendingMockSubmission,
  saveMockReport,
  savePendingMockSubmission,
} from "@/lib/mock-report-storage";
import { createFullMockTestSession } from "@/lib/mock-test";
import type { MockPrompt, MockPromptTranscript, MockTestSession } from "@/lib/types";

type RecorderState =
  | "idle"
  | "playing"
  | "preparing"
  | "ready"
  | "recording"
  | "processing"
  | "submitting"
  | "completed";

type PromptRecording = {
  blob: Blob | null;
  audioUrl: string | null;
  durationSeconds: number;
};

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.max(0, totalSeconds % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function createEmptyRecordings(session: MockTestSession): PromptRecording[] {
  return session.prompts.map(() => ({
    blob: null,
    audioUrl: null,
    durationSeconds: 0,
  }));
}

function isPart2Prompt(prompt: MockPrompt | null): prompt is MockPrompt {
  return Boolean(prompt && prompt.part === "Part 2" && (prompt.prepSeconds ?? 0) > 0);
}

function buildPromptSpeech(prompt: MockPrompt) {
  if (prompt.part === "Part 2" && prompt.cuePoints.length) {
    return [prompt.prompt, "You should say", ...prompt.cuePoints].join(". ");
  }

  return prompt.prompt;
}

function buildExaminerLeadIn(session: MockTestSession, prompts: MockPrompt[], index: number) {
  const prompt = prompts[index];
  const previousPrompt = prompts[index - 1];
  const part3Index = prompts.filter((item, itemIndex) => item.part === "Part 3" && itemIndex <= index).length;

  if (!prompt) {
    return "";
  }

  if (index === 0) {
    return `Good morning. This is the speaking test. Let's begin with Part 1. Let's talk about ${prompt.topic}.`;
  }

  if (prompt.part === "Part 1" && previousPrompt?.part === "Part 1" && previousPrompt.topic !== prompt.topic) {
    return `Now let's move on to ${prompt.topic}.`;
  }

  if (prompt.part === "Part 1") {
    return "";
  }

  if (prompt.part === "Part 2" && previousPrompt?.part !== "Part 2") {
    return "Now I'm going to give you a topic. You have one minute to prepare. You can make some notes if you wish.";
  }

  if (prompt.part === "Part 3" && previousPrompt?.part !== "Part 3") {
    return `We've been talking about ${session.part2Topic}. Now I'd like to discuss some more general questions related to this topic.`;
  }

  if (prompt.part === "Part 3" && part3Index === 2) {
    return "Now here's another question related to this topic.";
  }

  return "";
}

function buildCombinedSpeech(session: MockTestSession, prompts: MockPrompt[], index: number) {
  const prompt = prompts[index];
  if (!prompt) {
    return "";
  }

  const leadIn = buildExaminerLeadIn(session, prompts, index);
  return [leadIn, buildPromptSpeech(prompt)].filter(Boolean).join(" ");
}

export function FullMockTest() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { accessToken, refreshUsage, usage, user } = useAuth();
  const initialSession = useMemo(() => createFullMockTestSession(), []);

  const [session, setSession] = useState<MockTestSession>(initialSession);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recorderState, setRecorderState] = useState<RecorderState>("idle");
  const [status, setStatus] = useState("点击“开始模考”后，系统会按真实考试流程逐题推进。");
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [recordingElapsed, setRecordingElapsed] = useState(0);
  const [prepRemaining, setPrepRemaining] = useState<number | null>(null);
  const [examinerLine, setExaminerLine] = useState("");
  const [restoring, setRestoring] = useState(false);
  const [recordings, setRecordings] = useState<PromptRecording[]>(() => createEmptyRecordings(initialSession));

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const startedAtRef = useRef<number | null>(null);
  const elapsedTimerRef = useRef<number | null>(null);
  const prepTimerRef = useRef<number | null>(null);
  const speechFallbackTimerRef = useRef<number | null>(null);
  const hasRestoredRef = useRef(false);
  const hasAutoSubmittedRef = useRef(false);
  const recordingsRef = useRef<PromptRecording[]>(recordings);

  const resumeMock = searchParams.get("resumeMock") === "1";
  const resumeSessionId = searchParams.get("sessionId");

  const currentPrompt = activeIndex >= 0 ? session.prompts[activeIndex] : null;
  const completedCount = recordings.filter((item) => item.blob).length;
  const allRecorded = completedCount === session.prompts.length;
  const totalDurationSeconds = recordings.reduce((sum, item) => sum + item.durationSeconds, 0);
  const progressPercent = activeIndex < 0 ? 0 : ((activeIndex + 1) / session.prompts.length) * 100;

  const usageLine = useMemo(() => {
    if (!user) {
      return "未登录状态下可以完成整套录音，但生成正式模考报告前需要先登录。";
    }

    if (!usage) {
      return "正在加载额度信息。";
    }

    if (usage.hasActiveMembership) {
      return `会员主额度剩余 ${usage.membershipQuotaRemaining} 次，加量包剩余 ${usage.activeAddonCreditsRemaining} 次。`;
    }

    return `免费分析次数剩余 ${usage.freeTrialsRemaining} 次。`;
  }, [usage, user]);

  const clearSpeechAndPrep = useCallback(() => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
    }

    if (prepTimerRef.current) {
      window.clearInterval(prepTimerRef.current);
      prepTimerRef.current = null;
    }

    if (speechFallbackTimerRef.current) {
      window.clearTimeout(speechFallbackTimerRef.current);
      speechFallbackTimerRef.current = null;
    }

    setPrepRemaining(null);
  }, []);

  const speakInstruction = useCallback((text: string, onEnd?: () => void) => {
    if (typeof window === "undefined") {
      onEnd?.();
      return;
    }

    const synth = window.speechSynthesis;
    let finished = false;

    const finish = () => {
      if (finished) {
        return;
      }
      finished = true;
      if (speechFallbackTimerRef.current) {
        window.clearTimeout(speechFallbackTimerRef.current);
        speechFallbackTimerRef.current = null;
      }
      onEnd?.();
    };

    synth.cancel();
    setRecorderState("playing");

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    utterance.onend = finish;
    utterance.onerror = finish;

    synth.speak(utterance);

    // Some browsers do not reliably fire `onend` for short utterances.
    // Keep checking until the speech queue is actually idle before continuing.
    const estimatedDurationMs = Math.max(3200, Math.ceil(text.trim().split(/\s+/).length * 520));
    speechFallbackTimerRef.current = window.setTimeout(function waitUntilSpeechEnds() {
      if (!synth.speaking && !synth.pending) {
        finish();
        return;
      }

      speechFallbackTimerRef.current = window.setTimeout(waitUntilSpeechEnds, 250);
    }, estimatedDurationMs);
  }, []);

  useEffect(() => {
    recordingsRef.current = recordings;
  }, [recordings]);

  useEffect(() => {
    return () => {
      clearSpeechAndPrep();
      streamRef.current?.getTracks().forEach((track) => track.stop());

      if (elapsedTimerRef.current) {
        window.clearInterval(elapsedTimerRef.current);
      }

      recordingsRef.current.forEach((item) => {
        if (item.audioUrl) {
          URL.revokeObjectURL(item.audioUrl);
        }
      });
    };
  }, [clearSpeechAndPrep]);

  const updateRecording = useCallback((index: number, nextValue: PromptRecording) => {
    setRecordings((current) =>
      current.map((item, itemIndex) => {
        if (itemIndex !== index) {
          return item;
        }

        if (item.audioUrl && item.audioUrl !== nextValue.audioUrl) {
          URL.revokeObjectURL(item.audioUrl);
        }

        return nextValue;
      }),
    );
  }, []);

  const startRecording = useCallback(
    async (autoStarted = false) => {
      if (!currentPrompt || recorderState === "playing" || recorderState === "submitting") {
        return;
      }

      if (!autoStarted && recorderState === "preparing") {
        return;
      }

      clearSpeechAndPrep();

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mimeType =
          ["audio/ogg;codecs=opus", "audio/ogg", "audio/webm;codecs=opus", "audio/webm"].find((item) =>
            MediaRecorder.isTypeSupported(item),
          ) || undefined;

        const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);

        streamRef.current = stream;
        recorderRef.current = recorder;
        chunksRef.current = [];
        startedAtRef.current = Date.now();
        setRecorderState("recording");
        setRecordingElapsed(0);
        setStatus(
          autoStarted
            ? "Part 2 准备时间结束，系统已开始录音。请直接作答，完成后点击 Stop Recording。"
            : "正在录音，请回答当前题目。答完后点击 Stop Recording。",
        );

        elapsedTimerRef.current = window.setInterval(() => {
          setRecordingElapsed(Math.max(1, Math.floor((Date.now() - (startedAtRef.current ?? Date.now())) / 1000)));
        }, 200);

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
        };

        recorder.onstop = () => {
          if (elapsedTimerRef.current) {
            window.clearInterval(elapsedTimerRef.current);
            elapsedTimerRef.current = null;
          }

          const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
          const audioUrl = URL.createObjectURL(blob);
          const durationSeconds = Math.max(
            1,
            Math.round(((Date.now() - (startedAtRef.current ?? Date.now())) / 1000) * 10) / 10,
          );

          updateRecording(activeIndex, {
            blob,
            audioUrl,
            durationSeconds,
          });

          stream.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
          recorderRef.current = null;
          setRecorderState("ready");
          setStatus(
            activeIndex >= session.prompts.length - 1
              ? "整套录音已完成。现在可以生成 Mock Report。"
              : "当前题目录音完成。你可以重新作答，或点击 Next Question 进入下一题。",
          );
        };

        recorder.start();
      } catch {
        setRecorderState("ready");
        setStatus("麦克风权限未开启，请先允许浏览器访问麦克风后再试。");
      }
    },
    [activeIndex, clearSpeechAndPrep, currentPrompt, recorderState, session.prompts.length, updateRecording],
  );

  const startPrepCountdown = useCallback(
    (seconds: number) => {
      setRecorderState("preparing");
      setPrepRemaining(seconds);
      setStatus(`Part 2 准备时间开始，还剩 ${formatDuration(seconds)}。准备结束后系统会自动开始录音。`);

      prepTimerRef.current = window.setInterval(() => {
        setPrepRemaining((current) => {
          if (current === null) {
            return null;
          }

          if (current <= 1) {
            if (prepTimerRef.current) {
              window.clearInterval(prepTimerRef.current);
              prepTimerRef.current = null;
            }

            setStatus("准备时间结束，考官正在提示你开始回答。");
            setExaminerLine("All right. You can start speaking now.");
            speakInstruction("All right. You can start speaking now.", () => {
              setRecorderState("ready");
              setStatus("准备时间已结束，请点击 Start Recording 开始回答。");
            });
            return 0;
          }

          return current - 1;
        });
      }, 1000);
    },
    [speakInstruction],
  );

  const speakPrompt = useCallback(
    (index: number, includeLeadIn = true) => {
      const prompt = session.prompts[index];
      if (!prompt) {
        return;
      }

      clearSpeechAndPrep();
      const spokenLeadIn = includeLeadIn ? buildExaminerLeadIn(session, session.prompts, index) : "";
      setExaminerLine(spokenLeadIn);

      if (typeof window === "undefined") {
        if (isPart2Prompt(prompt)) {
          startPrepCountdown(prompt.prepSeconds ?? 60);
        } else {
          setRecorderState("ready");
          setStatus("题目已展示完毕，请点击 Start Recording 开始作答。");
        }
        return;
      }

      const synth = window.speechSynthesis;
      synth.cancel();
      setRecorderState("playing");
      setStatus("系统正在播放题目，请等题目播报结束。");

      const utterance = new SpeechSynthesisUtterance(
        includeLeadIn ? buildCombinedSpeech(session, session.prompts, index) : buildPromptSpeech(prompt),
      );
      utterance.lang = "en-US";
      utterance.rate = 0.92;
      utterance.onend = () => {
        if (isPart2Prompt(prompt)) {
          startPrepCountdown(prompt.prepSeconds ?? 60);
        } else {
          setRecorderState("ready");
          setStatus("题目已播放完毕，请点击 Start Recording 开始作答。");
        }
      };

      synth.speak(utterance);
    },
    [clearSpeechAndPrep, session, startPrepCountdown],
  );

  const openPrompt = useCallback(
    (index: number) => {
      const prompt = session.prompts[index];
      if (!prompt) {
        return;
      }

      setActiveIndex(index);
      setRecordingElapsed(0);
      speakPrompt(index, true);
    },
    [session.prompts, speakPrompt],
  );

  const stopRecording = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state === "recording") {
      setRecorderState("processing");
      setStatus("录音已结束，系统正在保存当前回答，请稍候。");
      recorderRef.current.requestData();
      recorderRef.current.stop();
    }
  }, []);

  const persistPendingSubmission = useCallback(async () => {
    const pendingRecordings = session.prompts
      .map((prompt, index) => ({
        promptId: prompt.id,
        blob: recordings[index]?.blob,
        durationSeconds: recordings[index]?.durationSeconds ?? 0,
      }))
      .filter((item): item is { promptId: string; blob: Blob; durationSeconds: number } => Boolean(item.blob));

    await savePendingMockSubmission(session.id, {
      session,
      recordings: pendingRecordings,
      totalDurationSeconds,
      createdAt: new Date().toISOString(),
    });
  }, [recordings, session, totalDurationSeconds]);

  const handleSubmit = useCallback(async () => {
    if (!allRecorded) {
      setStatus("请先完成整套录音，再统一生成模考报告。");
      return;
    }

    if (!user || !accessToken) {
      await persistPendingSubmission();
      router.push(`/me?returnTo=${encodeURIComponent(`/mock/full?resumeMock=1&sessionId=${session.id}`)}`);
      return;
    }

    setRecorderState("submitting");
    setStatus("正在生成 Mock Report，请稍候。");

    const metadata: MockPromptTranscript[] = session.prompts.map((prompt, index) => ({
      id: prompt.id,
      part: prompt.part,
      topic: prompt.topic,
      prompt: prompt.prompt,
      transcript: "",
      durationSeconds: recordings[index]?.durationSeconds ?? 0,
    }));

    const formData = new FormData();
    formData.append("session", JSON.stringify(session));
    formData.append("metadata", JSON.stringify(metadata));
    formData.append("totalDurationSeconds", String(Math.round(totalDurationSeconds)));

    recordings.forEach((item, index) => {
      if (item.blob) {
        formData.append(`audio_${index}`, item.blob, `${session.prompts[index]?.id ?? index}.ogg`);
      }
    });

    const response = await fetch("/api/mock-assessment", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData,
    });

    if (response.status === 401) {
      setRecorderState("ready");
      await persistPendingSubmission();
      router.push(`/me?returnTo=${encodeURIComponent(`/mock/full?resumeMock=1&sessionId=${session.id}`)}`);
      return;
    }

    if (response.status === 403) {
      setRecorderState("ready");
      await persistPendingSubmission();
      setShowUpgradePrompt(true);
      setStatus("当前可用次数不足，请先开通对应方案后再继续生成模考报告。");
      return;
    }

    if (!response.ok) {
      setRecorderState("ready");
      setStatus("Mock Report 生成失败，请稍后重试。");
      return;
    }

    const result = await response.json();
    saveMockReport(session.id, { session, result });
    await deletePendingMockSubmission(session.id);
    setRecorderState("completed");
    setStatus("Mock Report 已生成，正在进入报告页面。");
    await refreshUsage();
    router.push(`/mock/full/report/${session.id}`);
  }, [accessToken, allRecorded, persistPendingSubmission, recordings, refreshUsage, router, session, totalDurationSeconds, user]);

  useEffect(() => {
    if (!resumeMock || !resumeSessionId || hasRestoredRef.current) {
      return;
    }

    hasRestoredRef.current = true;

    const restorePendingMock = async () => {
      setRestoring(true);

      try {
        const pending = await loadPendingMockSubmission(resumeSessionId);

        if (!pending) {
          setRestoring(false);
          setStatus("未找到待恢复的模考记录，你可以重新开始一次全真模考。");
          return;
        }

        setSession(pending.session);
        setRecordings(
          pending.session.prompts.map((prompt) => {
            const restored = pending.recordings.find((item) => item.promptId === prompt.id);
            return {
              blob: restored?.blob ?? null,
              audioUrl: restored?.blob ? URL.createObjectURL(restored.blob) : null,
              durationSeconds: restored?.durationSeconds ?? 0,
            };
          }),
        );
        setActiveIndex(Math.max(0, pending.session.prompts.length - 1));
        setExaminerLine("模考记录已恢复。");
        setStatus(
          pending.recordings.length === pending.session.prompts.length
            ? "整套录音已恢复，正在准备继续生成 Mock Report。"
            : "模考录音已恢复，请继续完成剩余题目。",
        );
        setRecorderState("ready");
        setRestoring(false);
      } catch {
        setRestoring(false);
        setStatus("恢复模考记录失败，请重新开始一次全真模考。");
      }
    };

    void restorePendingMock();
  }, [resumeMock, resumeSessionId]);

  useEffect(() => {
    if (
      !resumeMock ||
      !resumeSessionId ||
      !user ||
      !accessToken ||
      !allRecorded ||
      restoring ||
      recorderState === "submitting" ||
      hasAutoSubmittedRef.current
    ) {
      return;
    }

    hasAutoSubmittedRef.current = true;
    queueMicrotask(() => {
      void handleSubmit();
    });
  }, [accessToken, allRecorded, handleSubmit, recorderState, restoring, resumeMock, resumeSessionId, user]);

  return (
    <>
      <section className="grid gap-8 rounded-[36px] border border-black/8 bg-white px-6 py-8 shadow-[0_24px_80px_rgba(16,24,40,0.08)] lg:px-10">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8d7557]">Full Mock Test</p>
          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.06em] text-[#101828] sm:text-5xl lg:text-[4.8rem]">
            全真模考
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-[#5b5349]">
            系统会按真实雅思口语流程依次推进 Part 1、Part 2 和 Part 3，完成整套录音后统一生成整套模拟测评报告。
          </p>
        </div>

        {activeIndex < 0 ? (
          <div className="grid gap-6 rounded-[28px] border border-black/8 bg-[#fffcf6] p-8">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[24px] bg-white p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-[#8d7557]">Part 1</p>
                <p className="mt-3 text-lg font-semibold text-[#101828]">
                  {session.part1RequiredTheme} + {session.part1GeneralTheme}
                </p>
                <p className="mt-2 text-sm leading-7 text-[#5b5349]">共 8 题，模拟真实短答节奏。</p>
              </div>
              <div className="rounded-[24px] bg-white p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-[#8d7557]">Part 2</p>
                <p className="mt-3 text-lg font-semibold text-[#101828]">{session.part2Topic}</p>
                <p className="mt-2 text-sm leading-7 text-[#5b5349]">含 1 分钟准备时间，准备结束后系统自动开始录音。</p>
              </div>
              <div className="rounded-[24px] bg-white p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-[#8d7557]">Part 3</p>
                <p className="mt-3 text-lg font-semibold text-[#101828]">{session.part3Topic}</p>
                <p className="mt-2 text-sm leading-7 text-[#5b5349]">与 Part 2 主题顺承，统一完成深度讨论。</p>
              </div>
            </div>

            <div className="flex justify-center">
              <button type="button" onClick={() => openPrompt(0)} className="brand-button min-w-[240px]">
                开始模考
              </button>
            </div>
          </div>
        ) : null}

        {currentPrompt ? (
          <div className="grid gap-8">
            <div className="grid gap-5">
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm text-[#6f675c]">
                  当前进度 {activeIndex + 1} / {session.prompts.length}
                </div>
                <div className="text-sm text-[#6f675c]">{currentPrompt.part}</div>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-[#efe9dc]">
                <div
                  className="h-full rounded-full bg-[#101828] transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="grid gap-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8d7557]">{currentPrompt.topic}</p>
              <h2 className="mx-auto max-w-4xl text-3xl font-semibold tracking-[-0.05em] text-[#101828] sm:text-4xl">
                {currentPrompt.prompt}
              </h2>

              {examinerLine ? (
                <div className="mx-auto max-w-3xl rounded-[24px] border border-[#8d7557]/18 bg-[#faf5eb] px-6 py-4 text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8d7557]">Examiner Lead-in</p>
                  <p className="mt-3 text-base leading-8 text-[#344054]">{examinerLine}</p>
                </div>
              ) : null}

              {currentPrompt.cuePoints.length ? (
                <div className="mx-auto max-w-3xl rounded-[28px] border border-black/8 bg-[#fffdf8] p-6 text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8d7557]">You should say</p>
                  <div className="mt-4 grid gap-2 text-base leading-8 text-[#344054]">
                    {currentPrompt.cuePoints.map((point) => (
                      <p key={point}>• {point}</p>
                    ))}
                  </div>
                </div>
              ) : null}

              {prepRemaining !== null && isPart2Prompt(currentPrompt) ? (
                <div className="mx-auto max-w-xl rounded-[24px] border border-[#8d7557]/18 bg-[#fff7ea] px-6 py-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8d7557]">Preparation Time</p>
                  <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#101828]">
                    {formatDuration(prepRemaining)}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[#5b5349]">
                    倒计时结束后，系统会自动开始录音。你可以在这段时间内整理 Part 2 的思路。
                  </p>
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => speakPrompt(activeIndex, false)}
                disabled={recorderState === "recording" || recorderState === "processing" || recorderState === "submitting"}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-black/8 bg-white px-8 text-base font-medium text-[#101828] transition hover:border-black/12 hover:bg-[#f6f0e5] disabled:cursor-not-allowed disabled:text-[#98a2b3]"
              >
                <Volume2 className="h-5 w-5" />
                Play Question
              </button>

              {recorderState === "recording" ? (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#101828] px-8 text-base font-medium text-white transition hover:bg-[#1b2333]"
                >
                  <PauseCircle className="h-5 w-5" />
                  Stop Recording
                </button>
              ) : recorderState === "processing" ? (
                <button
                  type="button"
                  disabled
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#98a2b3] px-8 text-base font-medium text-white"
                >
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                  Saving Recording
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => void startRecording(false)}
                  disabled={
                    recorderState === "playing" ||
                    recorderState === "preparing" ||
                    recorderState === "submitting"
                  }
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#101828] px-8 text-base font-medium text-white transition hover:bg-[#1b2333] disabled:cursor-not-allowed disabled:bg-[#98a2b3]"
                >
                  <Mic className="h-5 w-5" />
                  Start Recording
                </button>
              )}

              <button
                type="button"
                onClick={() => openPrompt(activeIndex)}
                disabled={recorderState === "recording" || recorderState === "processing" || recorderState === "submitting"}
                className="inline-flex min-h-14 items-center justify-center rounded-full border border-black/8 bg-white px-8 text-base font-medium text-[#101828] transition hover:border-black/12 hover:bg-[#f6f0e5] disabled:cursor-not-allowed disabled:text-[#98a2b3]"
              >
                Re-Answer
              </button>

              <button
                type="button"
                onClick={() => {
                  if (activeIndex < session.prompts.length - 1) {
                    openPrompt(activeIndex + 1);
                  } else {
                    setStatus("整套录音已完成，现在可以生成 Mock Report。");
                  }
                }}
                disabled={
                  recorderState === "playing" ||
                  recorderState === "preparing" ||
                  recorderState === "recording" ||
                  recorderState === "processing" ||
                  !recordings[activeIndex]?.blob
                }
                className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#101828] px-8 text-base font-medium text-white transition hover:bg-[#1b2333] disabled:cursor-not-allowed disabled:bg-[#98a2b3]"
              >
                {activeIndex >= session.prompts.length - 1 ? "Finish Recording" : "Next Question"}
              </button>
            </div>

            <div className="grid gap-2 text-center text-sm text-[#6f675c]">
              <p>{status}</p>
              <p>{usageLine}</p>
              {recorderState === "recording" ? <p>当前录音时长：{formatDuration(recordingElapsed)}</p> : null}
              <p>
                已完成 {completedCount} / {session.prompts.length} 题，总录音时长 {formatDuration(Math.round(totalDurationSeconds))}
              </p>
            </div>

            {recordings[activeIndex]?.audioUrl ? (
              <audio
                controls
                src={recordings[activeIndex]?.audioUrl ?? undefined}
                className="w-full rounded-2xl border border-black/8 bg-[#faf7f1] p-2"
              />
            ) : null}

            {allRecorded ? (
              <div className="grid justify-center gap-2 text-center">
                <button
                  type="button"
                  onClick={() => void handleSubmit()}
                  disabled={recorderState === "submitting" || restoring}
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-black/8 bg-white px-8 text-base font-medium text-[#101828] transition hover:border-black/12 hover:bg-[#f6f0e5] disabled:cursor-not-allowed disabled:text-[#98a2b3]"
                >
                  {recorderState === "submitting" || restoring ? (
                    <>
                      <LoaderCircle className="h-5 w-5 animate-spin" />
                      Generating Report
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5" />
                      Generate Mock Report
                    </>
                  )}
                </button>
                <p className="text-xs text-[#8d7557]">预计生成时间 1-2 分钟</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>

      {showUpgradePrompt ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101828]/35 px-4">
          <div className="w-full max-w-lg rounded-[28px] bg-white p-7 shadow-[0_24px_80px_rgba(16,24,40,0.18)]">
            <h3 className="text-2xl font-semibold text-[#101828]">当前次数不足</h3>
            <p className="mt-3 text-sm leading-7 text-[#475467]">
              这套全真模考会按你实际回答的题目数量消耗额度。请先前往 AI口语定价 页面开通对应方案，再回来继续生成报告。
            </p>
            <div className="mt-6 flex gap-3">
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
                查看 AI口语定价
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
