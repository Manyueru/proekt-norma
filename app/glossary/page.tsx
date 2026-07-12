import { glossary } from "@/lib/data";
import { GlossaryCatalog } from "@/components/glossary/glossary-catalog";

export default function GlossaryPage() {
  return (
    <div className="flex flex-col gap-8">
      <div><h1 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">Словарь</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-c">Термины с простым объяснением и международным эквивалентом.</p></div>
      <GlossaryCatalog terms={glossary} />
    </div>
  );
}
