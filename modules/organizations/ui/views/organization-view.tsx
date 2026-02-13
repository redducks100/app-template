import { getQueryClient, trpc } from "@/trpc/server";

export const OrganizationView = async () => {
  const queryClient = getQueryClient();
  return <div className="p-4 space-y-12"></div>;
};
