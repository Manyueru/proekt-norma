import { sources } from "@/lib/data";
import { SourceFilters } from "@/components/source/source-filters";

export default function SourcesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-medium">Источники</h1>
        <p className="text-sm text-muted-c mt-1">
          Каталог проверенных материалов с уровнями надёжности от A (официальные рекомендации) до D (материалы без доказательной базы)
        </p>
      </div>
      <SourceFilters sources={sources} />
    </div>
  );
}
