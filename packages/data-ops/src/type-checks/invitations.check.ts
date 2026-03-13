import type { Insertable } from "kysely";
import type { z } from "zod";

import type { createInvitationSchema } from "@app/shared/schemas/create-invitation-schema";
import type { Invitation } from "@app/shared/types/db.generated";

import type { AllTrue, AssertFieldsMatch } from "./helpers";

type CreateInvitationInput = z.output<typeof createInvitationSchema>;
type InsertableInvitation = Insertable<Invitation>;

// createInvitationSchema output fields must match Insertable<Invitation>
type _CreateInvitationCheck = AllTrue<
  AssertFieldsMatch<CreateInvitationInput, InsertableInvitation, ["email", "role"]>
>;
