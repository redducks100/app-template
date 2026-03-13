import type { Updateable } from "kysely";
import type { z } from "zod";

import type { updateUserProfileSchema } from "@app/shared/schemas/update-user-profile-schema";
import type { User } from "@app/shared/types/db.generated";

import type { AllTrue, AssertPartialFieldsMatch } from "./helpers";

type UpdateUserInput = z.output<typeof updateUserProfileSchema>;
type UpdateableUser = Updateable<User>;

// updateUserProfileSchema output fields must match Updateable<User>
type _UpdateUserCheck = AllTrue<
  AssertPartialFieldsMatch<UpdateUserInput, UpdateableUser, ["name", "email"]>
>;
