import { createFileRoute } from "@tanstack/react-router";
import { SignUpView } from "./-components/sign-up-view";

export const Route = createFileRoute("/_auth/sign-up")({
  component: SignUpView,
});
