import { z } from "zod";

// Roles
const roleDataSchema = z.object({
  id: z.string(),
  role: z.string(),
  permission: z.record(z.string(), z.array(z.string())),
  isDefault: z.boolean(),
  organizationId: z.string().optional(),
  createdAt: z.coerce.date().optional(),
});
export const rolesListSchema = z.array(roleDataSchema);
export type RoleData = z.infer<typeof roleDataSchema>;

// Members
const memberSchema = z
  .object({
    id: z.string(),
    organizationId: z.string(),
    userId: z.string(),
    role: z.string(),
    createdAt: z.coerce.date(),
    user: z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      image: z.string().nullable().optional(),
    }),
  });
export const membersListSchema = z.object({ members: z.array(memberSchema) });
export type Member = z.infer<typeof memberSchema>;

// Invitations
const invitationSchema = z
  .object({
    id: z.string(),
    organizationId: z.string(),
    email: z.string(),
    role: z.string().nullable(),
    status: z.string(),
    expiresAt: z.coerce.date(),
    inviterId: z.string(),
  });
export const invitationsListSchema = z.array(invitationSchema);
export const invitationDetailSchema = invitationSchema.extend({
  inviter: z.object({ name: z.string() }),
  organization: z.object({ name: z.string() }),
});
export type Invitation = z.infer<typeof invitationSchema>;
export type InvitationDetail = z.infer<typeof invitationDetailSchema>;

// Sessions
const sessionItemSchema = z
  .object({
    id: z.string(),
    token: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    expiresAt: z.coerce.date(),
    ipAddress: z.string().nullable().optional(),
    userAgent: z.string().nullable().optional(),
    userId: z.string(),
    current: z.boolean(),
  });
export const sessionsListSchema = z.array(sessionItemSchema);

// Linked accounts
const linkedAccountSchema = z
  .object({
    accountId: z.string(),
    providerId: z.string(),
    createdAt: z.coerce.date(),
  });
export const linkedAccountsSchema = z.array(linkedAccountSchema);
export type LinkedAccount = z.infer<typeof linkedAccountSchema>;

// Session check
export const sessionCheckSchema = z.discriminatedUnion("authenticated", [
  z.object({ authenticated: z.literal(false) }),
  z.object({
    authenticated: z.literal(true),
    user: z
      .object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        emailVerified: z.boolean(),
        image: z.string().nullable().optional(),
        createdAt: z.coerce.date(),
        updatedAt: z.coerce.date(),
      }),
    session: z.object({ id: z.string(), token: z.string(), activeOrganizationId: z.string().nullable().optional() }),
    hasMembership: z.boolean(),
    locale: z.string(),
  }),
]);
