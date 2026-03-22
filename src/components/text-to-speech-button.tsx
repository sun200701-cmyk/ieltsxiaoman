"use client";

import { useEffect, useState } from "react";
import { PauseCircle, Volume2 } from "lucide-react";

type TextToSpeechButtonProps = {
  text: string;
};

export function TextToSpeechButton({ text }: TextToSpeechButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeech = () => {
    const trimmed = text.trim();
    if (typeof window === "undefined" || !trimmed) return;

    const synth = window.speechSynthesis;
    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
      return;
    }

    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(trimmed);
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

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    synth.speak(utterance);
  };

  return (
    <button
      type="button"
      onClick={toggleSpeech}
      disabled={!text.trim()}
      className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-3 py-1.5 text-xs font-medium text-[#101828] transition hover:border-black/15 hover:bg-[#f7f1e7] disabled:cursor-not-allowed disabled:opacity-50"
      aria-pressed={isSpeaking}
      aria-label={isSpeaking ? "Stop reading" : "Read aloud"}
    >
      {isSpeaking ? <PauseCircle className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      <span>{isSpeaking ? "Stop" : "Read"}</span>
    </button>
  );
}
