"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LoaderCircle, Mic, PauseCircle, Play, Volume2 } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { deletePendingMockSubmission, loadPendingMockSubmission, saveMockReport, savePendingMockSubmission } from "@/lib/mock-report-storage";
import { createFullMockTestSession } from "@/lib/mock-test";
import type {
  MockAssessmentApiResponse,
  MockGenerationPhase,
  MockPrompt,
  MockPromptTranscript,
  MockTestSession,
  MockTranscriptionApiResponse,
} from "@/lib/types";

type RecorderState = "idle" | "playing" | "preparing" | "ready" | "recording" | "processing" | "submitting";
type PromptRecording = { blob: Blob | null; audioUrl: string | null; durationSeconds: number };
type IntroductionStep = { line: string; waitSeconds: number };
type SubmissionStage = "idle" | "uploading" | "transcribing" | "analyzing" | "finalizing";
type SubmissionPhases = MockAssessmentApiResponse["phases"];

const EXAMINER_NAMES = ["Emily Carter", "Charlotte Hughes", "Sophie Mitchell", "Hannah Wilson", "Victoria Ellison", "Lucy Green", "Anna Scott"];
const DEFAULT_REPORT_GENERATION_SECONDS = 180;
const formatDuration = (s: number) => `${Math.floor(Math.max(0, s) / 60)}:${String(Math.max(0, s) % 60).padStart(2, "0")}`;
const isPart2Prompt = (prompt: MockPrompt | null): prompt is MockPrompt => Boolean(prompt && prompt.part === "Part 2" && (prompt.prepSeconds ?? 0) > 0);
const createEmptyRecordings = (session: MockTestSession): PromptRecording[] => session.prompts.map(() => ({ blob: null, audioUrl: null, durationSeconds: 0 }));
const buildPromptSpeech = (prompt: MockPrompt) => prompt.part === "Part 2" && prompt.cuePoints.length ? [prompt.prompt, "You should say", ...prompt.cuePoints].join(". ") : prompt.prompt;

function buildLeadIn(session: MockTestSession, prompts: MockPrompt[], index: number) {
  const prompt = prompts[index];
  const prev = prompts[index - 1];
  if (!prompt) return "";
  if (index === 0) return `Now let's begin with Part 1. Let's talk about ${prompt.topic}.`;
  if (prompt.part === "Part 1" && prev?.part === "Part 1" && prev.topic !== prompt.topic) return `Now let's move on to ${prompt.topic}.`;
  if (prompt.part === "Part 2" && prev?.part !== "Part 2") return "Now I'm going to give you a topic, and I'd like you to talk about it for one to two minutes. You have one minute to prepare. You can make some notes if you wish.";
  if (prompt.part === "Part 3" && prev?.part !== "Part 3") return `We've been talking about ${session.part2Topic}. Now I'd like to discuss some more general questions related to this topic.`;
  return "";
}

function getSubmissionStageWeight(stage: SubmissionStage) {
  if (stage === "uploading") return 12;
  if (stage === "transcribing") return 48;
  if (stage === "analyzing") return 82;
  if (stage === "finalizing") return 100;
  return 0;
}

function getPhaseTone(status: MockGenerationPhase["status"]) {
  if (status === "success") return "text-[#18794e] bg-[#e8f8ee]";
  if (status === "fallback") return "text-[#b54708] bg-[#fff4e8]";
  if (status === "failed") return "text-[#b42318] bg-[#fff1f1]";
  return "text-[#667085] bg-[#f7f3ea]";
}

export function FullMockTest() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { accessToken, refreshUsage, usage, user } = useAuth();
  const [hasMounted, setHasMounted] = useState(false);
  const [session, setSession] = useState<MockTestSession | null>(null);
  const [recordings, setRecordings] = useState<PromptRecording[]>([]);
  const [examinerName, setExaminerName] = useState(EXAMINER_NAMES[0] ?? "Emily Carter");
  const introSteps = useMemo<IntroductionStep[]>(() => [
    { line: `Good morning. My name is ${examinerName}.`, waitSeconds: 0 },
    { line: "Can you tell me your full name, please?", waitSeconds: 5 },
    { line: "Can I see your identification, please?", waitSeconds: 4 },
    { line: "Thank you. Now let's move on to Part 1.", waitSeconds: 0 },
  ], [examinerName]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recorderState, setRecorderState] = useState<RecorderState>("idle");
  const [status, setStatus] = useState("点击“开始模考”后，系统会先完成考场开场环节，再按真实考试流程推进。");
  const [prepRemaining, setPrepRemaining] = useState<number | null>(null);
  const [recordingElapsed, setRecordingElapsed] = useState(0);
  const [introStepIndex, setIntroStepIndex] = useState(-1);
  const [introRemaining, setIntroRemaining] = useState<number | null>(null);
  const [examinerLine, setExaminerLine] = useState("");
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [submissionProgress, setSubmissionProgress] = useState(0);
  const [submissionStage, setSubmissionStage] = useState<SubmissionStage>("idle");
  const [submissionPhases, setSubmissionPhases] = useState<SubmissionPhases | null>(null);
  const [submissionWarnings, setSubmissionWarnings] = useState<string[]>([]);
  const [submissionElapsedSeconds, setSubmissionElapsedSeconds] = useState(0);
  const [, setTranscribedPayload] = useState<MockPromptTranscript[] | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const startedAtRef = useRef<number | null>(null);
  const elapsedTimerRef = useRef<number | null>(null);
  const prepTimerRef = useRef<number | null>(null);
  const introTimerRef = useRef<number | null>(null);
  const speechTimerRef = useRef<number | null>(null);
  const submissionTimerRef = useRef<number | null>(null);
  const submissionStartedAtRef = useRef<number | null>(null);
  const restoredRef = useRef(false);
  const autoSubmittedRef = useRef(false);
  const recordingsRef = useRef(recordings);

  const resumeMock = searchParams.get("resumeMock") === "1";
  const resumeSessionId = searchParams.get("sessionId");
  const currentPrompt = session && activeIndex >= 0 ? session.prompts[activeIndex] : null;
  const part1PromptCount = session?.prompts.filter((prompt) => prompt.part === "Part 1").length ?? 0;
  const completedCount = recordings.filter((item) => item.blob).length;
  const allRecorded = Boolean(session) && completedCount === session.prompts.length;
  const totalDurationSeconds = recordings.reduce((sum, item) => sum + item.durationSeconds, 0);
  const progressPercent = !session || activeIndex < 0 ? 0 : ((activeIndex + 1) / session.prompts.length) * 100;
  const usageLine = !user ? "未登录状态下可以完成整套录音，但生成正式模考报告前需要先登录。" : !usage ? "正在加载额度信息。" : usage.hasActiveMembership ? `会员主额度剩余 ${usage.membershipQuotaRemaining} 次，加量包剩余 ${usage.activeAddonCreditsRemaining} 次。` : `免费分析次数剩余 ${usage.freeTrialsRemaining} 次。`;
  const submissionRemainingSeconds = Math.max(0, DEFAULT_REPORT_GENERATION_SECONDS - submissionElapsedSeconds);
  const submissionEtaLabel =
    recorderState === "submitting"
      ? submissionRemainingSeconds > 0
        ? `预计剩余时长 ${formatDuration(submissionRemainingSeconds)}`
        : "预计即将完成，请稍候"
      : `预计生成时间约 ${Math.floor(DEFAULT_REPORT_GENERATION_SECONDS / 60)} 分钟`;

  useEffect(() => { recordingsRef.current = recordings; }, [recordings]);
  useEffect(() => {
    setHasMounted(true);
    const nextSession = createFullMockTestSession();
    setSession(nextSession);
    setRecordings(createEmptyRecordings(nextSession));
    setExaminerName(EXAMINER_NAMES[Math.floor(Math.random() * EXAMINER_NAMES.length)] ?? EXAMINER_NAMES[0] ?? "Emily Carter");
  }, []);
  useEffect(() => () => {
    if (typeof window !== "undefined") window.speechSynthesis.cancel();
    if (elapsedTimerRef.current) window.clearInterval(elapsedTimerRef.current);
    if (prepTimerRef.current) window.clearInterval(prepTimerRef.current);
    if (introTimerRef.current) window.clearInterval(introTimerRef.current);
    if (speechTimerRef.current) window.clearTimeout(speechTimerRef.current);
    if (submissionTimerRef.current) window.clearInterval(submissionTimerRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    recordingsRef.current.forEach((item) => item.audioUrl && URL.revokeObjectURL(item.audioUrl));
  }, []);

  useEffect(() => {
    if (recorderState !== "submitting") {
      if (submissionTimerRef.current) window.clearInterval(submissionTimerRef.current);
      submissionTimerRef.current = null;
      submissionStartedAtRef.current = null;
      setSubmissionStage("idle");
      setSubmissionProgress(0);
      setSubmissionElapsedSeconds(0);
      return;
    }

    submissionStartedAtRef.current = Date.now();
    setSubmissionElapsedSeconds(0);
    setSubmissionStage("uploading");
    setSubmissionProgress((current) => (current > 8 ? current : 8));

    submissionTimerRef.current = window.setInterval(() => {
      setSubmissionElapsedSeconds(Math.floor((Date.now() - (submissionStartedAtRef.current ?? Date.now())) / 1000));
      setSubmissionProgress((current) => {
        if (current >= 92) return current;

        const next = current < 28 ? current + 4 : current < 56 ? current + 3 : current + 2;

        if (next >= 24) {
          setSubmissionStage((stage) => (stage === "uploading" ? "transcribing" : stage));
        }
        if (next >= 54) {
          setSubmissionStage((stage) => (stage === "uploading" || stage === "transcribing" ? "analyzing" : stage));
        }
        if (next >= 82) {
          setSubmissionStage("finalizing");
        }

        return Math.min(next, 92);
      });
    }, 1200);

    setSubmissionPhases({
      transcription: { status: "pending", message: "等待服务器开始转写" },
      assessment: { status: "pending", message: "等待转写完成后生成报告" },
    });
    setSubmissionWarnings([]);

    return () => {
      if (submissionTimerRef.current) window.clearInterval(submissionTimerRef.current);
      submissionTimerRef.current = null;
      submissionStartedAtRef.current = null;
    };
  }, [recorderState]);

  const clearFlowTimers = useCallback(() => {
    if (typeof window !== "undefined") window.speechSynthesis.cancel();
    if (prepTimerRef.current) window.clearInterval(prepTimerRef.current);
    if (introTimerRef.current) window.clearInterval(introTimerRef.current);
    if (speechTimerRef.current) window.clearTimeout(speechTimerRef.current);
    prepTimerRef.current = null; introTimerRef.current = null; speechTimerRef.current = null;
    setPrepRemaining(null); setIntroRemaining(null);
  }, []);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (typeof window === "undefined") { onEnd?.(); return; }
    const synth = window.speechSynthesis;
    let done = false;
    const finish = () => { if (done) return; done = true; if (speechTimerRef.current) window.clearTimeout(speechTimerRef.current); onEnd?.(); };
    synth.cancel();
    setRecorderState("playing");
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.92;
    utterance.onend = finish;
    utterance.onerror = finish;
    synth.speak(utterance);
    speechTimerRef.current = window.setTimeout(function waitUntilEnd() {
      if (!synth.speaking && !synth.pending) { finish(); return; }
      speechTimerRef.current = window.setTimeout(waitUntilEnd, 250);
    }, Math.max(2800, text.split(/\s+/).length * 500));
  }, []);

  const updateRecording = useCallback((index: number, nextValue: PromptRecording) => {
    setRecordings((current) => current.map((item, itemIndex) => {
      if (itemIndex !== index) return item;
      if (item.audioUrl && item.audioUrl !== nextValue.audioUrl) URL.revokeObjectURL(item.audioUrl);
      return nextValue;
    }));
  }, []);

  const openPrompt = useCallback((index: number) => {
    if (!session) return;
    const prompt = session.prompts[index];
    if (!prompt) return;
    clearFlowTimers();
    setActiveIndex(index);
    setRecordingElapsed(0);
    const leadIn = buildLeadIn(session, session.prompts, index);
    setExaminerLine(leadIn);
    setStatus("系统正在播放题目，请等待题目播报结束。");
    speak([leadIn, buildPromptSpeech(prompt)].filter(Boolean).join(" "), () => {
      if (isPart2Prompt(prompt)) {
        setRecorderState("preparing");
        setPrepRemaining(prompt.prepSeconds ?? 60);
        setStatus(`Part 2 准备时间开始。剩余 ${formatDuration(prompt.prepSeconds ?? 60)}，倒计时结束后考官会提示你开始回答。`);
        prepTimerRef.current = window.setInterval(() => {
          setPrepRemaining((current) => {
            if (current === null) return null;
            if (current <= 1) {
              if (prepTimerRef.current) window.clearInterval(prepTimerRef.current);
              prepTimerRef.current = null;
              setStatus("准备时间结束，考官正在提示你开始回答。");
              speak("All right. You can start speaking now.", () => {
                setRecorderState("ready");
                setStatus("题目已播报完毕，请点击 Start Recording 开始作答。");
              });
              return 0;
            }
            return current - 1;
          });
        }, 1000);
      } else {
        setRecorderState("ready");
        setStatus("题目已播报完毕，请点击 Start Recording 开始作答。");
      }
    });
  }, [clearFlowTimers, session, speak]);

  const runIntroductionStep = useCallback((index: number) => {
    const step = introSteps[index];
    if (!step) {
      setIntroStepIndex(-1);
      setIntroRemaining(null);
      setExaminerLine("");
      openPrompt(0);
      return;
    }
    setIntroStepIndex(index);
    setExaminerLine(step.line);
    setStatus("The examiner is guiding you through the introduction stage.");
    speak(step.line, () => {
      if (step.waitSeconds <= 0) { runIntroductionStep(index + 1); return; }
      setRecorderState("idle");
      setIntroRemaining(step.waitSeconds);
      setStatus(`Please answer naturally. ${formatDuration(step.waitSeconds)} remaining before the next step.`);
      introTimerRef.current = window.setInterval(() => {
        setIntroRemaining((current) => {
          if (current === null) return null;
          if (current <= 1) {
            if (introTimerRef.current) window.clearInterval(introTimerRef.current);
            introTimerRef.current = null;
            queueMicrotask(() => runIntroductionStep(index + 1));
            return 0;
          }
          return current - 1;
        });
      }, 1000);
    });
  }, [introSteps, openPrompt, speak]);

  const startIntroduction = useCallback(() => {
    clearFlowTimers();
    setActiveIndex(-1);
    setIntroStepIndex(0);
    setRecordingElapsed(0);
    setShowUpgradePrompt(false);
    setRecorderState("idle");
    runIntroductionStep(0);
  }, [clearFlowTimers, runIntroductionStep]);

  const startRecording = useCallback(async () => {
    if (!session || !currentPrompt || ["playing", "preparing", "submitting"].includes(recorderState)) return;
    clearFlowTimers();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = ["audio/ogg;codecs=opus", "audio/ogg", "audio/webm;codecs=opus", "audio/webm"].find((item) => MediaRecorder.isTypeSupported(item)) || undefined;
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      streamRef.current = stream; recorderRef.current = recorder; chunksRef.current = []; startedAtRef.current = Date.now();
      setRecorderState("recording"); setRecordingElapsed(0); setStatus("正在录音，请回答当前题目。答完后点击 Stop Recording。");
      elapsedTimerRef.current = window.setInterval(() => setRecordingElapsed(Math.max(1, Math.floor((Date.now() - (startedAtRef.current ?? Date.now())) / 1000))), 200);
      recorder.ondataavailable = (event) => { if (event.data.size > 0) chunksRef.current.push(event.data); };
      recorder.onstop = () => {
        if (elapsedTimerRef.current) window.clearInterval(elapsedTimerRef.current);
        elapsedTimerRef.current = null;
        const durationSeconds = Math.max(1, Math.round(((Date.now() - (startedAtRef.current ?? Date.now())) / 1000) * 10) / 10);
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        updateRecording(activeIndex, { blob, audioUrl: URL.createObjectURL(blob), durationSeconds });
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null; recorderRef.current = null;
        setRecorderState("ready"); setRecordingElapsed(0);
        setStatus(activeIndex >= session.prompts.length - 1 ? "整套录音已完成，现在可以生成 Mock Report。" : "当前题目录音完成。你可以重新作答，或点击 Next Question 进入下一题。");
      };
      recorder.start();
    } catch {
      setRecorderState("ready");
      setStatus("麦克风权限未开启，请允许浏览器访问麦克风后重试。");
    }
  }, [activeIndex, clearFlowTimers, currentPrompt, recorderState, session, updateRecording]);

  const stopRecording = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state === "recording") {
      setRecorderState("processing");
      setStatus("录音已结束，系统正在保存当前回答，请稍候。");
      recorderRef.current.stop();
    }
  }, []);

  const persistPendingSubmission = useCallback(async () => {
    if (!session) return;
    const pendingRecordings = session.prompts.map((prompt, index) => ({ promptId: prompt.id, blob: recordings[index]?.blob, durationSeconds: recordings[index]?.durationSeconds ?? 0 })).filter((item): item is { promptId: string; blob: Blob; durationSeconds: number } => Boolean(item.blob));
    await savePendingMockSubmission(session.id, { session, recordings: pendingRecordings, totalDurationSeconds, createdAt: new Date().toISOString() });
  }, [recordings, session, totalDurationSeconds]);

  const submissionStageLabel =
    submissionStage === "uploading"
      ? "正在上传录音"
      : submissionStage === "transcribing"
        ? "正在转写每道题"
        : submissionStage === "analyzing"
          ? "正在生成逐题分析与总评"
          : submissionStage === "finalizing"
            ? "正在整理报告页面"
            : "等待开始";

  const submissionDetails = [
    submissionPhases ? { label: "录音转写", phase: submissionPhases.transcription } : null,
    submissionPhases ? { label: "AI 报告", phase: submissionPhases.assessment } : null,
  ].filter((item): item is { label: string; phase: MockGenerationPhase } => Boolean(item));

  const handleSubmit = useCallback(async () => {
    if (!session) return;
    if (!allRecorded) { setStatus("请先完成整套录音，再统一生成模考报告。"); return; }
    if (!user || !accessToken) {
      await persistPendingSubmission();
      router.push(`/me?returnTo=${encodeURIComponent(`/mock/full?resumeMock=1&sessionId=${session.id}`)}`);
      return;
    }
    setSubmissionPhases(null);
    setSubmissionWarnings([]);
    setTranscribedPayload(null);
    setSubmissionStage("uploading");
    setSubmissionProgress(8);
    setRecorderState("submitting"); setStatus("正在上传录音并准备转写，请稍候。");
    const metadata: MockPromptTranscript[] = session.prompts.map((prompt, index) => ({ id: prompt.id, part: prompt.part, topic: prompt.topic, prompt: prompt.prompt, transcript: "", durationSeconds: recordings[index]?.durationSeconds ?? 0 }));
    const formData = new FormData();
    formData.append("session", JSON.stringify(session));
    formData.append("metadata", JSON.stringify(metadata));
    formData.append("totalDurationSeconds", String(Math.round(totalDurationSeconds)));
    recordings.forEach((item, index) => { if (item.blob) formData.append(`audio_${index}`, item.blob, `${session.prompts[index]?.id ?? index}.ogg`); });
    const transcriptionResponse = await fetch("/api/mock-assessment/transcribe", { method: "POST", headers: { Authorization: `Bearer ${accessToken}` }, body: formData });
    let transcriptionPayload: MockTranscriptionApiResponse | null = null;
    let rawResponseText = "";
    try {
      rawResponseText = await transcriptionResponse.text();
      transcriptionPayload = rawResponseText ? (JSON.parse(rawResponseText) as MockTranscriptionApiResponse) : null;
    } catch {
      transcriptionPayload = null;
    }

    if (transcriptionPayload?.phases) {
      setSubmissionPhases(transcriptionPayload.phases);
      setSubmissionWarnings(transcriptionPayload.warnings ?? []);
      setSubmissionStage("transcribing");
      setSubmissionProgress(getSubmissionStageWeight("transcribing"));
    }

    if (transcriptionResponse.status === 401) {
      setSubmissionProgress(getSubmissionStageWeight("transcribing"));
      setSubmissionStage("transcribing");
      setRecorderState("ready"); await persistPendingSubmission();
      router.push(`/me?returnTo=${encodeURIComponent(`/mock/full?resumeMock=1&sessionId=${session.id}`)}`); return;
    }
    if (transcriptionResponse.status === 403) {
      setRecorderState("ready");
      await persistPendingSubmission();
      setShowUpgradePrompt(true);
      setStatus(transcriptionPayload?.error || "当前可用次数不足，请先开通对应方案后再继续生成模考报告。");
      return;
    }
    if (!transcriptionResponse.ok || !transcriptionPayload?.ok || !transcriptionPayload.transcripts?.length) {
      setRecorderState("ready");
      if (!transcriptionPayload) {
        setSubmissionPhases({
          transcription: {
            status: "failed",
            message: "服务端没有返回可识别的阶段数据",
            reason: transcriptionResponse.ok
              ? "接口返回了非 JSON 内容，通常表示云端还是旧版本，或服务端抛错后返回了 HTML。"
              : `HTTP ${transcriptionResponse.status}${rawResponseText ? `: ${rawResponseText.slice(0, 180)}` : ""}`,
          },
          assessment: {
            status: "failed",
            message: "AI 报告阶段未开始",
            reason: "请先检查云服务器是否已经部署最新的转写接口，并确认 Next.js 服务已重启。",
          },
        });
        setStatus(
          transcriptionResponse.ok
            ? "服务端返回了旧格式或非 JSON 响应，请确认云服务器已部署新版 /api/mock-assessment/transcribe。"
            : `录音转写失败，服务器返回 HTTP ${transcriptionResponse.status}。`,
        );
        return;
      }

      const failureReason =
        transcriptionPayload.phases.transcription.reason || transcriptionPayload.phases.assessment.reason || transcriptionPayload.error;
      setStatus(failureReason || "Mock Report 生成失败，请稍后重试。");
      return;
    }

    setTranscribedPayload(transcriptionPayload.transcripts);
    setSubmissionStage("analyzing");
    setSubmissionProgress(getSubmissionStageWeight("analyzing"));
    setStatus("录音转写已完成，正在逐题分析并汇总整套报告。");

    const reportResponse = await fetch("/api/mock-assessment/report", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session,
        transcripts: transcriptionPayload.transcripts,
        totalDurationSeconds: Math.round(totalDurationSeconds),
      }),
    });

    let reportPayload: MockAssessmentApiResponse | null = null;
    let rawReportText = "";
    try {
      rawReportText = await reportResponse.text();
      reportPayload = rawReportText ? (JSON.parse(rawReportText) as MockAssessmentApiResponse) : null;
    } catch {
      reportPayload = null;
    }

    if (reportPayload?.phases) {
      setSubmissionPhases(reportPayload.phases);
      setSubmissionWarnings(reportPayload.warnings ?? transcriptionPayload.warnings ?? []);
      const nextStage =
        reportPayload.phases.assessment.status === "success" || reportPayload.phases.assessment.status === "fallback"
          ? "finalizing"
          : "analyzing";
      setSubmissionStage(nextStage);
      setSubmissionProgress(getSubmissionStageWeight(nextStage));
    }

    if (!reportResponse.ok || !reportPayload?.ok || !reportPayload.result) {
      setRecorderState("ready");
      if (!reportPayload) {
        setSubmissionPhases({
          transcription: transcriptionPayload.phases.transcription,
          assessment: {
            status: "failed",
            message: "服务端没有返回可识别的报告阶段数据",
            reason: reportResponse.ok
              ? "接口返回了非 JSON 内容，通常表示云端还是旧版本，或服务端抛错后返回了 HTML。"
              : `HTTP ${reportResponse.status}${rawReportText ? `: ${rawReportText.slice(0, 180)}` : ""}`,
          },
        });
        setStatus(
          reportResponse.ok
            ? "服务端返回了旧格式或非 JSON 响应，请确认云服务器已部署新版 /api/mock-assessment/report。"
            : `AI 报告生成失败，服务器返回 HTTP ${reportResponse.status}。`,
        );
        return;
      }

      const failureReason = reportPayload.phases.assessment.reason || reportPayload.error;
      setStatus(failureReason || "AI 报告生成失败，请稍后重试。");
      return;
    }

    const result = reportPayload.result;
    setSubmissionProgress(100);
    setSubmissionStage("finalizing");
    saveMockReport(session.id, { session, result });
    await deletePendingMockSubmission(session.id); await refreshUsage();
    if (reportPayload.phases.transcription.status === "fallback" || reportPayload.phases.assessment.status === "fallback") {
      setStatus("Mock Report 已生成，但其中一个阶段已降级为兜底结果。你仍可进入报告查看详情。");
    } else {
      setStatus("Mock Report 已生成，正在进入报告页面。");
    }
    router.push(`/mock/full/report/${session.id}`);
  }, [accessToken, allRecorded, persistPendingSubmission, recordings, refreshUsage, router, session, totalDurationSeconds, user]);

  useEffect(() => {
    if (!resumeMock || !resumeSessionId || restoredRef.current) return;
    restoredRef.current = true;
    const restore = async () => {
      setRestoring(true);
      try {
        const pending = await loadPendingMockSubmission(resumeSessionId);
        if (!pending) { setStatus("未找到待恢复的模考记录，你可以重新开始一次全真模考。"); return; }
        setSession(pending.session);
        setRecordings(pending.session.prompts.map((prompt) => {
          const restored = pending.recordings.find((item) => item.promptId === prompt.id);
          return { blob: restored?.blob ?? null, audioUrl: restored?.blob ? URL.createObjectURL(restored.blob) : null, durationSeconds: restored?.durationSeconds ?? 0 };
        }));
        setActiveIndex(Math.max(0, pending.recordings.length - 1));
        setRecorderState("ready");
        setStatus(pending.recordings.length === pending.session.prompts.length ? "整套录音已恢复，正在准备继续生成 Mock Report。" : "模考录音已恢复，请继续完成剩余题目。");
      } catch {
        setStatus("恢复模考记录失败，请重新开始一次全真模考。");
      } finally { setRestoring(false); }
    };
    void restore();
  }, [resumeMock, resumeSessionId]);

  useEffect(() => {
    if (!resumeMock || !resumeSessionId || !user || !accessToken || !allRecorded || restoring || recorderState === "submitting" || autoSubmittedRef.current) return;
    autoSubmittedRef.current = true;
    queueMicrotask(() => { void handleSubmit(); });
  }, [accessToken, allRecorded, handleSubmit, recorderState, restoring, resumeMock, resumeSessionId, user]);

  if (!hasMounted || !session) {
    return (
      <section className="grid gap-6 rounded-[28px] border border-black/8 bg-white px-4 py-5 shadow-[0_24px_80px_rgba(16,24,40,0.08)] sm:gap-8 sm:rounded-[36px] sm:px-6 sm:py-8 lg:px-10">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8d7557]">Full Mock Test</p>
          <h1 className="mt-6 text-3xl font-semibold tracking-[-0.06em] text-[#101828] sm:text-5xl lg:text-[4.8rem]">全真模考</h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-[#5b5349]">正在准备本次模考题目，请稍候。</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="grid gap-6 rounded-[28px] border border-black/8 bg-white px-4 py-5 shadow-[0_24px_80px_rgba(16,24,40,0.08)] sm:gap-8 sm:rounded-[36px] sm:px-6 sm:py-8 lg:px-10">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8d7557]">Full Mock Test</p>
          <h1 className="mt-6 text-3xl font-semibold tracking-[-0.06em] text-[#101828] sm:text-5xl lg:text-[4.8rem]">全真模考</h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-[#5b5349]">系统会按真实雅思口语流程依次推进 Part 1、Part 2 和 Part 3，完成整套录音后统一生成完整模考报告。</p>
        </div>

        {activeIndex < 0 ? <div className="grid gap-6 rounded-[24px] border border-black/8 bg-[#fffcf6] p-4 sm:rounded-[28px] sm:p-8">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-[24px] bg-white p-5"><p className="text-xs uppercase tracking-[0.24em] text-[#8d7557]">Part 1</p><p className="mt-3 text-lg font-semibold text-[#101828]">{session.part1RequiredTheme} + {session.part1GeneralTheme}</p><p className="mt-2 text-sm leading-7 text-[#5b5349]">共 {part1PromptCount} 题，每个话题随机抽取 4-5 题。</p></div>
            <div className="rounded-[24px] bg-white p-5"><p className="text-xs uppercase tracking-[0.24em] text-[#8d7557]">Part 2</p><p className="mt-3 text-lg font-semibold text-[#101828]">{session.part2Topic}</p><p className="mt-2 text-sm leading-7 text-[#5b5349]">含 1 分钟准备时间，准备结束后由考官提示开始回答。</p></div>
            <div className="rounded-[24px] bg-white p-5"><p className="text-xs uppercase tracking-[0.24em] text-[#8d7557]">Part 3</p><p className="mt-3 text-lg font-semibold text-[#101828]">{session.part3Topic}</p><p className="mt-2 text-sm leading-7 text-[#5b5349]">与 Part 2 主题顺承，统一完成深度讨论。</p></div>
          </div>
          {introStepIndex >= 0 ? <div className="mx-auto grid max-w-3xl gap-4 rounded-[24px] border border-[#8d7557]/18 bg-[#faf5eb] px-4 py-5 text-left sm:px-6 sm:py-6"><div><p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8d7557]">Introduction</p><p className="mt-3 text-sm leading-7 text-[#344054] sm:text-base sm:leading-8">{examinerLine}</p></div>{introRemaining !== null ? <div className="rounded-[18px] bg-white px-4 py-3"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8d7557]">Answer Time</p><p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#101828]">{formatDuration(introRemaining)}</p></div> : null}</div> : <div className="flex justify-center"><button type="button" onClick={startIntroduction} className="brand-button sm:min-w-[240px]">开始模考</button></div>}
        </div> : null}

        {currentPrompt ? <div className="grid gap-8">
          <div className="grid gap-5"><div className="flex flex-col gap-2 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left"><div className="text-sm text-[#6f675c]">当前进度 {activeIndex + 1} / {session.prompts.length}</div><div className="text-sm text-[#6f675c]">{currentPrompt.part}</div></div><div className="h-3 overflow-hidden rounded-full bg-[#efe9dc]"><div className="h-full rounded-full bg-[#101828] transition-all" style={{ width: `${progressPercent}%` }} /></div></div>
          <div className="grid gap-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8d7557]">{currentPrompt.topic}</p>
            <h2 className="mx-auto max-w-4xl text-2xl font-semibold tracking-[-0.05em] text-[#101828] sm:text-4xl">{currentPrompt.prompt}</h2>
            {examinerLine ? <div className="mx-auto max-w-3xl rounded-[24px] border border-[#8d7557]/18 bg-[#faf5eb] px-4 py-4 text-left sm:px-6"><p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8d7557]">Examiner Lead-in</p><p className="mt-3 text-sm leading-7 text-[#344054] sm:text-base sm:leading-8">{examinerLine}</p></div> : null}
            {currentPrompt.cuePoints.length ? <div className="mx-auto max-w-3xl rounded-[24px] border border-black/8 bg-[#fffdf8] p-4 text-left sm:rounded-[28px] sm:p-6"><p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8d7557]">You should say</p><div className="mt-4 grid gap-2 text-sm leading-7 text-[#344054] sm:text-base sm:leading-8">{currentPrompt.cuePoints.map((point) => <p key={point}>- {point}</p>)}</div></div> : null}
            {prepRemaining !== null && isPart2Prompt(currentPrompt) ? <div className="mx-auto max-w-xl rounded-[24px] border border-[#8d7557]/18 bg-[#fff7ea] px-4 py-5 sm:px-6"><p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8d7557]">Preparation Time</p><p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#101828]">{formatDuration(prepRemaining)}</p><p className="mt-3 text-sm leading-7 text-[#5b5349]">倒计时结束后，考官会提示你开始回答。你可以在这段时间内整理 Part 2 的思路。</p></div> : null}
          </div>
          <div className="grid gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
            <button type="button" onClick={() => openPrompt(activeIndex)} disabled={["playing", "preparing", "recording", "processing", "submitting"].includes(recorderState)} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-black/8 bg-white px-6 text-base font-medium text-[#101828] transition hover:border-black/12 hover:bg-[#f6f0e5] disabled:cursor-not-allowed disabled:text-[#98a2b3] sm:px-8"><Volume2 className="h-5 w-5" />Play Question</button>
            {recorderState === "recording" ? <button type="button" onClick={stopRecording} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#101828] px-6 text-base font-medium text-white transition hover:bg-[#1b2333] sm:px-8"><PauseCircle className="h-5 w-5" />Stop Recording</button> : recorderState === "processing" ? <button type="button" disabled className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#98a2b3] px-6 text-base font-medium text-white sm:px-8"><LoaderCircle className="h-5 w-5 animate-spin" />Saving Recording</button> : <button type="button" onClick={() => void startRecording()} disabled={["playing", "preparing", "submitting"].includes(recorderState)} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#101828] px-6 text-base font-medium text-white transition hover:bg-[#1b2333] disabled:cursor-not-allowed disabled:bg-[#98a2b3] sm:px-8"><Mic className="h-5 w-5" />Start Recording</button>}
            <button type="button" onClick={() => openPrompt(activeIndex)} disabled={["playing", "preparing", "recording", "processing", "submitting"].includes(recorderState)} className="inline-flex min-h-14 items-center justify-center rounded-full border border-black/8 bg-white px-6 text-base font-medium text-[#101828] transition hover:border-black/12 hover:bg-[#f6f0e5] disabled:cursor-not-allowed disabled:text-[#98a2b3] sm:px-8">Re-Answer</button>
            <button type="button" onClick={() => activeIndex < session.prompts.length - 1 ? openPrompt(activeIndex + 1) : setStatus("整套录音已完成，现在可以生成 Mock Report。") } disabled={["playing", "preparing", "recording", "processing", "submitting"].includes(recorderState) || !recordings[activeIndex]?.blob} className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#101828] px-6 text-base font-medium text-white transition hover:bg-[#1b2333] disabled:cursor-not-allowed disabled:bg-[#98a2b3] sm:px-8">{activeIndex >= session.prompts.length - 1 ? "Finish Recording" : "Next Question"}</button>
          </div>
          <div className="grid gap-2 text-center text-sm leading-6 text-[#6f675c]">
            <p>{status}</p>
            {recorderState === "submitting" || submissionDetails.length ? (
              <div className="mx-auto grid w-full max-w-xl gap-3 rounded-[24px] border border-[#d9d6cf] bg-[#fffcf6] px-4 py-4 text-left sm:px-5">
                <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.22em] text-[#8d7557]">
                  <span>{submissionStageLabel}</span>
                  <span>{submissionProgress}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-[#efe9dc]">
                  <div className="h-full rounded-full bg-[#101828] transition-all duration-700" style={{ width: `${submissionProgress}%` }} />
                </div>
                <div className="flex items-center justify-between gap-3 text-xs text-[#6f675c]">
                  <span>默认生成时间 3 分钟</span>
                  <span>{submissionEtaLabel}</span>
                </div>
                {submissionDetails.length ? (
                  <div className="grid gap-2">
                    {submissionDetails.map((item) => (
                      <div key={item.label} className="rounded-[18px] border border-black/6 bg-white px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-[#101828]">{item.label}</p>
                          <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${getPhaseTone(item.phase.status)}`}>
                            {item.phase.status === "success"
                              ? "成功"
                              : item.phase.status === "fallback"
                                ? "已降级"
                                : item.phase.status === "failed"
                                  ? "失败"
                                  : "处理中"}
                          </span>
                        </div>
                        <p className="mt-2 text-xs leading-6 text-[#5b5349]">{item.phase.message}</p>
                        {item.phase.reason ? <p className="mt-2 text-xs leading-6 text-[#b42318]">原因：{item.phase.reason}</p> : null}
                      </div>
                    ))}
                  </div>
                ) : null}
                {submissionWarnings.length ? (
                  <div className="grid gap-2">
                    {submissionWarnings.map((warning, index) => (
                      <p key={`${warning}-${index}`} className="rounded-[18px] bg-[#fff4e8] px-4 py-3 text-xs leading-6 text-[#b54708]">
                        {warning}
                      </p>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
            <p>{usageLine}</p>
            {recorderState === "recording" ? <p>当前录音时长：{formatDuration(recordingElapsed)}</p> : null}
            <p>已完成 {completedCount} / {session.prompts.length} 题，总录音时长 {formatDuration(Math.round(totalDurationSeconds))}</p>
          </div>
          {recordings[activeIndex]?.audioUrl ? <div className="grid gap-2"><p className="text-sm font-medium text-[#6f675c]">Saved Recording: {formatDuration(Math.round(recordings[activeIndex]?.durationSeconds ?? 0))}</p><audio controls src={recordings[activeIndex]?.audioUrl ?? undefined} className="w-full rounded-2xl border border-black/8 bg-[#faf7f1] p-2" /></div> : null}
          {allRecorded ? <div className="grid justify-center gap-2 text-center"><button type="button" onClick={() => void handleSubmit()} disabled={recorderState === "submitting" || restoring} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-black/8 bg-white px-6 text-base font-medium text-[#101828] transition hover:border-black/12 hover:bg-[#f6f0e5] disabled:cursor-not-allowed disabled:text-[#98a2b3] sm:px-8">{recorderState === "submitting" || restoring ? <><LoaderCircle className="h-5 w-5 animate-spin" />{submissionStageLabel}</> : <><Play className="h-5 w-5" />Generate Mock Report</>}</button><p className="text-xs text-[#8d7557]">预计生成时间约 3 分钟</p></div> : null}
        </div> : null}
      </section>
      {showUpgradePrompt ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101828]/35 px-4"><div className="w-full max-w-lg rounded-[24px] bg-white p-5 shadow-[0_24px_80px_rgba(16,24,40,0.18)] sm:rounded-[28px] sm:p-7"><h3 className="text-2xl font-semibold text-[#101828]">当前次数不足</h3><p className="mt-3 text-sm leading-7 text-[#475467]">Free 用户可以体验全真模考答题流程，但生成正式报告前需要先升级为 Pro 或 Ultra 方案。</p><div className="mt-6 grid gap-3 sm:flex"><button type="button" onClick={() => setShowUpgradePrompt(false)} className="inline-flex flex-1 items-center justify-center rounded-full border border-black/8 bg-white px-4 py-3 text-sm text-[#101828] transition hover:border-black/15 hover:bg-[#f7f1e7]">关闭</button><Link href="/me/pricing" className="inline-flex flex-1 items-center justify-center rounded-full bg-[#101828] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#1b2333]">查看 AI口语定价</Link></div></div></div> : null}
    </>
  );
}
