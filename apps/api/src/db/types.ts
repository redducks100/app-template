import type { Generated } from "kysely";

export interface UserTable {
  id: string;
  name: string;
  email: string;
  emailVerified: Generated<boolean>;
  image: string | null;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  locale: Generated<string | null>;
}

export interface SessionTable {
  id: string;
  expiresAt: Date;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  userId: string;
  activeOrganizationId: string | null;
}

export interface AccountTable {
  id: string;
  accountId: string;
  providerId: string;
  userId: string;
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
  accessTokenExpiresAt: Date | null;
  refreshTokenExpiresAt: Date | null;
  scope: string | null;
  password: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface VerificationTable {
  id: string;
  identifier: string;
  value: string;
  expiresAt: Date;
  createdAt: Generated<Date | null>;
  updatedAt: Generated<Date | null>;
}

export interface OrganizationTable {
  id: string;
  name: string;
  slug: string | null;
  logo: string | null;
  createdAt: Date;
  metadata: string | null;
}

export interface MemberTable {
  id: string;
  organizationId: string;
  userId: string;
  role: Generated<string>;
  createdAt: Date;
}

export interface InvitationTable {
  id: string;
  organizationId: string;
  email: string;
  role: string | null;
  status: Generated<string>;
  expiresAt: Date;
  inviterId: string;
  createdAt: Generated<Date>;
}

export interface OrganizationRoleTable {
  id: string;
  organizationId: string;
  role: string;
  permission: string | null;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date | null>;
}

export interface RateLimitTable {
  id: string;
  key: string;
  count: number;
  lastRequest: number;
}

export interface Database {
  user: UserTable;
  session: SessionTable;
  account: AccountTable;
  verification: VerificationTable;
  organization: OrganizationTable;
  member: MemberTable;
  invitation: InvitationTable;
  organizationRole: OrganizationRoleTable;
  rateLimit: RateLimitTable;
}
