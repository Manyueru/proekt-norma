import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 px-5 py-6 pb-24 md:px-10 md:py-10 md:pb-10 max-w-4xl mx-auto w-full">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
