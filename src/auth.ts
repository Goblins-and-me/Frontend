import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { cookies } from "next/headers";

// Хелпер: переносит Set-Cookie из ответа FastAPI в браузер пользователя
async function forwardBackendCookies(res: Response) {
  const setCookieHeaders = res.headers.getSetCookie();
  if (!setCookieHeaders.length) return;

  const cookieStore = await cookies();

  for (const cookieStr of setCookieHeaders) {
    const [nameValue, ...directives] = cookieStr.split(";").map((s) => s.trim());
    const eqIndex = nameValue.indexOf("=");
    if (eqIndex === -1) continue;

    const name = nameValue.slice(0, eqIndex);
    const value = nameValue.slice(eqIndex + 1);

    const options: {
      httpOnly?: boolean;
      secure?: boolean;
      sameSite?: "lax" | "strict" | "none";
      maxAge?: number;
      path?: string;
    } = {};

    for (const dir of directives) {
      const [key, val] = dir.split("=");
      const lowerKey = key.toLowerCase();

      if (lowerKey === "httponly") options.httpOnly = true;
      if (lowerKey === "secure") options.secure = true;
      if (lowerKey === "max-age" && val) options.maxAge = Number(val);
      if (lowerKey === "path" && val) options.path = val;
      if (lowerKey === "samesite" && val) {
        options.sameSite = val.toLowerCase() as "lax" | "strict" | "none";
      }
    }

    cookieStore.set(name, value, options);
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // 1. Запрос на FastAPI с сервера Next.js
          const res = await fetch(`${process.env.BACKEND_URL}/v1/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) {
            return null;
          }

          // 2. Пробрасываем access_token и refresh_token куки от FastAPI в браузер
          await forwardBackendCookies(res);

          const data = await res.json();
          if (!data?.user) {
            return null;
          }

          // 3. Возвращаем только профиль пользователя для сессии NextAuth
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            is_admin: Boolean(data.user.is_admin),
          };
        } catch (error) {
          console.error("Ошибка авторизации на бэкенде:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.is_admin = Boolean(user.is_admin);
      }
      return token;
    },

    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.is_admin = Boolean(token.is_admin);
      }
      return session;
    },
  },

  events: {
    // При выходе через NextAuth удаляем и куки FastAPI
    async signOut() {
      const cookieStore = await cookies();
      cookieStore.delete("access_token");
      cookieStore.delete({ name: "refresh_token", path: "/v1/auth/refresh" });
    },
  },
});
