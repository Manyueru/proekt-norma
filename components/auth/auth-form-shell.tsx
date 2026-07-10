import Link from "next/link";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function AuthFormShell({
  title,
  description,
  children,
  footer
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-5 py-4 sm:py-10">
      <div>
        <Link href="/" className="text-xs text-accent-blue hover:underline">
          ← Вернуться на главную
        </Link>
        <h1 className="mt-4 text-xl font-medium">{title}</h1>
        <p className="mt-1 text-sm leading-6 text-muted-c">{description}</p>
      </div>
      <Card>{children}</Card>
      {footer && <div className="text-center text-sm text-muted-c">{footer}</div>}
    </div>
  );
}
