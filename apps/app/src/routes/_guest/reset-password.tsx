import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordView } from "./-components/reset-password-view";
import { z } from "zod";

const searchSchema = z.object({
  token: z.string().optional().catch(undefined),
  error: z.string().optional().catch(undefined),
});

export const Route = createFileRoute("/_guest/reset-password")({
  validateSearch: searchSchema,
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  return <ResetPasswordView />;
}
