import { MockReportOverview } from "@/components/mock-report-overview";

type PageProps = {
  params: Promise<{
    sessionId: string;
  }>;
};

export default async function MockReportPage({ params }: PageProps) {
  const { sessionId } = await params;
  return <MockReportOverview sessionId={sessionId} />;
}
