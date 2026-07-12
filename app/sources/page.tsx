import { sources } from "@/lib/data";
import { SourceFilters } from "@/components/source/source-filters";

export default function SourcesPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">Источники</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-c">
          Каталог проверенных материалов с уровнями надёжности от A (официальные рекомендации) до D (материалы без доказательной базы)
        </p>
      </div>
      <SourceFilters sources={sources} />
    </div>
  );
}
