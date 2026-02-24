export type RolePermissions = Record<string, string[]>;

export type { RoleData } from "../schemas/response-schemas";

export const PERMISSION_MAP: Record<string, string[]> = {
  organization: ["read", "update", "delete"],
  member: ["read", "create", "update", "delete"],
  invitation: ["read", "create", "cancel"],
};

export const RESOURCE_TRANSLATION_KEY: Record<string, string> = {
  organization: "organization",
  member: "members",
  invitation: "invitations",
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
