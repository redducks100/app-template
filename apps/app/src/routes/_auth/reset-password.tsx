import { createFileRoute, redirect } from "@tanstack/react-router";
import { ResetPasswordView } from "./-components/reset-password-view";
import { z } from "zod";

const searchSchema = z.object({
  token: z.string().optional().catch(undefined),
  error: z.string().optional().catch(undefined),
});

export const Route = createFileRoute("/_auth/reset-password")({
  validateSearch: searchSchema,
  beforeLoad: ({ context }) => {
    if (context.authData) throw redirect({ to: "/" });
  },
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  return <ResetPasswordView />;
}
