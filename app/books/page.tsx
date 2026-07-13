import { books } from "@/lib/data";
import { BooksCatalog } from "@/components/book/books-catalog";
import { Card } from "@/components/ui/card";

export default function BooksPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-c">Библиотека</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-[-0.03em] md:text-3xl">Изучение книг</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-c">
          Не просто список литературы: маршрут чтения, вопросы после блоков, заметки, мини-тест и фиксация прогресса.
        </p>
      </div>

      <Card className="grid gap-4 md:grid-cols-3">
        <div><p className="text-sm font-semibold">Читайте с задачей</p><p className="mt-1 text-xs leading-5 text-muted-c">Перед каждым блоком указано, что именно нужно понять и выписать.</p></div>
        <div><p className="text-sm font-semibold">Проверяйте понимание</p><p className="mt-1 text-xs leading-5 text-muted-c">Вопросы и мини-тест помогают отличить узнавание текста от реального усвоения.</p></div>
        <div><p className="text-sm font-semibold">Сверяйте с современностью</p><p className="mt-1 text-xs leading-5 text-muted-c">Классические положения помечаются как исторические и дополняются современными источниками.</p></div>
      </Card>

      <BooksCatalog books={books} />
    </div>
  );
}
