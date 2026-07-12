import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary: "border border-accent-blue bg-accent-blue text-white hover:bg-accent-blue/90 hover:border-accent-blue/90",
  secondary: "border border-c bg-surface text-[rgb(var(--fg))] hover:border-accent-blue/45 hover:bg-black/[0.015] dark:hover:bg-white/[0.035]",
  ghost: "text-muted-c hover:bg-black/[0.035] hover:text-[rgb(var(--fg))] dark:hover:bg-white/[0.05]"
};

const sizeClasses: Record<Size, string> = {
  sm: "min-h-8 px-3 py-1.5 text-xs",
  md: "min-h-10 px-4 py-2 text-sm"
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
