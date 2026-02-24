import { z } from "zod";

export const changePasswordSchema = z
  .object({
    password: z.string().min(1, { message: "Password is required" }),
    newPassword: z
      .string()
      .min(8, { message: "Password should contain at least 8 characters" }),
    confirmPassword: z.string(),
    revokeSessions: z.boolean(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
