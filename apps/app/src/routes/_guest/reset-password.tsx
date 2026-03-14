import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { ResetPasswordView } from "./-components/reset-password-view";

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
