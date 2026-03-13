import type { Insertable, Selectable, Updateable } from "kysely";

import type * as DB from "./db.generated";

// Selectable types (query results)
export type User = Selectable<DB.User>;
export type Session = Selectable<DB.Session>;
export type Account = Selectable<DB.Account>;
export type Verification = Selectable<DB.Verification>;
export type Organization = Selectable<DB.Organization>;
export type Member = Selectable<DB.Member>;
export type Invitation = Selectable<DB.Invitation>;
export type OrganizationRole = Selectable<DB.OrganizationRole>;
export type RateLimit = Selectable<DB.RateLimit>;

// Insertable types
export type NewUser = Insertable<DB.User>;
export type NewOrganization = Insertable<DB.Organization>;
export type NewMember = Insertable<DB.Member>;
export type NewInvitation = Insertable<DB.Invitation>;
export type NewOrganizationRole = Insertable<DB.OrganizationRole>;

// Updateable types
export type UserUpdate = Updateable<DB.User>;
export type OrganizationUpdate = Updateable<DB.Organization>;
export type MemberUpdate = Updateable<DB.Member>;
export type OrganizationRoleUpdate = Updateable<DB.OrganizationRole>;
