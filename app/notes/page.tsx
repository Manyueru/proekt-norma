import { Suspense } from "react";
import { BackupManager } from "@/components/notes/backup-manager";
import { NotesManager } from "@/components/notes/notes-manager";

export default function NotesPage() {
  return (
    <div className="flex flex-col gap-8">
      <div><h1 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">Конспекты</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-c">Создавайте, редактируйте и связывайте записи с темами и источниками.</p></div>
      <BackupManager />
      <Suspense fallback={<p className="text-sm text-muted-c">Загрузка конспектов…</p>}><NotesManager /></Suspense>
    </div>
  );
}
