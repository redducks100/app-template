import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements, ownerAc } from "better-auth/plugins/organization/access";

const statement = {
  ...defaultStatements,
  organization: ["read", "update", "delete"],
  member: ["read", "create", "update", "delete"],
  invitation: ["read", "create", "cancel"],
  billing: ["read", "update"],
} as const;

export const ac = createAccessControl(statement);

export const owner = ac.newRole({
  ...ownerAc.statements,
  organization: ["read", "update", "delete"],
  member: ["read", "create", "update", "delete"],
  invitation: ["read", "create", "cancel"],
  billing: ["read", "update"],
});

export const admin = ac.newRole({
  ...adminAc.statements,
  organization: ["read", "update"],
  member: ["read", "create", "update", "delete"],
  invitation: ["read", "create", "cancel"],
  billing: ["read"],
});

export const member = ac.newRole({
  organization: ["read"],
  member: ["read"],
  invitation: ["read"],
});
