import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordView } from "./-components/reset-password-view";
import { z } from "zod";

const searchSchema = z.object({
  token: z.string().optional(),
  error: z.string().optional(),
});

export const Route = createFileRoute("/_auth/reset-password")({
  validateSearch: searchSchema,
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  return <ResetPasswordView />;
}
