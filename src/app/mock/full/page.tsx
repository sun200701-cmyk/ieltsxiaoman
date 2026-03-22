import Link from "next/link";
import { Suspense } from "react";
import { ChevronLeft } from "lucide-react";

import { FullMockTest } from "@/components/full-mock-test";

export default function FullMockTestPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1480px] flex-col gap-6 px-6 py-6 lg:px-10">
      <Link
        href="/speaking-practice"
        className="inline-flex w-fit items-center gap-2 rounded-full border border-black/8 bg-[#fffdf8] px-4 py-2 text-sm text-[#6f675c] transition hover:border-black/12 hover:text-[#101828]"
      >
        <ChevronLeft className="h-4 w-4" />
        返回选择模考方式
      </Link>

      <Suspense
        fallback={
          <section className="flex min-h-[60vh] items-center justify-center rounded-[36px] border border-black/8 bg-white text-sm text-[#667085]">
            模考页面加载中...
          </section>
        }
      >
        <FullMockTest />
      </Suspense>
    </main>
  );
}
