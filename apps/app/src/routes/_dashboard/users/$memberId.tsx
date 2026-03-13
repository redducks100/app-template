import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

import { membersListOptions, membersPermissionsOptions } from "@/lib/queries/members";

import { MemberDetail } from "./-components/member-detail";

export const Route = createFileRoute("/_dashboard/users/$memberId")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(membersListOptions()),
      context.queryClient.ensureQueryData(membersPermissionsOptions()),
    ]),
  component: MemberDetailPage,
});

function MemberDetailPage() {
  const { memberId } = Route.useParams();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="h-full flex justify-center">
        <div className="w-full max-w-screen-2xl">
          <div className="p-4 space-y-6 animate-in-page">
            <Suspense>
              <MemberDetail memberId={memberId} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
