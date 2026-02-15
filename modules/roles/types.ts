export type RolePermissions = Record<string, string[]>;

export type RoleData = {
  id: string;
  role: string;
  permission: RolePermissions;
  isDefault: boolean;
  organizationId?: string;
  createdAt?: Date;
};
