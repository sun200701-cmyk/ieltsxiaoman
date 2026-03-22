"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

import { AuthCard } from "@/components/auth-card";

type AuthModalProps = {
  open: boolean;
  mode: "login" | "register";
  onClose: () => void;
};

export function AuthModal({ open, mode, onClose }: AuthModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101828]/40 px-4 py-8">
      <button type="button" className="absolute inset-0" aria-label="关闭弹窗" onClick={onClose} />
      <div className="relative z-10 w-full max-w-[560px]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/8 bg-white text-[#101828] shadow-[0_12px_28px_rgba(16,24,40,0.08)]"
          aria-label="关闭"
        >
          <X className="h-4 w-4" />
        </button>
        <AuthCard initialMode={mode} onSuccess={onClose} />
      </div>
    </div>
  );
}
