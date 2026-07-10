import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-9 w-full rounded-lg border border-c bg-surface px-3 text-sm outline-none focus:ring-2 focus:ring-accent-blue/40",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-9 rounded-lg border border-c bg-surface px-2 text-sm outline-none focus:ring-2 focus:ring-accent-blue/40",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-lg border border-c bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent-blue/40",
        className
      )}
      {...props}
    />
  );
}
