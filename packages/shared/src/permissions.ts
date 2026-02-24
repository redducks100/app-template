import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements,
  adminAc,
  memberAc,
  ownerAc,
} from "better-auth/plugins/organization/access";

const statement = {
  ...defaultStatements,
  organization: ["read", "update", "delete"],
  member: ["read", "create", "update", "delete"],
  invitation: ["read", "create", "cancel"],
} as const;

export const ac = createAccessControl(statement);

export const owner = ac.newRole({
  ...ownerAc.statements,
  organization: ["read", "update", "delete"],
  member: ["read", "create", "update", "delete"],
  invitation: ["read", "create", "cancel"],
});

export const admin = ac.newRole({
  ...adminAc.statements,
  organization: ["read", "update"],
  member: ["read", "create", "update", "delete"],
  invitation: ["read", "create", "cancel"],
});

export const member = ac.newRole({
  organization: ["read"],
  member: ["read"],
  invitation: ["read"],
});
