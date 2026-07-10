import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function TopicSection({
  title,
  children,
  tone
}: {
  title: string;
  children: ReactNode;
  tone?: "warning" | "muted";
}) {
  return (
    <section
      className={cn(
        "rounded-card p-5",
        tone === "warning"
          ? "bg-amber-500/10"
          : tone === "muted"
          ? "bg-black/[0.03] dark:bg-white/[0.04]"
          : "border border-c bg-surface"
      )}
    >
      <h2 className="text-sm font-medium mb-2">{title}</h2>
      <div className="text-sm text-muted-c leading-7">{children}</div>
    </section>
  );
}
