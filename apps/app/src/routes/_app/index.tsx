import { createFileRoute } from "@tanstack/react-router";
import { DashboardView } from "./-components/dashboard-view";

export const Route = createFileRoute("/_app/")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <DashboardView />
    </main>
  );
}
