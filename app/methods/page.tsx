import { methods } from "@/lib/data";
import { MethodsCatalog } from "@/components/method/methods-catalog";
import { Card } from "@/components/ui/card";

export default function MethodsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-c">Практика и доказательность</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-[-0.03em] md:text-3xl">Атлас методик</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-c">
          Российские и зарубежные системы, программы, подходы и отдельные приёмы — с разграничением целей, показаний, ограничений и качества доказательной базы.
        </p>
      </div>

      <Card className="grid gap-4 md:grid-cols-3">
        <div><p className="text-sm font-semibold">Не каталог упражнений</p><p className="mt-1 text-xs leading-5 text-muted-c">Сначала профиль ребёнка и цель, затем выбор подхода.</p></div>
        <div><p className="text-sm font-semibold">Не рейтинг популярности</p><p className="mt-1 text-xs leading-5 text-muted-c">Традиционность и известность не заменяют данные об эффективности.</p></div>
        <div><p className="text-sm font-semibold">Не готовый рецепт</p><p className="mt-1 text-xs leading-5 text-muted-c">Методика адаптируется к языку, возрасту, контексту и динамике ребёнка.</p></div>
      </Card>

      <MethodsCatalog methods={methods} />
    </div>
  );
}
