"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import type { AuthError, User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { UserProfile } from "@/lib/types";

interface AuthResult {
  error: AuthError | Error | null;
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

function profileFromUser(user: User): UserProfile {
  return {
    id: user.id,
    displayName:
      (user.user_metadata?.display_name as string | undefined) ||
      user.email?.split("@")[0] ||
      "Пользователь"
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isSupabaseConfigured();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [loading, setLoading] = useState(configured);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const loadProfile = useCallback(
    async (nextUser: User | null) => {
      if (!nextUser) {
        setProfile(null);
        return;
      }

      if (!supabase) {
        setProfile(profileFromUser(nextUser));
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("id, display_name, created_at, updated_at")
        .eq("id", nextUser.id)
        .maybeSingle();

      if (data) {
        setProfile({
          id: data.id,
          displayName: data.display_name || profileFromUser(nextUser).displayName,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        });
      } else {
        setProfile(profileFromUser(nextUser));
      }
    },
    [supabase]
  );

  useEffect(() => {
    if (!configured || !supabase) {
      setLoading(false);
      return;
    }

    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      const nextUser = data.session?.user ?? null;
      setUser(nextUser);
      await loadProfile(nextUser);
      if (active) setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      void loadProfile(nextUser);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, [configured, loadProfile, supabase]);

  async function signIn(email: string, password: string): Promise<AuthResult> {
    if (!supabase) return { error: new Error("Синхронизация пока не подключена.") };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  }

  async function signUp(
    email: string,
    password: string,
    displayName: string
  ): Promise<AuthResult> {
    if (!supabase) return { error: new Error("Синхронизация пока не подключена.") };
    const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/account` : undefined;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName.trim() || "Пользователь" },
        emailRedirectTo: redirectTo
      }
    });

    return {
      error,
      message:
        !error && !data.session
          ? "Проверьте почту и подтвердите регистрацию."
          : undefined
    };
  }

  async function signOut(): Promise<AuthResult> {
    if (!supabase) return { error: null };
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  async function sendPasswordReset(email: string): Promise<AuthResult> {
    if (!supabase) return { error: new Error("Синхронизация пока не подключена.") };
    const redirectTo = `${window.location.origin}/auth/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    return {
      error,
      message: !error ? "Ссылка для восстановления отправлена на почту." : undefined
    };
  }

  async function updatePassword(password: string): Promise<AuthResult> {
    if (!supabase) return { error: new Error("Синхронизация пока не подключена.") };
    const { error } = await supabase.auth.updateUser({ password });
    return { error, message: !error ? "Пароль обновлён." : undefined };
  }

  async function updateProfile(displayName: string): Promise<AuthResult> {
    if (!supabase || !user) return { error: new Error("Сначала войдите в аккаунт.") };
    const cleanName = displayName.trim();
    if (!cleanName) return { error: new Error("Имя не может быть пустым.") };

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      display_name: cleanName,
      updated_at: new Date().toISOString()
    });

    if (!error) {
      await supabase.auth.updateUser({ data: { display_name: cleanName } });
      setProfile((current) => ({
        id: user.id,
        displayName: cleanName,
        createdAt: current?.createdAt,
        updatedAt: new Date().toISOString()
      }));
    }

    return { error };
  }

  const value: AuthContextValue = {
    configured,
    loading,
    user,
    profile,
    signIn,
    signUp,
    signOut,
    sendPasswordReset,
    updatePassword,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
