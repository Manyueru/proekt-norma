"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { AuthFormShell } from "./auth-form-shell";

export function ResetPasswordForm() {
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (password.length < 8) return setError("Пароль должен содержать не меньше 8 символов.");
    if (password !== confirm) return setError("Пароли не совпадают.");
    setError(null);
    setLoading(true);
    const result = await updatePassword(password);
    setLoading(false);
    if (result.error) setError(result.error.message);
    else setMessage(result.message || "Пароль обновлён.");
  }

  return (
    <AuthFormShell title="Новый пароль" description="Введите новый пароль для аккаунта.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField label="Новый пароль" required>
          <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </FormField>
        <FormField label="Повторите пароль" required>
          <Input type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} required />
        </FormField>
        {error && <p className="text-sm text-red-500" role="alert">{error}</p>}
        {message && (
          <p className="rounded-lg bg-accent-sage/10 p-3 text-sm" role="status">
            {message} <Link href="/auth/login" className="text-accent-blue hover:underline">Перейти ко входу</Link>
          </p>
        )}
        <Button type="submit" variant="primary" disabled={loading} className="justify-center">
          {loading ? "Сохраняем…" : "Сохранить пароль"}
        </Button>
      </form>
    </AuthFormShell>
  );
}
