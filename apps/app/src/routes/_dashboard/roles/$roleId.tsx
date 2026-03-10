import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { RoleDetail } from "./-components/role-detail";
import { rolesListOptions, rolePermissionsOptions } from "@/lib/query-options/roles";

export const Route = createFileRoute("/_dashboard/roles/$roleId")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(rolesListOptions()),
      context.queryClient.ensureQueryData(rolePermissionsOptions()),
    ]),
  component: RoleDetailPage,
});

function RoleDetailPage() {
  const { roleId } = Route.useParams();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="h-full flex justify-center">
        <div className="w-full max-w-6xl">
          <div className="p-4 space-y-6">
            <Suspense>
              <RoleDetail roleId={roleId} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
