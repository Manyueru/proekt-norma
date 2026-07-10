export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full rounded-full bg-black/[0.06] dark:bg-white/[0.08]">
      <div
        className="h-2 rounded-full bg-accent-blue transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
