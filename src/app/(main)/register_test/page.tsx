"use client";

import { useActionState } from "react";
import { registerUser } from "@/app/actions/register";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerUser, null);

  return (
    <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 320 }}>
      <div>
        <input type="email" name="email" placeholder="Email" required />
        {state?.errors?.email && (
          <p style={{ color: "red", fontSize: 13 }}>{state.errors.email[0]}</p>
        )}
      </div>

      <div>
        <input type="password" name="password" placeholder="Password" required />
        {state?.errors?.password && (
          <p style={{ color: "red", fontSize: 13 }}>{state.errors.password[0]}</p>
        )}
      </div>

      <div>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          required
        />
        {state?.errors?.confirmPassword && (
          <p style={{ color: "red", fontSize: 13 }}>{state.errors.confirmPassword[0]}</p>
        )}
      </div>

      {state?.message && <p style={{ color: "red" }}>{state.message}</p>}

      <button type="submit" disabled={isPending}>
        {isPending ? "Создание аккаунта..." : "Зарегистрироваться"}
      </button>
    </form>
  );
}
