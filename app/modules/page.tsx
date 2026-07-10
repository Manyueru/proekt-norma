import { topics } from "@/lib/data";
import { Track, TRACK_LABELS } from "@/lib/types";
import { TopicCard } from "@/components/topic/topic-card";

export default function ModulesPage() {
  const tracks = Object.keys(TRACK_LABELS) as Track[];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-medium">Учебные модули</h1>
        <p className="text-sm text-muted-c mt-1">
          Шесть направлений: от нормального развития ребёнка до клинических основ
        </p>
      </div>

      {tracks.map((track) => {
        const trackTopics = topics.filter((t) => t.track === track);
        if (trackTopics.length === 0) return null;
        return (
          <div key={track}>
            <h2 className="text-sm font-medium text-muted-c mb-3">{TRACK_LABELS[track]}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {trackTopics.map((topic) => (
                <TopicCard key={topic.slug} topic={topic} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
