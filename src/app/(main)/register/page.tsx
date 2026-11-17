"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerUser } from "@/app/actions/register";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerUser, null);

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="register-title">
        <Link href="/" className="auth-brand">
          <span className="brand-mark" aria-hidden="true" />
          Sweet Story
        </Link>

        <p className="auth-eyebrow">Создайте аккаунт</p>
        <h1 id="register-title" className="auth-title">Регистрация</h1>
        <p className="auth-description">
          Зарегистрируйтесь, чтобы оформлять заказы и следить за ними.
        </p>

        <form className="auth-form" action={formAction}>
          <label className="auth-field">
            <span>Email</span>
            <input
              className="auth-input"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="name@example.com"
              aria-invalid={Boolean(state?.errors?.email)}
              aria-describedby={state?.errors?.email ? "register-email-error" : undefined}
              required
            />
            {state?.errors?.email && (
              <span className="auth-field-error" id="register-email-error">
                {state.errors.email[0]}
              </span>
            )}
          </label>

          <label className="auth-field">
            <span>Пароль</span>
            <input
              className="auth-input"
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder="Придумайте пароль"
              aria-invalid={Boolean(state?.errors?.password)}
              aria-describedby="register-password-hint"
              required
            />
            <span className="auth-field-hint" id="register-password-hint">
              Не менее 8 символов, заглавная буква и цифра
            </span>
            {state?.errors?.password && (
              <span className="auth-field-error">
                {state.errors.password[0]}
              </span>
            )}
          </label>

          <label className="auth-field">
            <span>Повторите пароль</span>
            <input
              className="auth-input"
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Введите пароль ещё раз"
              aria-invalid={Boolean(state?.errors?.confirmPassword)}
              aria-describedby={state?.errors?.confirmPassword ? "register-confirm-password-error" : undefined}
              required
            />
            {state?.errors?.confirmPassword && (
              <span className="auth-field-error" id="register-confirm-password-error">
                {state.errors.confirmPassword[0]}
              </span>
            )}
          </label>

          {state?.message && <p className="auth-error" role="alert">{state.message}</p>}

          <button className="auth-submit" type="submit" disabled={isPending}>
            {isPending ? "Создаём аккаунт..." : "Зарегистрироваться"}
          </button>
        </form>

        <p className="auth-switch">
          Уже есть аккаунт? <Link href="/login">Войти</Link>
        </p>
      </section>
    </main>
  );
}
