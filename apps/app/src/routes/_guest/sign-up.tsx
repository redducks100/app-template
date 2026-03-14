import { createFileRoute, redirect } from "@tanstack/react-router";

import { SignUpView } from "./-components/sign-up-view";

export const Route = createFileRoute("/_guest/sign-up")({
  beforeLoad: ({ context }) => {
    if (context.authData) throw redirect({ to: "/" });
  },
  component: SignUpView,
});
