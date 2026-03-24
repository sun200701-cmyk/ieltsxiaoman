import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { PracticeStudio } from "@/components/practice-studio";
import { getQuestionBySlug } from "@/lib/questions";

type PracticePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PracticePage({ params }: PracticePageProps) {
  const { slug } = await params;
  const question = getQuestionBySlug(slug);

  if (!question) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1480px] flex-col gap-6 px-6 py-6 lg:px-10">
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-2 rounded-full border border-black/8 bg-[#fffdf8] px-4 py-2 text-sm text-[#6f675c] transition hover:border-black/12 hover:text-[#101828]"
      >
        <ChevronLeft className="h-4 w-4" />
        返回题库
      </Link>
      <PracticeStudio question={question} />
    </main>
  );
}

