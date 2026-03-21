"use client";

import { Suspense } from "react";

import { AuthPanel } from "@/components/auth-panel";
import { MembershipPanel } from "@/components/membership-panel";
import { useAuth } from "@/components/auth-provider";

function MePageContent() {
  const { user } = useAuth();

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
        <AuthPanel />
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col px-6 py-10 lg:px-10">
      <div className="border-b border-black/8 pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8d7557]">My Space</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#101828]">我的</h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-[#5b5349]">查看当前账号、会员状态和剩余可用次数。</p>
      </div>

      <div className="mt-10 grid gap-10">
        <section className="grid gap-4 border-b border-black/8 pb-10">
          <AuthPanel />
        </section>

        <MembershipPanel />
      </div>
    </main>
  );
}

export default function MePage() {
  return (
    <Suspense fallback={<main className="flex min-h-screen items-center justify-center text-sm text-[#667085]">加载中...</main>}>
      <MePageContent />
    </Suspense>
  );
}
