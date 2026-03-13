import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

import { SignInView } from "./-components/sign-in-view";

const searchSchema = z.object({
  callbackURL: z.string().catch("/"),
});

export const Route = createFileRoute("/_guest/sign-in")({
  validateSearch: searchSchema,
  beforeLoad: ({ context }) => {
    if (context.authData) throw redirect({ to: "/" });
  },
  component: SignInView,
});
