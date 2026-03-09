import { apiClient, callRPC } from "../api-client";

export async function revokeSession(data: { token: string }) {
  const res = await callRPC(
    apiClient.user.sessions[":token"].$delete({
      param: { token: data.token },
    }),
  );
  if (!res.success) throw new Error(res.error.message);
  return res;
}

export async function revokeOtherSessions() {
  const res = await callRPC(apiClient.user.sessions.others.$delete());
  if (!res.success) throw new Error(res.error.message);
  return res;
}

export async function updateLanguage(data: { locale: "en" | "ro" }) {
  const res = await callRPC(apiClient.user.language.$patch({ json: data }));
  if (!res.success) throw new Error(res.error.message);
  return res;
}

export async function uploadAvatar(data: { image: string }) {
  const res = await callRPC(apiClient.user.avatar.$put({ json: data }));
  if (!res.success) throw new Error(res.error.message);
  return res;
}

export async function removeAvatar() {
  const res = await callRPC(apiClient.user.avatar.$delete());
  if (!res.success) throw new Error(res.error.message);
  return res;
}
