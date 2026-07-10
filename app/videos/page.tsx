import { ExternalLink } from "lucide-react";
import { videos } from "@/lib/data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function VideosPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-medium">Видеотека</h1>
        <p className="text-sm text-muted-c mt-1">Видео с разбором и указанием, на что обращать внимание</p>
      </div>
      <div className="rounded-xl border border-c bg-surface p-4 text-sm text-muted-c">
        Демонстрационные карточки без проверенной ссылки помечены как заглушки. Они не являются источниками для диагностики.
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {videos.map((v) => (
          <Card key={v.id} id={v.id} className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">{v.title}</h3>
            <p className="text-xs text-muted-c">{v.source} · {v.durationMinutes} мин · {v.ageRange}</p>
            <p className="text-sm text-muted-c leading-6">{v.summary}</p>
            <div>
              <p className="text-xs text-muted-c mb-1">Что наблюдать</p>
              <p className="text-sm">{v.whatToObserve}</p>
            </div>
            <div className="flex gap-2 flex-wrap mt-1">
              <Badge>{v.language}</Badge>
              {v.subtitles && <Badge tone="sage">Субтитры</Badge>}
              {!v.url && <Badge tone="amber">Демонстрационный материал</Badge>}
            </div>
            {v.url ? (
              <a href={v.url} target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center gap-1 text-sm text-accent-blue hover:underline">
                Смотреть видео <ExternalLink size={14} />
              </a>
            ) : (
              <p className="text-xs text-muted-c">Ссылка пока не добавлена. Тайм-коды не показываются до проверки видео.</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
