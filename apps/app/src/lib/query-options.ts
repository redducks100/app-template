import { queryOptions } from "@tanstack/react-query";
import {
  rolesListSchema,
  sessionsListSchema,
  membersListSchema,
  invitationsListSchema,
  invitationDetailSchema,
  linkedAccountsSchema,
} from "@app/shared/schemas/response-schemas";
import { getApiClient } from "./api-client";

// Organization queries
export const organizationsListOptions = () =>
  queryOptions({
    queryKey: ["organizations", "list"],
    queryFn: async () => {
      const res = await getApiClient().organizations.list.$get();
      if (!res.ok) throw new Error("Failed to fetch organizations");
      return res.json();
    },
  });

export const activeOrganizationOptions = () =>
  queryOptions({
    queryKey: ["organizations", "active"],
    queryFn: async () => {
      const res = await getApiClient().organizations.active.$get();
      if (!res.ok) throw new Error("Failed to fetch active organization");
      return res.json();
    },
  });

// Invitation queries
export const invitationGetOptions = (id: string) =>
  queryOptions({
    queryKey: ["invitations", "get", id],
    queryFn: async () => {
      const res = await getApiClient().invitations.get[":id"].$get({
        param: { id },
      });
      if (!res.ok) throw new Error("Invitation not found");
      const data = await res.json();
      return invitationDetailSchema.parse(data);
    },
  });

export const invitationsListOptions = () =>
  queryOptions({
    queryKey: ["invitations", "list"],
    queryFn: async () => {
      const res = await getApiClient().invitations.list.$get();
      if (!res.ok) throw new Error("Failed to fetch invitations");
      const data = await res.json();
      return invitationsListSchema.parse(data);
    },
  });

// Member queries
export const membersListOptions = () =>
  queryOptions({
    queryKey: ["members", "list"],
    queryFn: async () => {
      const res = await getApiClient().members.list.$get();
      if (!res.ok) throw new Error("Failed to fetch members");
      const data = await res.json();
      return membersListSchema.parse(data);
    },
  });

export const membersPermissionsOptions = () =>
  queryOptions({
    queryKey: ["members", "permissions"],
    queryFn: async () => {
      const res = await getApiClient().members.permissions.$get();
      if (!res.ok) throw new Error("Failed to fetch permissions");
      return res.json();
    },
  });

// Role queries
export const rolesListOptions = () =>
  queryOptions({
    queryKey: ["roles", "list"],
    queryFn: async () => {
      const res = await getApiClient().roles.list.$get();
      if (!res.ok) throw new Error("Failed to fetch roles");
      const data = await res.json();
      return rolesListSchema.parse(data);
    },
  });

// User auth data queries
export const hasPasswordOptions = () =>
  queryOptions({
    queryKey: ["user", "has-password"],
    queryFn: async () => {
      const res = await getApiClient().user["has-password"].$get();
      if (!res.ok) throw new Error("Failed to check password status");
      return res.json();
    },
  });

export const linkedAccountsOptions = () =>
  queryOptions({
    queryKey: ["user", "linked-accounts"],
    queryFn: async () => {
      const res = await getApiClient().user["linked-accounts"].$get();
      if (!res.ok) throw new Error("Failed to fetch linked accounts");
      const data = await res.json();
      return linkedAccountsSchema.parse(data);
    },
  });

export const sessionsOptions = () =>
  queryOptions({
    queryKey: ["user", "sessions"],
    queryFn: async () => {
      const res = await getApiClient().user.sessions.$get();
      if (!res.ok) throw new Error("Failed to fetch sessions");
      const data = await res.json();
      return sessionsListSchema.parse(data);
    },
  });
