import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { Providers } from "@/components/providers/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Проект Норма",
  description:
    "Персональная образовательная платформа по развитию ребёнка, логопедии и нейропсихологии"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
