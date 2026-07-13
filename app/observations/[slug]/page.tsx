import { notFound } from "next/navigation";
import { BookOpen, FileText } from "lucide-react";
import { getObservation, getSourcesByIds, getTopicsBySlugs, observations } from "@/lib/data";
import { RelatedLinks } from "@/components/shared/related-links";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ObservationTrainer } from "@/components/observation/observation-trainer";
import { OBSERVATION_CATEGORY_LABELS } from "@/lib/types";

export function generateStaticParams() {
  return observations.map((observation) => ({ slug: observation.slug }));
}

export default async function ObservationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const observation = getObservation(slug);
  if (!observation) notFound();

  const relatedTopics = getTopicsBySlugs(observation.topicSlugs);
  const relatedSources = getSourcesByIds(observation.sourceIds);
  const relatedItems = [
    ...relatedTopics.map((topic) => ({ href: `/modules/${topic.slug}`, label: topic.title, icon: BookOpen })),
    ...relatedSources.map((source) => ({ href: `/sources#${source.id}`, label: source.title, icon: FileText }))
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex flex-wrap gap-2">
          {observation.category && <Badge>{OBSERVATION_CATEGORY_LABELS[observation.category]}</Badge>}
          {observation.difficulty && <Badge tone="neutral">{observation.difficulty}</Badge>}
          <Badge tone="neutral">{observation.ageRange}</Badge>
        </div>
        <h1 className="mt-3 text-2xl font-semibold tracking-[-0.03em] md:text-3xl">{observation.title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-c">
          Прочитайте ситуацию один раз и сначала запишите собственное наблюдение. Готовый разбор откроется только после ответа.
        </p>
      </div>

      <Card className="border-accent-blue/25 bg-[rgb(var(--accent)/0.045)]">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-c">Ситуация</p>
        <p className="mt-3 text-base leading-7">{observation.context}</p>
        {observation.focusAreas && observation.focusAreas.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {observation.focusAreas.map((area) => <Badge key={area} tone="neutral">{area}</Badge>)}
          </div>
        )}
      </Card>

      <ObservationTrainer observation={observation} />

      {relatedItems.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-medium">Связанные материалы</h2>
          <RelatedLinks items={relatedItems} />
        </div>
      )}

      <p className="border-t border-c pt-4 text-xs leading-5 text-muted-c">
        Тренажёр предназначен для обучения наблюдению и формулированию рабочих гипотез. Он не заменяет очное обследование и не используется для самостоятельной постановки диагноза.
      </p>
    </div>
  );
}
