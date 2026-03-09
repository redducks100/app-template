import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { MembersSection } from "./-components/members-section";
import { membersListOptions } from "@/lib/query-options/members";

export const Route = createFileRoute("/_dashboard/users/")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(membersListOptions()),
  component: UsersPage,
});

function UsersPage() {
  return (
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
  );
}
