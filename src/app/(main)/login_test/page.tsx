"use client";

import { SubmitEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Вызываем NextAuth вместо прямого fetch
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Отключаем авто-редирект, чтобы обработать ошибки вручную
    });

    setIsLoading(false);

    if (result?.error) {
      setError("Неверный логин, пароль или данные не прошли проверку");
    } else if (result?.ok) {
      router.push("/profile");
      router.refresh(); // Обновляем серверные компоненты, чтобы подтянулась новая сессия
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />


      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Вход..." : "Login"}
      </button>
    </form>
  );
}
