"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "./auth-provider";
import { PersonalDataProvider } from "./personal-data-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <PersonalDataProvider>{children}</PersonalDataProvider>
    </AuthProvider>
  );
}
