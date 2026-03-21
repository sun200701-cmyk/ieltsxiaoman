import { MockReportPromptPage } from "@/components/mock-report-prompt-page";

type PageProps = {
  params: Promise<{
    sessionId: string;
    part: string;
    promptId: string;
  }>;
};

export default async function MockReportPromptRoute({ params }: PageProps) {
  const { sessionId, part, promptId } = await params;
  return <MockReportPromptPage sessionId={sessionId} partSlug={part} promptId={promptId} />;
}
