import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { PracticeStudio } from "@/components/practice-studio";
import { getRegularEnglishQuestionBySlug } from "@/lib/regular-english-questions";

type RegularEnglishPracticePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function RegularEnglishPracticePage({ params }: RegularEnglishPracticePageProps) {
  const { slug } = await params;
  const question = getRegularEnglishQuestionBySlug(slug);

  if (!question) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1480px] flex-col gap-6 px-6 py-6 lg:px-10">
      <Link
        href={`/regular-english/${question.categorySlug}`}
        className="inline-flex w-fit items-center gap-2 rounded-full border border-black/8 bg-[#fffdf8] px-4 py-2 text-sm text-[#6f675c] transition hover:border-black/12 hover:text-[#101828]"
      >
        <ChevronLeft className="h-4 w-4" />
        返回分类
      </Link>

      <PracticeStudio
        question={question}
        assessmentApiPath="/api/regular-english/assessment"
        usageScope="regular-english"
        nextQuestionHref={`/regular-english/random/${question.categorySlug}?exclude=${question.slug}`}
        nextButtonLabel="再抽一题"
        exhaustedTitle="本月口语素养次数已用完"
        exhaustedDescription="口语素养模块每个自然月可免费分析 10 次，本月额度用完后会在下个月自动重置。"
        exhaustedActionHref={`/regular-english/${question.categorySlug}`}
        exhaustedActionLabel="返回当前分类"
      />
    </main>
  );
}
