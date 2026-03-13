import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { z } from "zod";

import { invitationsListOptions } from "@/lib/queries/invitations";

import { InvitationsSection } from "./-components/invitations-section";

const searchSchema = z.object({
  page: z.number().catch(1),
});

export const Route = createFileRoute("/_dashboard/invitations")({
  validateSearch: searchSchema,
  loader: ({ context }) => context.queryClient.ensureQueryData(invitationsListOptions()),
  component: InvitationsPage,
});

function InvitationsPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="h-full flex justify-center">
        <div className="w-full max-w-screen-2xl">
          <div className="p-4 space-y-6">
            <Suspense>
              <InvitationsSection />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
