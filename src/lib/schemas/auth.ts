import { z } from "zod";

export const RegisterSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Введите имя не короче 2 символов")
      .max(100, "Имя слишком длинное"),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[0-9 ()-]{6,25}$/, "Введите корректный номер телефона"),
    email: z.email("Некорректный формат email"),
    password: z
      .string()
      .min(8, "Минимум 8 символов")
      .regex(/[A-Z]/, "Нужна хотя бы одна заглавная буква")
      .regex(/[0-9]/, "Нужна хотя бы одна цифра"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof RegisterSchema>;
