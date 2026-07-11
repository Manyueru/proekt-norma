"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import type { UserProfile } from "@/lib/types";

interface AuthResult {
  error: Error | null;
  message?: string;
}

interface AuthContextValue {
  configured: boolean;
  loading: boolean;
  user: User | null;
  profile: UserProfile | null;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string, displayName: string) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
  sendPasswordReset: (email: string) => Promise<AuthResult>;
  updatePassword: (password: string) => Promise<AuthResult>;
  updateProfile: (displayName: string) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const LOCAL_MODE_MESSAGE =
  "Синхронизация аккаунтов временно отключена. Данные сохраняются только в этом браузере.";

export function AuthProvider({ children }: { children: ReactNode }) {
  async function unavailable(): Promise<AuthResult> {
    return { error: new Error(LOCAL_MODE_MESSAGE) };
  }

  const value: AuthContextValue = {
    configured: false,
    loading: false,
    user: null,
    profile: null,
    signIn: unavailable,
    signUp: unavailable,
    signOut: async () => ({ error: null }),
    sendPasswordReset: unavailable,
    updatePassword: unavailable,
    updateProfile: unavailable
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
