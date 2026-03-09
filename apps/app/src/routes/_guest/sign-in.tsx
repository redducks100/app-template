import { createFileRoute, redirect } from "@tanstack/react-router";
import { SignInView } from "./-components/sign-in-view";
import { z } from "zod";

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
