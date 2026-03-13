import { z } from "zod";

export const Invitation = z.object({
  id: z.string(),
  organizationId: z.string(),
  email: z.string(),
  role: z.string().nullable(),
  status: z.string(),
  expiresAt: z.coerce.date(),
  inviterId: z.string(),
  createdAt: z.coerce.date(),
});
export type Invitation = z.infer<typeof Invitation>;

export const InvitationListItem = z.object({
  id: z.string(),
  email: z.string(),
  role: z.string().nullable(),
  status: z.string(),
  expiresAt: z.coerce.date(),
});
export type InvitationListItem = z.infer<typeof InvitationListItem>;

export const InvitationDetail = Invitation.extend({
  inviter: z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string(),
    image: z.string().nullable(),
  }),
  organization: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string().nullable(),
    logo: z.string().nullable(),
  }),
});
export type InvitationDetail = z.infer<typeof InvitationDetail>;

export const InvitationPermissions = z.object({
  canCreate: z.boolean(),
  canCancel: z.boolean(),
});
export type InvitationPermissions = z.infer<typeof InvitationPermissions>;
