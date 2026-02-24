import { z } from "zod";

export const createInvitationSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
});
