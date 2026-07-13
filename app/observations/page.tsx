import { observations } from "@/lib/data";
import { ObservationsCatalog } from "@/components/observation/observations-catalog";
import { Card } from "@/components/ui/card";

export default function ObservationsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-c">Практика</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-[-0.03em] md:text-3xl">Тренажёр насмотренности</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-c">
          Учитесь отделять наблюдаемый факт от интерпретации, формулировать рабочие гипотезы, замечать недостающие данные и выбирать безопасный следующий шаг.
        </p>
      </div>

      <Card className="grid gap-4 md:grid-cols-3">
        <div>
          <p className="text-sm font-semibold">1. Наблюдайте</p>
          <p className="mt-1 text-xs leading-5 text-muted-c">Сначала фиксируйте факты без преждевременного диагноза.</p>
        </div>
        <div>
          <p className="text-sm font-semibold">2. Рассуждайте</p>
          <p className="mt-1 text-xs leading-5 text-muted-c">Определите вариативность, признаки риска и недостающие сведения.</p>
        </div>
        <div>
          <p className="text-sm font-semibold">3. Сверяйтесь</p>
          <p className="mt-1 text-xs leading-5 text-muted-c">Откройте разбор, сравните логику и запланируйте повторение.</p>
        </div>
      </Card>

      <ObservationsCatalog observations={observations} />
    </div>
  );
}
