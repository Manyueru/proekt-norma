import { Suspense } from "react";
import { BackupManager } from "@/components/notes/backup-manager";
import { NotesManager } from "@/components/notes/notes-manager";

export default function NotesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div><h1 className="text-xl font-medium">Конспекты</h1><p className="text-sm text-muted-c mt-1">Создавайте, редактируйте и связывайте записи с темами и источниками.</p></div>
      <BackupManager />
      <Suspense fallback={<p className="text-sm text-muted-c">Загрузка конспектов…</p>}><NotesManager /></Suspense>
    </div>
  );
}
