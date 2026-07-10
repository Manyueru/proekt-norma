import { glossary } from "@/lib/data";
import { GlossaryCatalog } from "@/components/glossary/glossary-catalog";

export default function GlossaryPage() {
  return (
    <div className="flex flex-col gap-6">
      <div><h1 className="text-xl font-medium">Словарь</h1><p className="text-sm text-muted-c mt-1">Термины с простым объяснением и международным эквивалентом.</p></div>
      <GlossaryCatalog terms={glossary} />
    </div>
  );
}
