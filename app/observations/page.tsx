import { observations } from "@/lib/data";
import { ObservationsCatalog } from "@/components/observation/observations-catalog";

export default function ObservationsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div><h1 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">Клиническая насмотренность</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-c">Наблюдаемые признаки, возможные объяснения и вопросы для дальнейшей оценки. Ни одна карточка не ставит диагноз.</p></div>
      <ObservationsCatalog observations={observations} />
    </div>
  );
}
