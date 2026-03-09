import { z } from "zod";

export const createRoleSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  permission: z.record(z.array(z.string())),
});

export const createRoleFormSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  permissions: z.array(z.string()),
});

export const updateRoleSchema = z.object({
  data: z.object({
    roleName: z.string().min(1).optional(),
    permission: z.record(z.array(z.string())).optional(),
  }),
});
