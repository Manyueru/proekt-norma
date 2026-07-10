"use client";

import {
  createLocalBackup,
  restoreLocalBackup,
  resetLocalData as reset,
  type LocalBackupV2
} from "./local-data";

export function downloadBackup() {
  const backup = createLocalBackup();
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `norma-backup-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function isBackup(value: unknown): value is LocalBackupV2 {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<LocalBackupV2>;
  return (
    candidate.version === 2 &&
    typeof candidate.exportedAt === "string" &&
    !!candidate.progress &&
    typeof candidate.progress === "object" &&
    Array.isArray(candidate.notes) &&
    !!candidate.caseAnswers &&
    typeof candidate.caseAnswers === "object" &&
    Array.isArray(candidate.testAttempts)
  );
}

export async function importBackup(file: File) {
  const parsed = JSON.parse(await file.text()) as unknown;
  if (!isBackup(parsed)) throw new Error("Файл не похож на резервную копию проекта «Норма» версии 2.");
  restoreLocalBackup(parsed);
}

export function resetLocalData() {
  reset();
}
