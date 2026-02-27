import { getApiClient } from "./api-client";

// Organization mutations
export async function createOrganization(data: { name: string; slug: string }) {
  const res = await getApiClient().organizations.create.$post({ json: data });
  if (!res.ok) {
    const body = await res.json();
    throw new Error(
      "error" in body
        ? (body as { error: string }).error
        : "Failed to create organization",
    );
  }
  return res.json();
}

export async function updateOrganization(data: {
  organizationId: string;
  name: string;
  slug: string;
}) {
  const res = await getApiClient().organizations.update.$post({ json: data });
  if (!res.ok) {
    const body = await res.json();
    throw new Error(
      "error" in body
        ? (body as { error: string }).error
        : "Failed to update organization",
    );
  }
  return res.json();
}

// Invitation mutations
export async function createInvitation(data: { email: string; role: string }) {
  const res = await getApiClient().invitations.create.$post({ json: data });
  if (!res.ok) {
    const body = await res.json();
    throw new Error(
      "error" in body
        ? (body as { error: string }).error
        : "Failed to create invitation",
    );
  }
  return res.json();
}

export async function cancelInvitation(data: { invitationId: string }) {
  const res = await getApiClient().invitations.cancel.$post({ json: data });
  if (!res.ok) {
    const body = await res.json();
    throw new Error(
      "error" in body
        ? (body as { error: string }).error
        : "Failed to cancel invitation",
    );
  }
  return res.json();
}

// Member mutations
export async function updateMemberRole(data: {
  memberId: string;
  role: string;
}) {
  const res = await getApiClient().members["update-role"].$post({ json: data });
  if (!res.ok) {
    const body = await res.json();
    throw new Error(
      "error" in body
        ? (body as { error: string }).error
        : "Failed to update member role",
    );
  }
  return res.json();
}

export async function removeMember(data: { memberIdOrEmail: string }) {
  const res = await getApiClient().members.remove.$post({ json: data });
  if (!res.ok) {
    const body = await res.json();
    throw new Error(
      "error" in body
        ? (body as { error: string }).error
        : "Failed to remove member",
    );
  }
  return res.json();
}

// Role mutations
export async function createRole(data: {
  name: string;
  permission: Record<string, string[]>;
}) {
  const res = await getApiClient().roles.create.$post({ json: data });
  if (!res.ok) {
    const body = await res.json();
    throw new Error(
      "error" in body
        ? (body as { error: string }).error
        : "Failed to create role",
    );
  }
  return res.json();
}

export async function updateRole(data: {
  roleId: string;
  data: {
    roleName?: string;
    permission?: Record<string, string[]>;
  };
}) {
  const res = await getApiClient().roles.update.$post({ json: data });
  if (!res.ok) {
    const body = await res.json();
    throw new Error(
      "error" in body
        ? (body as { error: string }).error
        : "Failed to update role",
    );
  }
  return res.json();
}

export async function deleteRole(data: { roleId: string }) {
  const res = await getApiClient().roles.delete.$post({ json: data });
  if (!res.ok) {
    const body = await res.json();
    throw new Error(
      "error" in body
        ? (body as { error: string }).error
        : "Failed to delete role",
    );
  }
  return res.json();
}

// User mutations
export async function updateLanguage(data: { locale: "en" | "ro" }) {
  const res = await getApiClient().user["update-language"].$post({
    json: data,
  });
  if (!res.ok) {
    const body = await res.json();
    throw new Error(
      "error" in body
        ? (body as { error: string }).error
        : "Failed to update language",
    );
  }
  return res.json();
}
