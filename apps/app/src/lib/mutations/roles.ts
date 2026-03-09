import { apiClient, callRPC } from "../api-client";

export async function createRole(data: {
  name: string;
  permission: Record<string, string[]>;
}) {
  const res = await callRPC(apiClient.roles.$post({ json: data }));
  if (!res.success) throw new Error(res.error.message);
  return res;
}

export async function updateRole(data: {
  roleId: string;
  data: {
    roleName?: string;
    permission?: Record<string, string[]>;
  };
}) {
  const res = await callRPC(
    apiClient.roles[":id"].$patch({
      param: { id: data.roleId },
      json: { data: data.data },
    }),
  );
  if (!res.success) throw new Error(res.error.message);
  return res;
}

export async function deleteRole(data: { roleId: string }) {
  const res = await callRPC(
    apiClient.roles[":id"].$delete({
      param: { id: data.roleId },
    }),
  );
  if (!res.success) throw new Error(res.error.message);
  return res;
}
