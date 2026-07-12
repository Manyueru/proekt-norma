import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileText,
  ShieldCheck,
  Video
} from "lucide-react";
import { getSourcesByIds, getTopic, getCasesBySlugs, topics } from "@/lib/data";
import { TRACK_LABELS } from "@/lib/types";
import { TopicSection } from "@/components/topic/topic-section";
import { TopicProgressControls } from "@/components/topic/topic-progress-controls";
import { ContentStatusBadge } from "@/components/topic/content-status-badge";
import { MiniTest } from "@/components/topic/mini-test";
import { RelatedLinks } from "@/components/shared/related-links";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function generateStaticParams() {
  return topics.map((topic) => ({ slug: topic.slug }));
}

function TextBlock({ text }: { text: string }) {
  return <div className="whitespace-pre-line">{text}</div>;
}

function ListBlock({ items }: { items: string[] }) {
  return (
    <ul className="flex list-disc flex-col gap-1.5 pl-5">
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();

  const relatedSources = getSourcesByIds(topic.sourceIds);
  const relatedCases = getCasesBySlugs(topic.caseSlugs);
  const isOutline = topic.contentStatus === "outline";

  const relatedItems = [
    ...topic.videoIds.map((id) => ({
      href: `/videos#${id}`,
      label: "Видео по теме",
      icon: Video
    })),
    ...relatedCases.map((item) => ({
      href: `/cases/${item.slug}`,
      label: `Клиническая задача: ${item.title}`,
      icon: ClipboardList
    })),
    ...relatedSources.map((source) => ({
      href: `/sources#${source.id}`,
      label: source.title,
      icon: FileText
    }))
  ];

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/modules"
        className="inline-flex w-fit items-center gap-1.5 text-xs text-muted-c hover:text-accent-blue"
      >
        <ArrowLeft size={14} /> К списку модулей
      </Link>

      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-c">Модуль {topic.moduleId}</span>
          <Badge className="whitespace-normal">{topic.moduleTitle}</Badge>
          <ContentStatusBadge status={topic.contentStatus} />
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
              {topic.title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-c">{topic.summary}</p>
          </div>
          {!isOutline ? <TopicProgressControls slug={topic.slug} /> : null}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-c">
          <span>{TRACK_LABELS[topic.track]}</span>
          <span>·</span>
          <span>{topic.depth}</span>
          {topic.estimatedMinutes ? (
            <>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock3 size={13} /> {topic.estimatedMinutes} мин
              </span>
            </>
          ) : null}
          <span>·</span>
          <span>Обновлено {topic.updatedAt}</span>
        </div>
      </div>

      <section className="rounded-card border border-c bg-surface p-5">
        <div className="flex items-start gap-3">
          {isOutline ? (
            <FileText className="mt-0.5 shrink-0 text-muted-c" size={18} />
          ) : (
            <ShieldCheck className="mt-0.5 shrink-0 text-emerald-700 dark:text-emerald-300" size={18} />
          )}
          <div>
            <h2 className="text-sm font-medium">
              {isOutline ? "Статус содержания" : "Проверка содержания"}
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-c">{topic.verificationNote}</p>
            {topic.verifiedAt ? (
              <p className="mt-2 text-xs text-muted-c">Дата проверки: {topic.verifiedAt}</p>
            ) : null}
          </div>
        </div>
      </section>

      {isOutline ? (
        <>
          <TopicSection title="Что появится в этой теме">
            <ListBlock items={topic.plannedSections} />
          </TopicSection>

          <TopicSection title="Место в учебной траектории" tone="muted">
            <p>{topic.trajectory}</p>
            <p className="mt-2">Очередь подготовки: {topic.preparationPhase}</p>
          </TopicSection>

          <div className="rounded-card border border-dashed border-c p-6 text-center">
            <p className="text-sm font-medium">Учебный текст ещё не опубликован</p>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-c">
              Каркас уже участвует в навигации, поиске и будущем прогрессе, но не содержит
              выдуманных определений, тестов или рекомендаций.
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-c">
              Тема доступна для изучения и сохранения прогресса.
            </p>
            <Link href={`/notes?new=study&topic=${topic.slug}`} className="shrink-0">
              <Button>Создать конспект по теме</Button>
            </Link>
          </div>

          {topic.goals.length > 0 ? (
            <TopicSection title="Результаты обучения">
              <ListBlock items={topic.goals} />
            </TopicSection>
          ) : null}

          {topic.simpleExplanation ? (
            <TopicSection title="Простое объяснение">
              <TextBlock text={topic.simpleExplanation} />
            </TopicSection>
          ) : null}

          {topic.keyConcepts.length > 0 ? (
            <TopicSection title="Ключевые понятия">
              <div className="flex flex-wrap gap-2">
                {topic.keyConcepts.map((concept) => <Badge key={concept}>{concept}</Badge>)}
              </div>
            </TopicSection>
          ) : null}

          {topic.theory ? (
            <TopicSection title="Научная основа">
              <TextBlock text={topic.theory} />
            </TopicSection>
          ) : null}

          {topic.norm ? (
            <TopicSection title="Норма и вариативность">
              <TextBlock text={topic.norm} />
            </TopicSection>
          ) : null}

          {topic.redFlags ? (
            <TopicSection title="Что должно насторожить" tone="warning">
              <TextBlock text={topic.redFlags} />
            </TopicSection>
          ) : null}

          {topic.practicalSigns ? (
            <TopicSection title="Практические проявления">
              <TextBlock text={topic.practicalSigns} />
            </TopicSection>
          ) : null}

          {topic.assessment ? (
            <TopicSection title="Обследование и профессиональные действия">
              <TextBlock text={topic.assessment} />
            </TopicSection>
          ) : null}

          {topic.differentialQuestions.length > 0 ? (
            <TopicSection title="Дифференциальные вопросы">
              <ListBlock items={topic.differentialQuestions} />
            </TopicSection>
          ) : null}

          {topic.intervention ? (
            <TopicSection title="Коррекционная работа и следующий шаг">
              <TextBlock text={topic.intervention} />
            </TopicSection>
          ) : null}

          {topic.caseExample ? (
            <TopicSection title="Практический пример">
              <TextBlock text={topic.caseExample} />
            </TopicSection>
          ) : null}

          {topic.summaryPoints?.length ? (
            <TopicSection title="Краткий конспект">
              <ListBlock items={topic.summaryPoints} />
            </TopicSection>
          ) : null}

          {topic.commonMistakes?.length ? (
            <TopicSection title="Что часто объясняют неправильно" tone="warning">
              <ListBlock items={topic.commonMistakes} />
            </TopicSection>
          ) : null}

          {topic.limitations ? (
            <TopicSection title="Ограничения интерпретации" tone="muted">
              <TextBlock text={topic.limitations} />
            </TopicSection>
          ) : null}

          {topic.selfCheckQuestions?.length ? (
            <TopicSection title="Вопросы для самопроверки">
              <ListBlock items={topic.selfCheckQuestions} />
            </TopicSection>
          ) : null}

          {relatedItems.length > 0 ? (
            <div>
              <h2 className="mb-3 text-sm font-medium">Связанные материалы и источники</h2>
              <RelatedLinks items={relatedItems} />
            </div>
          ) : null}

          {topic.miniTest.length > 0 ? (
            <div className="border-t border-c pt-6">
              <div className="mb-4 flex items-center gap-2">
                <CheckCircle2 size={17} />
                <h2 className="text-sm font-medium">Мини-тест</h2>
              </div>
              <MiniTest topicSlug={topic.slug} questions={topic.miniTest} />
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
