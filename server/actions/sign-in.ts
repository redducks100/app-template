"use server";

import { auth } from "@/lib/auth";
import { publicClient } from "@/lib/safe-action";
import { headers } from "next/headers";
import { signInSchema } from "../schemas/sign-in-schema";

export const signIn = publicClient
  .schema(signInSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    try {
      await auth.api.signInEmail({
        body: {
          email,
          password,
        },
        headers: await headers(),
      });
      return { success: true };
    } catch (error) {
      return { success: false };
    }
});
