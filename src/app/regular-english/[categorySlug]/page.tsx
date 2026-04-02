import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Shuffle } from "lucide-react";

import {
  getRegularEnglishCategoryBySlug,
  getRegularEnglishQuestionsByCategorySlug,
} from "@/lib/regular-english-questions";

type RegularEnglishCategoryPageProps = {
  params: Promise<{
    categorySlug: string;
  }>;
};

export default async function RegularEnglishCategoryPage({ params }: RegularEnglishCategoryPageProps) {
  const { categorySlug } = await params;
  const category = getRegularEnglishCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const questions = getRegularEnglishQuestionsByCategorySlug(categorySlug);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1480px] flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <section className="mx-auto flex w-full max-w-[1380px] flex-col">
        <Link
          href="/regular-english/library"
          className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-black/8 bg-[#fffdf8] px-4 py-2 text-sm text-[#6f675c] transition hover:border-black/12 hover:text-[#101828] sm:mb-8"
        >
          <ChevronLeft className="h-4 w-4" />
          返回题库
        </Link>

        <div className="rounded-[32px] border border-black/8 bg-white px-5 py-6 shadow-[0_24px_80px_rgba(16,24,40,0.08)] sm:px-8 sm:py-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8d7557]">Category Focus</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-[#101828] sm:text-5xl">
            {category.title}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#5b5349] sm:text-base sm:leading-8">
            这个分类共 {category.questionCount} 道题。点击下方按钮会在当前分类中随机抽取一道题，直接进入录音与 AI 分析。
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`/regular-english/random/${category.slug}`} className="brand-button sm:min-w-[220px]">
              <Shuffle className="mr-2 h-4 w-4" />
              随机抽一题
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10 sm:mt-12">
        <div className="grid gap-0 border-t border-black/8">
          {questions.map((question) => (
            <div
              key={question.id}
              className="grid items-center gap-3 border-b border-black/8 py-5 sm:py-6 md:grid-cols-[120px_1fr_180px]"
            >
              <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-[#9f968b]">
                <span>Q{question.sortOrder}</span>
                <span className="text-xs text-[#b4aca1] md:hidden">{question.timeLimitLabel}</span>
              </div>
              <div className="flex items-center min-h-[72px]">
                <h3 className="text-lg font-medium tracking-[-0.03em] text-[#101828] sm:text-xl">{question.prompt}</h3>
              </div>
              <div className="flex items-center gap-3 md:justify-end">
                <div className="hidden whitespace-nowrap text-sm text-[#9f968b] md:block">{question.timeLimitLabel}</div>
                <Link href={`/regular-english/practice/${question.slug}`} className="ghost-button w-full md:w-auto">
                  开始练
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
