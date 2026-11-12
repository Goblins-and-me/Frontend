import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt"
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        confirmed_password: { label: "Confirm Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password || !credentials.confirmed_password) {
          return null;
        }

        try {
          // 1. Отправляем данные на ваш сторонний бэкенд
          const res = await fetch(`${process.env.BACKEND_URL}/v1/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();

          // 2. Если бэкенд вернул ошибку (например, 401)
          if (!res.ok || !data) {
            return null;
          }

          // 3. Возвращаем объект пользователя (он попадет в коллбэк jwt)
          // Обязательно должно быть поле id
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            accessToken: data.accessToken,   // Токен от вашего бэкенда
            refreshToken: data.refreshToken, // Refresh-токен (если есть)
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
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  }
})
