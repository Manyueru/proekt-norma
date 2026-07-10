import { observations } from "@/lib/data";
import { ObservationsCatalog } from "@/components/observation/observations-catalog";

export default function ObservationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div><h1 className="text-xl font-medium">Клиническая насмотренность</h1><p className="text-sm text-muted-c mt-1">Наблюдаемые признаки, возможные объяснения и вопросы для дальнейшей оценки. Ни одна карточка не ставит диагноз.</p></div>
      <ObservationsCatalog observations={observations} />
    </div>
  );
}
