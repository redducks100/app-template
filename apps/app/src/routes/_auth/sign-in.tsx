import { createFileRoute } from "@tanstack/react-router";
import { SignInView } from "./-components/sign-in-view";

type SignInSearch = {
  callbackURL?: string | undefined;
};

export const Route = createFileRoute("/_auth/sign-in")({
  component: SignInView,
  validateSearch: (search: Record<string, unknown>): SignInSearch => {
    return {
      callbackURL: (search?.callbackUrl as string) || undefined,
    };
  },
});
