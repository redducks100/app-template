import type { Selectable, Updateable } from "kysely";
import type { z } from "zod";

import type { MemberListItem, MemberUser } from "@app/shared/schemas/member";
import type { updateUserProfileSchema } from "@app/shared/schemas/update-user-profile-schema";

import type { Member, User } from "../types/db.generated";
import type { AllTrue, AssertFieldsMatch, AssertPartialFieldsMatch } from "./helpers";

type UpdateUserInput = z.output<typeof updateUserProfileSchema>;
type UpdateableUser = Updateable<User>;

// updateUserProfileSchema output fields must match Updateable<User>
type _UpdateUserCheck = AllTrue<
  AssertPartialFieldsMatch<UpdateUserInput, UpdateableUser, "name" | "email">
>;

// MemberUser entity schema fields must match Selectable<User>
type SelectableUser = Selectable<User>;
type MemberUserFields = "id" | "name" | "email" | "image";

type _AssertMemberUser = AllTrue<AssertFieldsMatch<MemberUser, SelectableUser, MemberUserFields>>;

// MemberListItem DTO fields must match Selectable<Member> and Selectable<User>
type SelectableMember = Selectable<Member>;
type _AssertMemberListItem = AllTrue<
  AssertFieldsMatch<MemberListItem, SelectableMember, "id" | "userId" | "role" | "createdAt">
>;
type _AssertMemberListItemUser = AllTrue<
  AssertFieldsMatch<MemberListItem["user"], SelectableUser, "name" | "email" | "image">
>;
