import { apiClient, callRPC } from "../api-client";

export async function createOrganization(data: { name: string; slug: string }) {
  const res = await callRPC(apiClient.organizations.$post({ json: data }));
  if (!res.success) throw new Error(res.error.message);
  return res;
}

export async function updateOrganization(data: {
  organizationId: string;
  name: string;
  slug: string;
}) {
  const { organizationId, ...json } = data;
  const res = await callRPC(
    apiClient.organizations[":id"].$patch({
      param: { id: organizationId },
      json,
    }),
  );
  if (!res.success) throw new Error(res.error.message);
  return res;
}
