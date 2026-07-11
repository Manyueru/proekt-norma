import { ExamsManager } from "@/components/exam/exams-manager";

export default function ExamsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-medium">Подготовка к экзаменам</h1>
        <p className="mt-1 text-sm text-muted-c">Вопросы, пробные билеты, слабые темы и план повторения.</p>
      </div>
      <ExamsManager />
    </div>
  );
}
