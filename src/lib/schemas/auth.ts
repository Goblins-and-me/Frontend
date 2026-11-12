import { z } from "zod";

export const RegisterSchema = z
  .object({
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
