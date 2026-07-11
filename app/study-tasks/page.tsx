import { StudyTasksManager } from "@/components/study-task/study-tasks-manager";

export default function StudyTasksPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-medium">Учебные задачи</h1>
        <p className="mt-1 text-sm text-muted-c">Дедлайны, рефераты, доклады и другие обязательные дела.</p>
      </div>
      <StudyTasksManager />
    </div>
  );
}
