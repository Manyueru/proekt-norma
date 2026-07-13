import { notFound } from "next/navigation";
import { AlertTriangle, FileText } from "lucide-react";
import { books, getBook, getSourcesByIds } from "@/lib/data";
import { BookStudyWorkspace } from "@/components/book/book-study-workspace";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { RelatedLinks } from "@/components/shared/related-links";

export function generateStaticParams() {
  return books.map((book) => ({ id: book.id }));
}

export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = getBook(id);
  if (!book) notFound();

  const source = book.sourceId ? getSourcesByIds([book.sourceId])[0] : undefined;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex flex-wrap gap-2">
          <Badge>{book.category}</Badge>
          {book.edition && <Badge tone="neutral">{book.edition}</Badge>}
        </div>
        <h1 className="mt-3 text-2xl font-semibold tracking-[-0.03em] md:text-3xl">{book.title}</h1>
        <p className="mt-1 text-sm text-muted-c">{book.author}</p>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-c">{book.whyStudy}</p>
      </div>

      {book.cautions.length > 0 && (
        <Card className="border-amber-300/50 bg-amber-50/40 dark:bg-amber-950/10">
          <div className="flex items-start gap-3">
            <AlertTriangle size={19} className="mt-0.5 shrink-0 text-amber-700 dark:text-amber-300" />
            <div>
              <h2 className="text-sm font-semibold">Как читать критически</h2>
              <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-sm leading-6">
                {book.cautions.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>
        </Card>
      )}

      <BookStudyWorkspace book={book} />

      {source && (
        <div>
          <h2 className="mb-3 text-sm font-medium">Карточка источника</h2>
          <RelatedLinks items={[{ href: `/sources#${source.id}`, label: source.title, icon: FileText }]} />
        </div>
      )}
    </div>
  );
}
