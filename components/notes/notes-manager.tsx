"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Note } from "@/lib/types";
import { getNotes, saveNote, deleteNote } from "@/lib/storage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { topics } from "@/lib/data";

const EMPTY_NOTE: Omit<Note, "id" | "date"> = {
  title: "",
  topicSlug: undefined,
  mainIdea: "",
  newFacts: "",
  unclear: "",
  toCheck: "",
  example: "",
  reviewQuestion: "",
  nextReviewDate: undefined
};

export function NotesManager() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState(EMPTY_NOTE);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const sync = () => setNotes(getNotes());
    sync();
    window.addEventListener("norma:notes-changed", sync);
    return () => window.removeEventListener("norma:notes-changed", sync);
  }, []);

  function handleSave() {
    if (!draft.title.trim()) return;
    saveNote({ ...draft, id: crypto.randomUUID(), date: new Date().toISOString().slice(0, 10) });
    setDraft(EMPTY_NOTE);
    setShowForm(false);
  }

  return (
    <div className="flex flex-col gap-5">
      {!showForm ? (
        <Button variant="primary" onClick={() => setShowForm(true)} className="w-fit">
          <Plus size={16} />
          Новый конспект
        </Button>
      ) : (
        <Card className="flex flex-col gap-3">
          <Input
            placeholder="Название конспекта"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          />
          <select
            className="h-9 rounded-lg border border-c bg-surface px-2 text-sm"
            value={draft.topicSlug ?? ""}
            onChange={(e) => setDraft({ ...draft, topicSlug: e.target.value || undefined })}
          >
            <option value="">Без привязки к теме</option>
            {topics.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.title}
              </option>
            ))}
          </select>
          <Textarea
            placeholder="Главная мысль"
            value={draft.mainIdea}
            onChange={(e) => setDraft({ ...draft, mainIdea: e.target.value })}
          />
          <Textarea
            placeholder="Новые факты"
            value={draft.newFacts}
            onChange={(e) => setDraft({ ...draft, newFacts: e.target.value })}
          />
          <Textarea
            placeholder="Что непонятно"
            value={draft.unclear}
            onChange={(e) => setDraft({ ...draft, unclear: e.target.value })}
          />
          <Textarea
            placeholder="Что проверить"
            value={draft.toCheck}
            onChange={(e) => setDraft({ ...draft, toCheck: e.target.value })}
          />
          <Textarea
            placeholder="Практический пример"
            value={draft.example}
            onChange={(e) => setDraft({ ...draft, example: e.target.value })}
          />
          <Input
            placeholder="Вопрос для повторения"
            value={draft.reviewQuestion}
            onChange={(e) => setDraft({ ...draft, reviewQuestion: e.target.value })}
          />
          <div className="flex gap-2">
            <Button variant="primary" onClick={handleSave}>
              Сохранить
            </Button>
            <Button variant="ghost" onClick={() => setShowForm(false)}>
              Отмена
            </Button>
          </div>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {notes.map((note) => (
          <Card key={note.id} className="flex flex-col gap-1.5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-medium">{note.title}</h3>
              <button
                onClick={() => { if (window.confirm("Удалить этот конспект?")) deleteNote(note.id); }}
                aria-label="Удалить конспект"
                className="text-muted-c hover:text-red-500"
              >
                <Trash2 size={15} />
              </button>
            </div>
            <p className="text-xs text-muted-c">{note.date}</p>
            {note.mainIdea && <p className="text-sm">{note.mainIdea}</p>}
          </Card>
        ))}
        {notes.length === 0 && (
          <p className="text-sm text-muted-c">Конспектов пока нет — добавьте первый.</p>
        )}
      </div>
    </div>
  );
}
