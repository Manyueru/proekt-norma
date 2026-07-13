"use client";

import { ChangeEvent, useRef, useState } from "react";
import { Download, RotateCcw, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePersonalData } from "@/components/providers/personal-data-provider";
import { downloadBackup, importBackup, resetLocalData } from "@/lib/storage";

export function BackupManager() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { storageMode } = usePersonalData();
  const [message, setMessage] = useState("");

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!window.confirm("Импорт заменит текущие конспекты, прогресс, экзамены, дедлайны, разборы насмотренности и прогресс по книгам. Продолжить?")) return;
    try {
      await importBackup(file);
      setMessage("Резервная копия восстановлена. Страница будет обновлена.");
      window.setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не удалось импортировать файл.");
    }
  }

  function handleReset() {
    if (!window.confirm("Удалить весь локальный прогресс, конспекты, экзамены, дедлайны, разборы насмотренности и прогресс по книгам? Это действие нельзя отменить без резервной копии.")) return;
    resetLocalData();
    setMessage("Локальные данные удалены. Страница будет обновлена.");
    window.setTimeout(() => window.location.reload(), 500);
  }

  return (
    <div className="rounded-xl border border-c bg-surface p-4">
      <h2 className="text-sm font-medium">Резервная копия</h2>
      <p className="mt-1 text-xs leading-5 text-muted-c">
        {storageMode === "cloud"
          ? "Данные аккаунта синхронизируются автоматически. Экспорт ниже предназначен для локального гостевого режима."
          : "Данные сохраняются только в этом браузере. Очистка данных браузера может удалить прогресс, конспекты, экзамены, дедлайны, разборы насмотренности и прогресс по книгам."}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" onClick={downloadBackup} disabled={storageMode === "cloud"}><Download size={15} />Экспортировать</Button>
        <Button size="sm" onClick={() => inputRef.current?.click()} disabled={storageMode === "cloud"}><Upload size={15} />Импортировать</Button>
        <Button size="sm" variant="ghost" onClick={handleReset} disabled={storageMode === "cloud"}><RotateCcw size={15} />Сбросить данные</Button>
        <input ref={inputRef} type="file" accept="application/json,.json" className="hidden" onChange={handleImport} />
      </div>
      {message && <p className="mt-2 text-xs text-muted-c" role="status">{message}</p>}
    </div>
  );
}
