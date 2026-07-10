"use client";

import { ChangeEvent, useRef, useState } from "react";
import { Download, RotateCcw, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadBackup, importBackup, resetLocalData } from "@/lib/storage";

export function BackupManager() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!window.confirm("Импорт заменит текущие конспекты и прогресс. Продолжить?")) return;
    try {
      await importBackup(file);
      setMessage("Резервная копия восстановлена.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не удалось импортировать файл.");
    }
  }

  function handleReset() {
    if (!window.confirm("Удалить весь локальный прогресс и конспекты? Это действие нельзя отменить без резервной копии.")) return;
    resetLocalData();
    setMessage("Локальные данные удалены.");
  }

  return (
    <div className="rounded-xl border border-c bg-surface p-4">
      <h2 className="text-sm font-medium">Резервная копия</h2>
      <p className="mt-1 text-xs leading-5 text-muted-c">
        Данные сохраняются только в этом браузере. Очистка данных браузера может удалить прогресс и конспекты.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" onClick={downloadBackup}><Download size={15} />Экспортировать</Button>
        <Button size="sm" onClick={() => inputRef.current?.click()}><Upload size={15} />Импортировать</Button>
        <Button size="sm" variant="ghost" onClick={handleReset}><RotateCcw size={15} />Сбросить данные</Button>
        <input ref={inputRef} type="file" accept="application/json,.json" className="hidden" onChange={handleImport} />
      </div>
      {message && <p className="mt-2 text-xs text-muted-c" role="status">{message}</p>}
    </div>
  );
}
