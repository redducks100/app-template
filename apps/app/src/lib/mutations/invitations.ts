import { apiClient, callRPC } from "../api-client";

export async function createInvitation(data: { email: string; role: string }) {
  const res = await callRPC(apiClient.invitations.$post({ json: data }));
  if (!res.success) throw new Error(res.error.message);
  return res;
}

export async function cancelInvitation(data: { invitationId: string }) {
  const res = await callRPC(
    apiClient.invitations[":id"].$delete({
      param: { id: data.invitationId },
    }),
  );
  if (!res.success) throw new Error(res.error.message);
  return res;
}
