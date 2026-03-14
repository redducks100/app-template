import { apiClient, callRPC } from "../api-client";

export async function updateMemberRole(data: { memberId: string; role: string }) {
  const res = await callRPC(
    apiClient.members[":id"].role.$patch({
      param: { id: data.memberId },
      json: { role: data.role },
    }),
  );
  if (!res.success) throw new Error(res.error.message);
  return res;
}

export async function removeMember(data: { memberIdOrEmail: string }) {
  const res = await callRPC(
    apiClient.members[":id"].$delete({
      param: { id: data.memberIdOrEmail },
    }),
  );
  if (!res.success) throw new Error(res.error.message);
  return res;
}
