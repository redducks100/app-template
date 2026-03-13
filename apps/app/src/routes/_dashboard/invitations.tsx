import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { Suspense } from "react";
import { z } from "zod";

import { invitationsListOptions } from "@/lib/queries/invitations";
import { DEFAULT_PAGE_SIZE } from "@app/shared/types/result";

import { InvitationsSection } from "./-components/invitations-section";

const searchDefaults = { page: 1, search: "" } as const;

const searchSchema = z.object({
  page: z.number().default(1).catch(1),
  search: z.string().default("").catch(""),
});

export const Route = createFileRoute("/_dashboard/invitations")({
  validateSearch: searchSchema,
  search: {
    middlewares: [stripSearchParams(searchDefaults)],
  },
  loaderDeps: ({ search: { page, search } }) => ({ page, search }),
  loader: ({ context, deps }) =>
    context.queryClient.ensureQueryData(
      invitationsListOptions({ page: deps.page, pageSize: DEFAULT_PAGE_SIZE, search: deps.search }),
    ),
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
