import { NextResponse } from "next/server";

import { getRandomRegularEnglishQuestion } from "@/lib/regular-english-questions";

type RegularEnglishRandomRouteProps = {
  params: Promise<{
    categorySlug: string;
  }>;
};

export async function GET(request: Request, { params }: RegularEnglishRandomRouteProps) {
  const { categorySlug } = await params;
  const { searchParams } = new URL(request.url);
  const exclude = searchParams.get("exclude") ?? undefined;
  const question = getRandomRegularEnglishQuestion(categorySlug, exclude);

  if (!question) {
    return NextResponse.redirect(new URL("/regular-english/library", request.url));
  }

  return NextResponse.redirect(new URL(`/regular-english/practice/${question.slug}`, request.url));
}
