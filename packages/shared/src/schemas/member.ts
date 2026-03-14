import { z } from "zod";

export const MemberUser = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  image: z.string().nullable(),
});
export type MemberUser = z.infer<typeof MemberUser>;

export const Member = z.object({
  id: z.string(),
  organizationId: z.string(),
  userId: z.string(),
  role: z.string(),
  createdAt: z.coerce.date(),
  user: MemberUser,
});
export type Member = z.infer<typeof Member>;

export const MemberListItem = z.object({
  id: z.string(),
  userId: z.string(),
  role: z.string(),
  createdAt: z.coerce.date(),
  user: z.object({
    name: z.string(),
    email: z.string(),
    image: z.string().nullable(),
  }),
});
export type MemberListItem = z.infer<typeof MemberListItem>;

export const MemberPermissions = z.object({
  canUpdate: z.boolean(),
  canDelete: z.boolean(),
});
export type MemberPermissions = z.infer<typeof MemberPermissions>;
