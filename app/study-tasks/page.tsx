import { StudyTasksManager } from "@/components/study-task/study-tasks-manager";

export default function StudyTasksPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">Учебные задачи</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-c">Дедлайны, рефераты, доклады и другие обязательные дела.</p>
      </div>
      <StudyTasksManager />
    </div>
  );
}
