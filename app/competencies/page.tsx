import { CompetencyMap } from "@/components/competency/competency-map";
import { modules, topics } from "@/lib/data";

export default function CompetenciesPage() {
  return (
    <div className="flex flex-col gap-7">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-c">Контроль пробелов</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] md:text-3xl">Карта компетенций логопеда</h1>
        <p className="mt-3 text-sm leading-6 text-muted-c">
          Эта карта нужна, чтобы важная область не исчезла только потому, что вы пока не знаете о её существовании. Она отдельно показывает готовность материалов платформы и ваш личный прогресс.
        </p>
      </div>
      <CompetencyMap topics={topics} modules={modules} />
    </div>
  );
}
