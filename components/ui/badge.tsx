import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "blue" | "sage" | "violet" | "amber" | "neutral";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

const toneClasses: Record<Tone, string> = {
  blue: "bg-accent-blue/10 text-accent-blue",
  sage: "bg-emerald-600/10 text-emerald-700 dark:text-emerald-300",
  violet: "bg-accent-blue/10 text-accent-blue",
  amber: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  neutral: "bg-black/[0.045] text-muted-c dark:bg-white/[0.07]"
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium",
        toneClasses[tone],
        className
      )}
      {...props}
    />
  );
}
