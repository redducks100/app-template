import { apiClient } from "./api-client";

async function extractError(res: Response, fallback: string): Promise<never> {
  const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  throw new Error("error" in body ? String(body.error) : fallback);
}

// Organization mutations
export async function createOrganization(data: {
  name: string;
  slug: string;
}) {
  const res = await apiClient.organizations.create.$post({ json: data });
  if (!res.ok) return extractError(res, "Failed to create organization");
  return res.json();
}

export async function updateOrganization(data: {
  organizationId: string;
  name: string;
  slug: string;
}) {
  const res = await apiClient.organizations.update.$post({ json: data });
  if (!res.ok) return extractError(res, "Failed to update organization");
  return res.json();
}

// Invitation mutations
export async function createInvitation(data: {
  email: string;
  role: string;
}) {
  const res = await apiClient.invitations.create.$post({ json: data });
  if (!res.ok) return extractError(res, "Failed to create invitation");
  return res.json();
}

export async function cancelInvitation(data: { invitationId: string }) {
  const res = await apiClient.invitations.cancel.$post({ json: data });
  if (!res.ok) return extractError(res, "Failed to cancel invitation");
  return res.json();
}

// Member mutations
export async function updateMemberRole(data: {
  memberId: string;
  role: string;
}) {
  const res = await apiClient.members["update-role"].$post({ json: data });
  if (!res.ok) return extractError(res, "Failed to update member role");
  return res.json();
}

export async function removeMember(data: { memberIdOrEmail: string }) {
  const res = await apiClient.members.remove.$post({ json: data });
  if (!res.ok) return extractError(res, "Failed to remove member");
  return res.json();
}

// Role mutations
export async function createRole(data: {
  name: string;
  permission: Record<string, string[]>;
}) {
  const res = await apiClient.roles.create.$post({ json: data });
  if (!res.ok) return extractError(res, "Failed to create role");
  return res.json();
}

export async function updateRole(data: {
  roleId: string;
  data: {
    roleName?: string;
    permission?: Record<string, string[]>;
  };
}) {
  const res = await apiClient.roles.update.$post({ json: data });
  if (!res.ok) return extractError(res, "Failed to update role");
  return res.json();
}

export async function deleteRole(data: { roleId: string }) {
  const res = await apiClient.roles.delete.$post({ json: data });
  if (!res.ok) return extractError(res, "Failed to delete role");
  return res.json();
}

// Session mutations
export async function revokeSession(data: { token: string }) {
  const res = await apiClient.user.sessions.revoke.$post({ json: data });
  if (!res.ok) return extractError(res, "Failed to revoke session");
  return res.json();
}

export async function revokeOtherSessions() {
  const res = await apiClient.user.sessions["revoke-others"].$post();
  if (!res.ok) return extractError(res, "Failed to revoke other sessions");
  return res.json();
}

// User mutations
export async function updateLanguage(data: { locale: "en" | "ro" }) {
  const res = await apiClient.user["update-language"].$post({ json: data });
  if (!res.ok) return extractError(res, "Failed to update language");
  return res.json();
}
