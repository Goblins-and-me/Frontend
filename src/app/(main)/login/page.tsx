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
    <main className="grid min-h-page-below-header place-items-center bg-screen px-5 pt-12 pb-18 sweet-story-pattern max-phone:min-h-0 max-phone:pt-7 max-phone:pb-12">
      <section
        className="w-full max-w-md rounded-3xl border border-brand-border bg-brand-surface p-9 shadow-xl max-phone:rounded-2xl max-phone:px-6 max-phone:py-7"
        aria-labelledby="login-title"
      >
        <Link href="/" className="inline-flex items-center gap-2 text-lg font-extrabold text-brand-ink">
          <span className="size-2.5 rounded-full bg-brand-accent" aria-hidden="true" />
          Sweet Story
        </Link>

        <p className="mb-2 mt-8 text-xs font-extrabold uppercase tracking-widest text-brand-highlight max-phone:mt-6">
          Рады видеть вас снова
        </p>
        <h1 id="login-title" className="m-0 text-3xl font-extrabold leading-tight tracking-tight text-brand-ink">
          Вход в аккаунт
        </h1>
        <p className="mb-6 mt-2.5 text-sm leading-relaxed text-brand-subtle">
          Войдите, чтобы продолжить оформление заказов.
        </p>

        <form className="grid gap-4.5" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-bold text-brand-secondary">
            <span>Email</span>
            <input
              className="h-12 w-full rounded-xl border border-brand-border bg-brand-surface px-3.5 text-sm font-normal text-brand-ink outline-none transition placeholder:text-brand-quiet focus:border-brand-outline focus:ring-4 focus:ring-brand-outline/15"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="name@example.com"
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-brand-secondary">
            <span>Пароль</span>
            <input
              className="h-12 w-full rounded-xl border border-brand-border bg-brand-surface px-3.5 text-sm font-normal text-brand-ink outline-none transition placeholder:text-brand-quiet focus:border-brand-outline focus:ring-4 focus:ring-brand-outline/15"
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Введите пароль"
              required
            />
          </label>

          {error && (
            <p className="m-0 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm leading-relaxed text-rose-800" role="alert">
              {error}
            </p>
          )}

          <button
            className="mt-0.5 grid min-h-12 place-items-center rounded-xl bg-brand-accent text-sm font-extrabold text-white transition-colors hover:bg-brand-accent-hover disabled:cursor-wait disabled:opacity-70"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Входим..." : "Войти"}
          </button>
        </form>

        <p className="mb-0 mt-6 text-center text-sm text-brand-subtle">
          Ещё нет аккаунта?{" "}
          <Link href="/register" className="font-extrabold text-brand-highlight-dark underline underline-offset-4 hover:text-brand-highlight">
            Зарегистрироваться
          </Link>
        </p>
      </section>
    </main>
  );
}
