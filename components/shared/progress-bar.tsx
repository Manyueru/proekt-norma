export function ProgressBar({ value, label = "Прогресс" }: { value: number; label?: string }) {
  const normalized = Math.min(100, Math.max(0, value));
  return (
    <div
      className="h-1.5 w-full overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/[0.09]"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={normalized}
    >
      <div
        className="h-full rounded-full bg-accent-blue transition-all"
        style={{ width: `${normalized}%` }}
      />
    </div>
  );
}
