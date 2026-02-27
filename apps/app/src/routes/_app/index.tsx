import { createFileRoute } from "@tanstack/react-router";
import { DashboardNavbar } from "./-components/dashboard-navbar";
import { DashboardView } from "./-components/dashboard-view";

export const Route = createFileRoute("/_app/")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <>
      <DashboardNavbar />
      <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <DashboardView />
      </main>
    </>
  );
}
