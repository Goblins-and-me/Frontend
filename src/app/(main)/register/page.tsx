"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerUser } from "@/app/actions/register";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerUser, null);

  return (
    <main className="grid min-h-page-below-header place-items-center bg-screen px-5 pt-12 pb-18 sweet-story-pattern max-phone:min-h-0 max-phone:pt-7 max-phone:pb-12">
      <section
        className="w-full max-w-md rounded-3xl border border-brand-border bg-brand-surface p-9 shadow-xl max-phone:rounded-2xl max-phone:px-6 max-phone:py-7"
        aria-labelledby="register-title"
      >
        <Link href="/" className="inline-flex items-center gap-2 text-lg font-extrabold text-brand-ink">
          <span className="size-2.5 rounded-full bg-brand-accent" aria-hidden="true" />
          Sweet Story
        </Link>

        <p className="mb-2 mt-8 text-xs font-extrabold uppercase tracking-widest text-brand-highlight max-phone:mt-6">
          Создайте аккаунт
        </p>
        <h1 id="register-title" className="m-0 text-3xl font-extrabold leading-tight tracking-tight text-brand-ink">
          Регистрация
        </h1>
        <p className="mb-6 mt-2.5 text-sm leading-relaxed text-brand-subtle">
          Зарегистрируйтесь, чтобы оформлять заказы и следить за ними.
        </p>

        <form className="grid gap-4.5" action={formAction}>
          <label className="grid gap-2 text-sm font-bold text-brand-secondary">
            <span>Имя</span>
            <input
              className="h-12 w-full rounded-xl border border-brand-border bg-brand-surface px-3.5 text-sm font-normal text-brand-ink outline-none transition placeholder:text-brand-quiet focus:border-brand-outline focus:ring-4 focus:ring-brand-outline/15 aria-invalid:border-brand-highlight"
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Например, Анна"
              aria-invalid={Boolean(state?.errors?.name)}
              aria-describedby={state?.errors?.name ? "register-name-error" : undefined}
              required
            />
            {state?.errors?.name && (
              <span className="text-xs font-normal leading-relaxed text-rose-800" id="register-name-error">
                {state.errors.name[0]}
              </span>
            )}
          </label>

          <label className="grid gap-2 text-sm font-bold text-brand-secondary">
            <span>Телефон</span>
            <input
              className="h-12 w-full rounded-xl border border-brand-border bg-brand-surface px-3.5 text-sm font-normal text-brand-ink outline-none transition placeholder:text-brand-quiet focus:border-brand-outline focus:ring-4 focus:ring-brand-outline/15 aria-invalid:border-brand-highlight"
              type="tel"
              name="phone"
              autoComplete="tel"
              placeholder="+375 (__) ___-__-__"
              aria-invalid={Boolean(state?.errors?.phone)}
              aria-describedby={state?.errors?.phone ? "register-phone-error" : undefined}
              required
            />
            {state?.errors?.phone && (
              <span className="text-xs font-normal leading-relaxed text-rose-800" id="register-phone-error">
                {state.errors.phone[0]}
              </span>
            )}
          </label>

          <label className="grid gap-2 text-sm font-bold text-brand-secondary">
            <span>Email</span>
            <input
              className="h-12 w-full rounded-xl border border-brand-border bg-brand-surface px-3.5 text-sm font-normal text-brand-ink outline-none transition placeholder:text-brand-quiet focus:border-brand-outline focus:ring-4 focus:ring-brand-outline/15 aria-invalid:border-brand-highlight"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="name@example.com"
              aria-invalid={Boolean(state?.errors?.email)}
              aria-describedby={state?.errors?.email ? "register-email-error" : undefined}
              required
            />
            {state?.errors?.email && (
              <span className="text-xs font-normal leading-relaxed text-rose-800" id="register-email-error">
                {state.errors.email[0]}
              </span>
            )}
          </label>

          <label className="grid gap-2 text-sm font-bold text-brand-secondary">
            <span>Пароль</span>
            <input
              className="h-12 w-full rounded-xl border border-brand-border bg-brand-surface px-3.5 text-sm font-normal text-brand-ink outline-none transition placeholder:text-brand-quiet focus:border-brand-outline focus:ring-4 focus:ring-brand-outline/15 aria-invalid:border-brand-highlight"
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder="Придумайте пароль"
              aria-invalid={Boolean(state?.errors?.password)}
              aria-describedby="register-password-hint"
              required
            />
            <span className="text-xs font-normal leading-relaxed text-brand-muted" id="register-password-hint">
              Не менее 8 символов, заглавная буква и цифра
            </span>
            {state?.errors?.password && (
              <span className="text-xs font-normal leading-relaxed text-rose-800">
                {state.errors.password[0]}
              </span>
            )}
          </label>

          <label className="grid gap-2 text-sm font-bold text-brand-secondary">
            <span>Повторите пароль</span>
            <input
              className="h-12 w-full rounded-xl border border-brand-border bg-brand-surface px-3.5 text-sm font-normal text-brand-ink outline-none transition placeholder:text-brand-quiet focus:border-brand-outline focus:ring-4 focus:ring-brand-outline/15 aria-invalid:border-brand-highlight"
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Введите пароль ещё раз"
              aria-invalid={Boolean(state?.errors?.confirmPassword)}
              aria-describedby={state?.errors?.confirmPassword ? "register-confirm-password-error" : undefined}
              required
            />
            {state?.errors?.confirmPassword && (
              <span className="text-xs font-normal leading-relaxed text-rose-800" id="register-confirm-password-error">
                {state.errors.confirmPassword[0]}
              </span>
            )}
          </label>

          {state?.message && (
            <p className="m-0 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm leading-relaxed text-rose-800" role="alert">
              {state.message}
            </p>
          )}

          <button
            className="mt-0.5 grid min-h-12 place-items-center rounded-xl bg-brand-accent text-sm font-extrabold text-white transition-colors hover:bg-brand-accent-hover disabled:cursor-wait disabled:opacity-70"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Создаём аккаунт..." : "Зарегистрироваться"}
          </button>
        </form>

        <p className="mb-0 mt-6 text-center text-sm text-brand-subtle">
          Уже есть аккаунт?{" "}
          <Link href="/login" className="font-extrabold text-brand-highlight-dark underline underline-offset-4 hover:text-brand-highlight">
            Войти
          </Link>
        </p>
      </section>
    </main>
  );
}
