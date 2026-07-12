import { modules, topics } from "@/lib/data";
import { ModulesCatalog } from "@/components/topic/modules-catalog";

export default function ModulesPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-c">
          Логопедия — основная траектория
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
          Учебные модули
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-c">
          В предпросмотре доступен полный каркас программы. Темы с отметкой
          «Проверено по источникам» уже можно открыть и пройти; остальные показывают
          будущую структуру без неподтверждённого учебного текста.
        </p>
      </div>
      <ModulesCatalog topics={topics} modules={modules} />
    </div>
  );
}
