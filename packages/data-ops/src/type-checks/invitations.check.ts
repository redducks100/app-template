import type { Insertable, Selectable } from "kysely";
import type { z } from "zod";

import type { createInvitationSchema } from "@app/shared/schemas/create-invitation-schema";
import type {
  InvitationListItem,
  Invitation as InvitationSchema,
} from "@app/shared/schemas/invitation";

import type { Invitation } from "../types/db.generated";
import type { AllTrue, AssertFieldsMatch, AssertInputFieldsMatch } from "./helpers";

type CreateInvitationInput = z.output<typeof createInvitationSchema>;
type InsertableInvitation = Insertable<Invitation>;

// createInvitationSchema output fields must match Insertable<Invitation>
type _CreateInvitationCheck = AllTrue<
  AssertInputFieldsMatch<CreateInvitationInput, InsertableInvitation, "email" | "role">
>;

// Entity schema fields must match Selectable<Invitation>
type SelectableInvitation = Selectable<Invitation>;
type InvitationEntityFields =
  | "id"
  | "organizationId"
  | "email"
  | "role"
  | "status"
  | "expiresAt"
  | "inviterId"
  | "createdAt";

type _AssertInvitationEntity = AllTrue<
  AssertFieldsMatch<InvitationSchema, SelectableInvitation, InvitationEntityFields>
>;

// InvitationListItem DTO fields must match Selectable<Invitation>
type _AssertInvitationListItem = AllTrue<
  AssertFieldsMatch<
    InvitationListItem,
    SelectableInvitation,
    "id" | "email" | "role" | "status" | "expiresAt"
  >
>;
