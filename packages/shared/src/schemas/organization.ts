import { z } from "zod";

export const Organization = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string().nullable(),
  logo: z.string().nullable(),
  createdAt: z.coerce.date(),
  metadata: z.string().nullable(),
});
export type Organization = z.infer<typeof Organization>;

export const OrganizationWithRole = Organization.extend({
  role: z.string(),
});
export type OrganizationWithRole = z.infer<typeof OrganizationWithRole>;

export const OrganizationPermissions = z.object({
  canUpdate: z.boolean(),
  canDelete: z.boolean(),
});
export type OrganizationPermissions = z.infer<typeof OrganizationPermissions>;
