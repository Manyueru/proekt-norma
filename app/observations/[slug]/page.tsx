import { notFound } from "next/navigation";
import { BookOpen, FileText } from "lucide-react";
import { getObservation, getSourcesByIds, getTopicsBySlugs, observations } from "@/lib/data";
import { TopicSection } from "@/components/topic/topic-section";
import { RelatedLinks } from "@/components/shared/related-links";
import { Badge } from "@/components/ui/badge";

export function generateStaticParams() {
  return observations.map((o) => ({ slug: o.slug }));
}

export default async function ObservationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const observation = getObservation(slug);
  if (!observation) notFound();

  const relatedTopics = getTopicsBySlugs(observation.topicSlugs);
  const relatedSources = getSourcesByIds(observation.sourceIds);

  const relatedItems = [
    ...relatedTopics.map((t) => ({ href: `/modules/${t.slug}`, label: t.title, icon: BookOpen })),
    ...relatedSources.map((s) => ({ href: `/sources#${s.id}`, label: s.title, icon: FileText }))
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-medium">{observation.title}</h1>
        <p className="text-xs text-muted-c mt-1">{observation.ageRange}</p>
      </div>

      <TopicSection title="Что наблюдается">{observation.context}</TopicSection>

      {observation.canBeNormalVariant && (
        <TopicSection title="Может ли быть вариантом нормы" tone="muted">
          Да, при однократном наблюдении в отрыве от контекста это может быть вариантом нормы.
        </TopicSection>
      )}

      <TopicSection title="Возможные объяснения">
        <ul className="list-disc pl-5 flex flex-col gap-1">
          {observation.possibleExplanations.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </TopicSection>

      <TopicSection title="Что проверить дополнительно">
        <ul className="list-disc pl-5 flex flex-col gap-1">
          {observation.whatToCheck.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </TopicSection>

      <TopicSection title="Тревожные признаки" tone="warning">
        <ul className="list-disc pl-5 flex flex-col gap-1">
          {observation.redFlags.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </TopicSection>

      <TopicSection title="Возможные специалисты">
        <div className="flex gap-2 flex-wrap">
          {observation.specialists.map((s) => (
            <Badge key={s}>{s}</Badge>
          ))}
        </div>
      </TopicSection>

      {relatedItems.length > 0 && (
        <div>
          <h2 className="text-sm font-medium mb-3">Связанные материалы</h2>
          <RelatedLinks items={relatedItems} />
        </div>
      )}

      <p className="text-xs text-muted-c border-t border-c pt-4">
        По одному признаку нельзя ставить диагноз. Карточка предназначена для развития наблюдательности, а не для самостоятельной диагностики.
      </p>
    </div>
  );
}
