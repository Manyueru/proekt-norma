import { topics } from "@/lib/data";
import { ModulesCatalog } from "@/components/topic/modules-catalog";

export default function ModulesPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">Учебные модули</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-c">Выберите направление, тему или статус обучения.</p>
      </div>
      <ModulesCatalog topics={topics} />
    </div>
  );
}
