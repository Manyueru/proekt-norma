import { topics } from "@/lib/data";
import { ModulesCatalog } from "@/components/topic/modules-catalog";

export default function ModulesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-medium">Учебные модули</h1>
        <p className="text-sm text-muted-c mt-1">Выберите направление, тему или статус обучения.</p>
      </div>
      <ModulesCatalog topics={topics} />
    </div>
  );
}
