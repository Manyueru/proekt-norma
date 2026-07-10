import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "blue" | "sage" | "violet" | "amber" | "neutral";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

const toneClasses: Record<Tone, string> = {
  blue: "bg-accent-blue/10 text-accent-blue",
  sage: "bg-accent-sage/15 text-accent-sage",
  violet: "bg-accent-violet/15 text-accent-violet",
  amber: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  neutral: "bg-black/[0.05] text-muted-c dark:bg-white/[0.06]"
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        toneClasses[tone],
        className
      )}
      {...props}
    />
  );
}
