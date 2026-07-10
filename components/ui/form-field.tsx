import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

export function FormField({ label, hint, required, children }: FormFieldProps) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {hint && <span className="text-xs leading-5 text-muted-c">{hint}</span>}
      {children}
    </label>
  );
}
