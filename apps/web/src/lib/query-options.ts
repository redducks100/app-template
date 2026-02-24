import { queryOptions } from "@tanstack/react-query";
import {
  rolesListSchema,
  sessionsListSchema,
  membersListSchema,
  invitationsListSchema,
  invitationDetailSchema,
  linkedAccountsSchema,
} from "@app/shared/schemas/response-schemas";
import { apiClient } from "./api-client";

const cookieHeaders = (cookie?: string) =>
  cookie ? { headers: { cookie } } : undefined;

// Organization queries
export const organizationsListOptions = (cookie?: string) =>
  queryOptions({
    queryKey: ["organizations", "list"],
    queryFn: async () => {
      const res = await apiClient.organizations.list.$get(
        {},
        cookieHeaders(cookie),
      );
      if (!res.ok) throw new Error("Failed to fetch organizations");
      return res.json();
    },
  });

export const activeOrganizationOptions = (cookie?: string) =>
  queryOptions({
    queryKey: ["organizations", "active"],
    queryFn: async () => {
      const res = await apiClient.organizations.active.$get(
        {},
        cookieHeaders(cookie),
      );
      if (!res.ok) throw new Error("Failed to fetch active organization");
      return res.json();
    },
  });

// Invitation queries
export const invitationGetOptions = (id: string, cookie?: string) =>
  queryOptions({
    queryKey: ["invitations", "get", id],
    queryFn: async () => {
      const res = await apiClient.invitations.get[":id"].$get(
        { param: { id } },
        cookieHeaders(cookie),
      );
      if (!res.ok) throw new Error("Invitation not found");
      const data = await res.json();
      return invitationDetailSchema.parse(data);
    },
  });

export const invitationsListOptions = (cookie?: string) =>
  queryOptions({
    queryKey: ["invitations", "list"],
    queryFn: async () => {
      const res = await apiClient.invitations.list.$get(
        {},
        cookieHeaders(cookie),
      );
      if (!res.ok) throw new Error("Failed to fetch invitations");
      const data = await res.json();
      return invitationsListSchema.parse(data);
    },
  });

// Member queries
export const membersListOptions = (cookie?: string) =>
  queryOptions({
    queryKey: ["members", "list"],
    queryFn: async () => {
      const res = await apiClient.members.list.$get(
        {},
        cookieHeaders(cookie),
      );
      if (!res.ok) throw new Error("Failed to fetch members");
      const data = await res.json();
      return membersListSchema.parse(data);
    },
  });

export const membersPermissionsOptions = (cookie?: string) =>
  queryOptions({
    queryKey: ["members", "permissions"],
    queryFn: async () => {
      const res = await apiClient.members.permissions.$get(
        {},
        cookieHeaders(cookie),
      );
      if (!res.ok) throw new Error("Failed to fetch permissions");
      return res.json();
    },
  });

// Role queries
export const rolesListOptions = (cookie?: string) =>
  queryOptions({
    queryKey: ["roles", "list"],
    queryFn: async () => {
      const res = await apiClient.roles.list.$get(
        {},
        cookieHeaders(cookie),
      );
      if (!res.ok) throw new Error("Failed to fetch roles");
      const data = await res.json();
      return rolesListSchema.parse(data);
    },
  });

// User auth data queries
export const hasPasswordOptions = (cookie?: string) =>
  queryOptions({
    queryKey: ["user", "has-password"],
    queryFn: async () => {
      const res = await apiClient.user["has-password"].$get(
        {},
        cookieHeaders(cookie),
      );
      if (!res.ok) throw new Error("Failed to check password status");
      return res.json();
    },
  });

export const linkedAccountsOptions = (cookie?: string) =>
  queryOptions({
    queryKey: ["user", "linked-accounts"],
    queryFn: async () => {
      const res = await apiClient.user["linked-accounts"].$get(
        {},
        cookieHeaders(cookie),
      );
      if (!res.ok) throw new Error("Failed to fetch linked accounts");
      const data = await res.json();
      return linkedAccountsSchema.parse(data);
    },
  });

export const sessionsOptions = (cookie?: string) =>
  queryOptions({
    queryKey: ["user", "sessions"],
    queryFn: async () => {
      const res = await apiClient.user.sessions.$get(
        {},
        cookieHeaders(cookie),
      );
      if (!res.ok) throw new Error("Failed to fetch sessions");
      const data = await res.json();
      return sessionsListSchema.parse(data);
    },
  });
