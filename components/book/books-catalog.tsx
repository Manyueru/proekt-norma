"use client";

import Link from "next/link";
import { BookOpen, CheckCircle2, Clock3 } from "lucide-react";
import { usePersonalData } from "@/components/providers/personal-data-provider";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { StudyBook } from "@/lib/types";

const statusLabel = {
  ready: "Маршрут готов",
  outline: "Каркас маршрута",
  verification: "Проверяется"
} as const;

export function BooksCatalog({ books }: { books: StudyBook[] }) {
  const { bookProgress } = usePersonalData();

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {books.map((book) => {
        const progress = bookProgress[book.id];
        const completed = progress?.completedChapterIds.length ?? 0;
        const total = book.chapters.length;
        return (
          <Link key={book.id} href={`/books/${book.id}`}>
            <Card className="flex h-full flex-col gap-4 transition-colors hover:border-accent-blue/40">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-muted-c">{book.category}</p>
                  <h2 className="mt-1 text-lg font-semibold">{book.title}</h2>
                  <p className="mt-1 text-sm text-muted-c">{book.author}{book.edition ? ` · ${book.edition}` : ""}</p>
                </div>
                <Badge tone={book.contentStatus === "ready" ? "sage" : book.contentStatus === "outline" ? "blue" : "amber"}>
                  {statusLabel[book.contentStatus]}
                </Badge>
              </div>

              <p className="text-sm leading-6 text-muted-c">{book.description}</p>

              <div className="mt-auto flex items-center justify-between gap-3 border-t border-c pt-3 text-xs text-muted-c">
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen size={15} />
                  {total > 0 ? (book.contentStatus === "ready" ? `${completed} из ${total} блоков` : `Размечено блоков: ${total}`) : "Маршрут готовится"}
                </span>
                {book.contentStatus === "ready" && progress?.status === "completed" ? (
                  <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300"><CheckCircle2 size={15} />Пройдено</span>
                ) : progress ? (
                  <span className="inline-flex items-center gap-1.5"><Clock3 size={15} />В процессе</span>
                ) : null}
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
