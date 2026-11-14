"use server";

import { signIn } from "@/auth";
import { RegisterSchema } from "@/lib/schemas/auth";
import { AuthError } from "next-auth";

export type ActionState = {
  errors?: Record<string, string[]>;
  message?: string;
} | null;

export async function registerUser(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = Object.fromEntries(formData.entries());

  // 1. Строгая валидация полей
  const validated = RegisterSchema.safeParse(rawData);

  if (!validated.success) {
    const errors: Record<string, string[]> = {};

    for (const issue of validated.error.issues) {
      const field = issue.path[0]?.toString();
      if (field) {
        errors[field] = errors[field] ?? [];
        errors[field].push(issue.message);
      }
    }

    return { errors };
  }

  const { email, password, confirmPassword } = validated.data;

  // 2. Запрос на внешний бэкенд
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, confirmPassword }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);

      if (res.status === 409) {
        return { message: "Пользователь с таким email уже существует" };
      }
      return { message: data?.message || "Ошибка при регистрации" };
    }
  } catch (err) {
    return { message: "Сервер временно недоступен" };
  }

  // 3. Автологин сразу после успешной регистрации
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { message: "Аккаунт создан, но войти не удалось. Войдите вручную." };
    }
    // Next.js обрабатывает редиректы через исключение NEXT_REDIRECT, пробрасываем его
    throw error;
  }

  return null;
}
