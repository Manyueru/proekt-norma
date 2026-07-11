import { ExamWorkspace } from "@/components/exam/exam-workspace";

export default async function ExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ExamWorkspace examId={id} />;
}
