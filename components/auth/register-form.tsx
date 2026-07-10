"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { AuthFormShell } from "./auth-form-shell";

export function RegisterForm() {
  const { signUp, configured } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    if (password.length < 8) {
      setError("Пароль должен содержать не меньше 8 символов.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Пароли не совпадают.");
      return;
    }
    setLoading(true);
    const result = await signUp(email.trim(), password, displayName);
    setLoading(false);
    if (result.error) {
      setError(result.error.message);
      return;
    }
    setMessage(result.message || "Аккаунт создан. Теперь можно войти.");
  }

  return (
    <AuthFormShell
      title="Регистрация"
      description="Аккаунт нужен только для личного прогресса, конспектов и синхронизации между устройствами."
      footer={
        <>
          Уже есть аккаунт?{" "}
          <Link href="/auth/login" className="text-accent-blue hover:underline">
            Войти
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField label="Имя" hint="Так сайт будет обращаться к вам в личном кабинете." required>
          <Input value={displayName} onChange={(event) => setDisplayName(event.target.value)} required />
        </FormField>
        <FormField label="Электронная почта" required>
          <Input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </FormField>
        <FormField label="Пароль" hint="Не меньше 8 символов." required>
          <Input type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </FormField>
        <FormField label="Повторите пароль" required>
          <Input type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
        </FormField>
        {error && <p className="text-sm text-red-500" role="alert">{error}</p>}
        {message && <p className="rounded-lg bg-accent-sage/10 p-3 text-sm" role="status">{message}</p>}
        <Button type="submit" variant="primary" disabled={loading || !configured} className="justify-center">
          {loading ? "Создаём аккаунт…" : "Создать аккаунт"}
        </Button>
      </form>
    </AuthFormShell>
  );
}
