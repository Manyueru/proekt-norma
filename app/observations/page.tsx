import { observations } from "@/lib/data";
import { ObservationCard } from "@/components/observation/observation-card";

export default function ObservationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-medium">Клиническая насмотренность</h1>
        <p className="text-sm text-muted-c mt-1">
          Карточки наблюдаемых признаков. Ни одна карточка не является инструкцией для постановки диагноза.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {observations.map((o) => (
          <ObservationCard key={o.slug} observation={o} />
        ))}
      </div>
    </div>
  );
}
