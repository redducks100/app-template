import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { RoleDetail } from "./-components/role-detail";
import {
  rolesListOptions,
  activeOrganizationOptions,
} from "@/lib/query-options";

export const Route = createFileRoute("/_app/roles/$roleId")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(rolesListOptions()),
      context.queryClient.ensureQueryData(activeOrganizationOptions()),
    ]),
  component: RoleDetailPage,
});

function RoleDetailPage() {
  const { roleId } = Route.useParams();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="h-full flex justify-center">
        <div className="w-full max-w-6xl">
          <div className="p-4 space-y-12">
            <Suspense>
              <RoleDetail roleId={roleId} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
