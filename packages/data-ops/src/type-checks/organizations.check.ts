import type { Insertable, Selectable, Updateable } from "kysely";
import type { z } from "zod";

import type { createOrganizationSchema } from "@app/shared/schemas/create-organization-schema";
import type { Organization as OrgSchema } from "@app/shared/schemas/organization";
import type { updateOrganizationSchema } from "@app/shared/schemas/update-organization-schema";

import type { Organization } from "../types/db.generated";
import type {
  AllTrue,
  AssertFieldsMatch,
  AssertInputFieldsMatch,
  AssertPartialFieldsMatch,
} from "./helpers";

type CreateOrgInput = z.output<typeof createOrganizationSchema>;
type UpdateOrgInput = z.output<typeof updateOrganizationSchema>;
type InsertableOrg = Insertable<Organization>;
type UpdateableOrg = Updateable<Organization>;

// createOrganizationSchema output fields must match Insertable<Organization>
type _CreateOrgCheck = AllTrue<
  AssertInputFieldsMatch<CreateOrgInput, InsertableOrg, "name" | "slug">
>;

// updateOrganizationSchema output fields must match Updateable<Organization>
type _UpdateOrgCheck = AllTrue<
  AssertPartialFieldsMatch<UpdateOrgInput, UpdateableOrg, "name" | "slug">
>;

// Entity schema fields must match Selectable<Organization>
type SelectableOrg = Selectable<Organization>;
type OrgEntityFields = "id" | "name" | "slug" | "logo" | "createdAt" | "metadata";

type _AssertOrgEntity = AllTrue<AssertFieldsMatch<OrgSchema, SelectableOrg, OrgEntityFields>>;
