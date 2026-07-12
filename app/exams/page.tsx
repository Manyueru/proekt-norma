import { ExamsManager } from "@/components/exam/exams-manager";

export default function ExamsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">Подготовка к экзаменам</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-c">Вопросы, пробные билеты, слабые темы и план повторения.</p>
      </div>
      <ExamsManager />
    </div>
  );
}
