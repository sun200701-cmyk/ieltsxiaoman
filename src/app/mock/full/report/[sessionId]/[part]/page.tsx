import { MockReportPartPage } from "@/components/mock-report-part-page";

type PageProps = {
  params: Promise<{
    sessionId: string;
    part: string;
  }>;
};

export default async function MockReportPartRoute({ params }: PageProps) {
  const { sessionId, part } = await params;
  return <MockReportPartPage sessionId={sessionId} partSlug={part} />;
}
