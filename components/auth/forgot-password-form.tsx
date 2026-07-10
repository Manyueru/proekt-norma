"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { AuthFormShell } from "./auth-form-shell";

export function ForgotPasswordForm() {
  const { sendPasswordReset, configured } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    const result = await sendPasswordReset(email.trim());
    setLoading(false);
    if (result.error) setError(result.error.message);
    else setMessage(result.message || "Письмо отправлено.");
  }

  return (
    <AuthFormShell title="Восстановление пароля" description="Мы отправим на почту ссылку для создания нового пароля.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField label="Электронная почта" required>
          <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </FormField>
        {error && <p className="text-sm text-red-500" role="alert">{error}</p>}
        {message && <p className="rounded-lg bg-accent-sage/10 p-3 text-sm" role="status">{message}</p>}
        <Button type="submit" variant="primary" disabled={loading || !configured} className="justify-center">
          {loading ? "Отправляем…" : "Отправить ссылку"}
        </Button>
      </form>
    </AuthFormShell>
  );
}
