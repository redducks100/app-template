import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { CreateRoleForm } from "./-components/create-role-form";

export const Route = createFileRoute("/_app/roles/create")({
  component: CreateRolePage,
});

function CreateRolePage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="h-full flex justify-center">
        <div className="w-full max-w-6xl">
          <div className="p-4 space-y-12">
            <Suspense>
              <CreateRoleForm />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
