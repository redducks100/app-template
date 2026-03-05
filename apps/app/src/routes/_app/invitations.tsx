import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { InvitationsSection } from "./-components/invitations-section";
import { invitationsListOptions, rolesListOptions } from "@/lib/query-options";

export const Route = createFileRoute("/_app/invitations")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(invitationsListOptions()),
      context.queryClient.ensureQueryData(rolesListOptions()),
    ]),
  component: InvitationsPage,
});

function InvitationsPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="h-full flex justify-center">
        <div className="w-full max-w-6xl">
          <div className="p-4 space-y-12">
            <Suspense>
              <InvitationsSection />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
