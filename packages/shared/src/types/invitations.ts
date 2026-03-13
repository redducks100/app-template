import type { Invitation, Organization, User } from "./db";

export type InvitationDetail = Invitation & {
  inviter: Pick<User, "id" | "name" | "email" | "image">;
  organization: Pick<Organization, "id" | "name" | "slug" | "logo">;
};

export type InvitationPermissions = {
  canCreate: boolean;
  canCancel: boolean;
};
