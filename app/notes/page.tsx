import { BackupManager } from "@/components/notes/backup-manager";
import { NotesManager } from "@/components/notes/notes-manager";

export default function NotesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-medium">Конспекты</h1>
        <p className="text-sm text-muted-c mt-1">
          Личные записи и повторение. Не забывайте делать резервную копию.
        </p>
      </div>
      <BackupManager />
      <NotesManager />
    </div>
  );
}
