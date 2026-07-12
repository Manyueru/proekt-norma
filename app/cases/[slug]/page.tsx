import { notFound } from "next/navigation";
import { BookOpen, FileText } from "lucide-react";
import { cases, getCase, getSourcesByIds, getTopicsBySlugs } from "@/lib/data";
import { CaseView } from "@/components/case/case-view";
import { RelatedLinks } from "@/components/shared/related-links";

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const clinicalCase = getCase(slug);
  if (!clinicalCase) notFound();

  const relatedTopics = getTopicsBySlugs(clinicalCase.topicSlugs);
  const relatedSources = getSourcesByIds(clinicalCase.sourceIds);
  const relatedItems = [
    ...relatedTopics.map((t) => ({ href: `/modules/${t.slug}`, label: t.title, icon: BookOpen })),
    ...relatedSources.map((s) => ({ href: `/sources#${s.id}`, label: s.title, icon: FileText }))
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">{clinicalCase.title}</h1>
        <p className="text-xs text-muted-c mt-1">Возраст: {clinicalCase.age}</p>
      </div>

      <CaseView clinicalCase={clinicalCase} />

      {relatedItems.length > 0 && (
        <div>
          <h2 className="text-sm font-medium mb-3">Связанные материалы</h2>
          <RelatedLinks items={relatedItems} />
        </div>
      )}
    </div>
  );
}
