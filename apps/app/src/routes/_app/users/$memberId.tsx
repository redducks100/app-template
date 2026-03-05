import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { MemberDetail } from "./-components/member-detail";
import {
  membersListOptions,
  membersPermissionsOptions,
  rolesListOptions,
} from "@/lib/query-options";

export const Route = createFileRoute(
  "/_app/users/$memberId",
)({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(membersListOptions()),
      context.queryClient.ensureQueryData(membersPermissionsOptions()),
      context.queryClient.ensureQueryData(rolesListOptions()),
    ]),
  component: MemberDetailPage,
});

function MemberDetailPage() {
  const { memberId } = Route.useParams();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="h-full flex justify-center">
        <div className="w-full max-w-6xl">
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
