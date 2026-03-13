import type { Insertable, Updateable } from "kysely";
import type { z } from "zod";

import type { createOrganizationSchema } from "@app/shared/schemas/create-organization-schema";
import type { updateOrganizationSchema } from "@app/shared/schemas/update-organization-schema";
import type { Organization } from "@app/shared/types/db.generated";

import type { AllTrue, AssertFieldsMatch, AssertPartialFieldsMatch } from "./helpers";

type CreateOrgInput = z.output<typeof createOrganizationSchema>;
type UpdateOrgInput = z.output<typeof updateOrganizationSchema>;
type InsertableOrg = Insertable<Organization>;
type UpdateableOrg = Updateable<Organization>;

// createOrganizationSchema output fields must match Insertable<Organization>
type _CreateOrgCheck = AllTrue<AssertFieldsMatch<CreateOrgInput, InsertableOrg, ["name", "slug"]>>;

// updateOrganizationSchema output fields must match Updateable<Organization>
type _UpdateOrgCheck = AllTrue<
  AssertPartialFieldsMatch<UpdateOrgInput, UpdateableOrg, ["name", "slug"]>
>;
