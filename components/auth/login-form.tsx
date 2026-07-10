"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { AuthFormShell } from "./auth-form-shell";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, configured } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const result = await signIn(email.trim(), password);
    setLoading(false);
    if (result.error) {
      setError(result.error.message);
      return;
    }
    const next = searchParams.get("next");
    router.push(next?.startsWith("/") ? next : "/account");
  }

  return (
    <AuthFormShell
      title="Вход"
      description="Войдите, чтобы видеть одинаковый прогресс и конспекты на компьютере и телефоне."
      footer={
        <>
          Нет аккаунта?{" "}
          <Link href="/auth/register" className="text-accent-blue hover:underline">
            Зарегистрироваться
          </Link>
        </>
      }
    >
      {!configured && (
        <p className="mb-4 rounded-lg bg-accent-violet/10 p-3 text-sm text-muted-c">
          Синхронизация ещё не подключена. Сайт работает в гостевом режиме, а данные сохраняются только в браузере.
        </p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField label="Электронная почта" required>
          <Input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </FormField>
        <FormField label="Пароль" required>
          <Input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </FormField>
        {error && <p className="text-sm text-red-500" role="alert">{error}</p>}
        <Button type="submit" variant="primary" disabled={loading || !configured} className="justify-center">
          {loading ? "Входим…" : "Войти"}
        </Button>
        <Link href="/auth/forgot-password" className="text-center text-xs text-accent-blue hover:underline">
          Забыли пароль?
        </Link>
      </form>
    </AuthFormShell>
  );
}
