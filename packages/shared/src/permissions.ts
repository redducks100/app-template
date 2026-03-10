import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements,
  adminAc,
  ownerAc,
} from "better-auth/plugins/organization/access";

const statement = {
  ...defaultStatements,
  organization: ["read", "update", "delete"],
  member: ["read", "create", "update", "delete"],
  invitation: ["read", "create", "cancel"],
  role: ["read", "create", "update", "delete"],
  billing: ["read", "update"],
  audit_log: ["read"],
} as const;

export const ac = createAccessControl(statement);

export const owner = ac.newRole({
  ...ownerAc.statements,
  organization: ["read", "update", "delete"],
  member: ["read", "create", "update", "delete"],
  invitation: ["read", "create", "cancel"],
  role: ["read", "create", "update", "delete"],
  billing: ["read", "update"],
  audit_log: ["read"],
});

export const admin = ac.newRole({
  ...adminAc.statements,
  organization: ["read", "update"],
  member: ["read", "create", "update", "delete"],
  invitation: ["read", "create", "cancel"],
  role: ["read"],
  billing: ["read"],
  audit_log: ["read"],
});

export const member = ac.newRole({
  organization: ["read"],
  member: ["read"],
  invitation: ["read"],
  role: ["read"],
});
