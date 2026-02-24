import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_protected/dashboard/settings/",
)({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard/settings/profile" });
  },
});
