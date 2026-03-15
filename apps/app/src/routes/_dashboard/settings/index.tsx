import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/settings/")({
  beforeLoad: () => {
    throw redirect({ to: "/settings/general" });
  },
});
