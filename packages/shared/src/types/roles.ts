export type RolePermissions = Record<string, string[]>;

export type RoleData = {
  id: string;
  role: string;
  permission: Record<string, string[]>;
  isDefault: boolean;
  organizationId?: string;
  createdAt?: Date | string;
};

export const PERMISSION_MAP: Record<string, string[]> = {
  organization: ["read", "update", "delete"],
  member: ["read", "create", "update", "delete"],
  invitation: ["read", "create", "cancel"],
  role: ["read", "create", "update", "delete"],
  billing: ["read", "update"],
  audit_log: ["read"],
};

export const RESOURCE_TRANSLATION_KEY: Record<string, string> = {
  organization: "organization",
  member: "members",
  invitation: "invitations",
  role: "roles",
  billing: "billing",
  audit_log: "auditLog",
};

export const PERMISSION_GROUPS: { key: string; resources: string[] }[] = [
  {
    key: "organizationManagement",
    resources: ["organization", "role"],
  },
  {
    key: "peopleManagement",
    resources: ["member", "invitation"],
  },
  {
    key: "billingAndLogs",
    resources: ["billing", "audit_log"],
  },
];

export const PERMISSION_DESCRIPTIONS: Record<string, string> = {
  "organization:read": "permissionDesc.organizationRead",
  "organization:update": "permissionDesc.organizationUpdate",
  "organization:delete": "permissionDesc.organizationDelete",
  "member:read": "permissionDesc.memberRead",
  "member:create": "permissionDesc.memberCreate",
  "member:update": "permissionDesc.memberUpdate",
  "member:delete": "permissionDesc.memberDelete",
  "invitation:read": "permissionDesc.invitationRead",
  "invitation:create": "permissionDesc.invitationCreate",
  "invitation:cancel": "permissionDesc.invitationCancel",
  "role:read": "permissionDesc.roleRead",
  "role:create": "permissionDesc.roleCreate",
  "role:update": "permissionDesc.roleUpdate",
  "role:delete": "permissionDesc.roleDelete",
  "billing:read": "permissionDesc.billingRead",
  "billing:update": "permissionDesc.billingUpdate",
  "audit_log:read": "permissionDesc.auditLogRead",
};

export function toRolePermissions(flat: string[]): RolePermissions {
  const result: RolePermissions = {};
  for (const entry of flat) {
    const [resource, action] = entry.split(":");
    (result[resource] ??= []).push(action);
  }
  return result;
}

export function fromRolePermissions(perm: RolePermissions): string[] {
  const flat: string[] = [];
  for (const [resource, actions] of Object.entries(perm)) {
    for (const action of actions) {
      flat.push(`${resource}:${action}`);
    }
  }
  return flat;
}
