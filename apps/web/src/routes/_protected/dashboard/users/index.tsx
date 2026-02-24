import { createFileRoute } from "@tanstack/react-router";
import { DashboardNavbar } from "../-components/dashboard-navbar";
import { Suspense } from "react";
import { MembersSection } from "./-components/members-section";
import { membersListOptions } from "@/lib/query-options";

export const Route = createFileRoute("/_protected/dashboard/users/")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(membersListOptions(context.cookie)),
  component: UsersPage,
});

function UsersPage() {
  return (
    <>
      <DashboardNavbar />
      <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="h-full flex justify-center">
          <div className="w-full max-w-6xl">
            <div className="p-4 space-y-12">
              <Suspense>
                <MembersSection />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
