import Link from "next/link";
import { cases } from "@/lib/data";
import { Card } from "@/components/ui/card";

export default function CasesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-medium">Клинические задачи</h1>
        <p className="text-sm text-muted-c mt-1">
          Учебные случаи для тренировки клинического мышления
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {cases.map((c) => (
          <Link key={c.slug} href={`/cases/${c.slug}`}>
            <Card className="flex flex-col gap-2 h-full hover:border-accent-blue/40 transition-colors">
              <h3 className="text-sm font-medium">{c.title}</h3>
              <p className="text-xs text-muted-c">{c.age}</p>
              <p className="text-sm text-muted-c leading-6 line-clamp-2">{c.reason}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
