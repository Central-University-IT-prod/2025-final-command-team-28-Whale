import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Введите корректный email" }),
  password: z.string().min(8, { message: "Пароль должен содержать минимум 8 символов" }),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const baseRegisterSchema = z.object({
  email: z.string().email({ message: "Введите корректный email" }),
  password: z
    .string()
    .min(8, { message: "Пароль должен содержать минимум 8 символов" })
    .regex(/[A-Z]/, { message: "Пароль должен содержать хотя бы одну заглавную букву" })
    .regex(/[0-9]/, { message: "Пароль должен содержать хотя бы одну цифру" }),
  confirmPassword: z.string(),
});

export const userRegisterSchema = baseRegisterSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  }
);

const telegramContactSchema = z
  .string()
  .min(1, { message: "Контактная информация обязательна" })
  .transform((value) => {
    if (!value.trim()) return value;
    
    if (value.startsWith('@')) {
      return `https://t.me/${value.substring(1)}`;
    }
   
    if (value.startsWith('t.me/') || value.startsWith('telegram.me/')) {
      return `https://${value}`;
    }
    
    return value;
  })
  .refine(
    (value) => {
      if (!value.trim()) return true;
      
      return /^https?:\/\/(t(elegram)?\.me|telegram\.org)\/([a-zA-Z0-9_]{5,32})$/.test(value);
    },
    {
      message: "Введите корректную ссылку на Telegram (например, https://t.me/username или @username)"
    }
  );

export const mentorBaseSchema = baseRegisterSchema.extend({
  expertise: z.string().min(1, { message: "Укажите вашу профориентацию" }),
  contact: telegramContactSchema,
  tags: z.array(z.string()).optional(),
});

export const mentorRegisterSchema = mentorBaseSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  }
);

export type UserRegisterFormData = z.infer<typeof userRegisterSchema>;
export type MentorRegisterFormData = z.infer<typeof mentorRegisterSchema>;