"use server";

import { cookies } from "next/headers";
import { signOut } from "@/auth";

export interface DeleteAccountResponse {
  status: "success";
  message: string;
}

export interface DeleteAccountErrorResponse {
  status: "error";
  error: string;
}

export async function deleteUserAccount(): Promise<
  DeleteAccountResponse | DeleteAccountErrorResponse
> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!accessToken) {
      return {
        status: "error",
        error: "Сессия истекла. Войдите в аккаунт ещё раз.",
      };
    }

    const cookieHeader = [
      `access_token=${accessToken}`,
      refreshToken ? `refresh_token=${refreshToken}` : null,
    ]
      .filter(Boolean)
      .join("; ");

    const response = await fetch(`${process.env.BACKEND_URL}/api/users/me`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      return {
        status: "error",
        error:
          data?.message ||
          data?.detail ||
          "Не удалось удалить аккаунт. Попробуйте ещё раз.",
      };
    }

    await signOut({ redirectTo: "/login" });

    return {
      status: "success",
      message: "Аккаунт успешно удалён",
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }

    return {
      status: "error",
      error: "Сервер временно недоступен. Попробуйте ещё раз.",
    };
  }
}