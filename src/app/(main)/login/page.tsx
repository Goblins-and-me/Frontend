"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        router.replace("/profile");
        router.refresh();
      } else {
        setError("Проверьте email и пароль и попробуйте ещё раз.");
      }
    } catch {
      setError("Не удалось выполнить вход. Попробуйте ещё раз.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-title">
        <Link href="/" className="auth-brand">
          <span className="brand-mark" aria-hidden="true" />
          Sweet Story
        </Link>

        <p className="auth-eyebrow">Рады видеть вас снова</p>
        <h1 id="login-title" className="auth-title">Вход в аккаунт</h1>
        <p className="auth-description">
          Войдите, чтобы продолжить оформление заказов.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>Email</span>
            <input
              className="auth-input"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="name@example.com"
              required
            />
          </label>

          <label className="auth-field">
            <span>Пароль</span>
            <input
              className="auth-input"
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Введите пароль"
              required
            />
          </label>

          {error && <p className="auth-error" role="alert">{error}</p>}

          <button className="auth-submit" type="submit" disabled={isLoading}>
            {isLoading ? "Входим..." : "Войти"}
          </button>
        </form>

        <p className="auth-switch">
          Ещё нет аккаунта? <Link href="/register">Зарегистрироваться</Link>
        </p>
      </section>
    </main>
  );
}
