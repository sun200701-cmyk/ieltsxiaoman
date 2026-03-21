import Link from "next/link";

export function HomeExperience() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1480px] flex-col items-center justify-center px-6 py-10 lg:px-10">
      <section className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8d7557]">Speaking Practice</p>
        <h1 className="mt-6 text-4xl font-semibold tracking-[-0.06em] text-[#101828] sm:text-5xl lg:text-[4.8rem]">
          2026年1-4月雅思口语题库
        </h1>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/mock/full" className="brand-button min-w-[260px]">
            全真模考
          </Link>
          <Link
            href="/question-bank"
            className="inline-flex min-w-[260px] items-center justify-center rounded-full border border-black/8 bg-white px-8 py-4 text-base font-medium text-[#101828] transition hover:border-black/12 hover:bg-[#f6f0e5]"
          >
            题库模考
          </Link>
        </div>

        <div className="mt-5 grid gap-2 text-sm leading-7 text-[#6f675c]">
          <p>全真模考：完整模拟真实考试流程</p>
          <p>题库模考：按题库逐题或选题练习</p>
        </div>
      </section>
    </main>
  );
}
