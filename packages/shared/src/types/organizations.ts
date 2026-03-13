import type { Organization } from "./db";

export type OrganizationWithRole = Organization & {
  role: string;
};

export type OrganizationPermissions = {
  canUpdate: boolean;
  canDelete: boolean;
};
