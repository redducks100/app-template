import { queryOptions } from "@tanstack/react-query";
import { apiClient } from "./api-client";
import { authClient } from "./auth-client";

// Auth session query
export const sessionOptions = () =>
  queryOptions({
    queryKey: ["auth", "session"],
    queryFn: async () => {
      const { data } = await authClient.getSession();
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 min — matches server cookieCache TTL
  });

// Organization queries
export const organizationsListOptions = () =>
  queryOptions({
    queryKey: ["organizations", "list"],
    queryFn: async () => {
      const res = await apiClient.organizations.list.$get();
      if (!res.ok) throw new Error("Failed to fetch organizations");
      return res.json();
    },
  });

export const activeOrganizationOptions = () =>
  queryOptions({
    queryKey: ["organizations", "active"],
    queryFn: async () => {
      const res = await apiClient.organizations.active.$get();
      if (!res.ok) throw new Error("Failed to fetch active organization");
      return res.json();
    },
  });

// Invitation queries
export const invitationGetOptions = (id: string) =>
  queryOptions({
    queryKey: ["invitations", "get", id],
    queryFn: async () => {
      const res = await apiClient.invitations.get[":id"].$get({
        param: { id },
      });
      if (!res.ok) throw new Error("Failed to fetch invitation");
      return res.json();
    },
  });

export const invitationsListOptions = () =>
  queryOptions({
    queryKey: ["invitations", "list"],
    queryFn: async () => {
      const res = await apiClient.invitations.list.$get();
      if (!res.ok) throw new Error("Failed to fetch invitations");
      return res.json();
    },
  });

// Member queries
export const membersListOptions = () =>
  queryOptions({
    queryKey: ["members", "list"],
    queryFn: async () => {
      const res = await apiClient.members.list.$get();
      if (!res.ok) throw new Error("Failed to fetch members");
      return res.json();
    },
  });

export const membersPermissionsOptions = () =>
  queryOptions({
    queryKey: ["members", "permissions"],
    queryFn: async () => {
      const res = await apiClient.members.permissions.$get();
      if (!res.ok) throw new Error("Failed to fetch permissions");
      return res.json();
    },
  });

// Role queries
export const rolesListOptions = () =>
  queryOptions({
    queryKey: ["roles", "list"],
    queryFn: async () => {
      const res = await apiClient.roles.list.$get();
      if (!res.ok) throw new Error("Failed to fetch roles");
      return res.json();
    },
  });

// User auth data queries
export const hasPasswordOptions = () =>
  queryOptions({
    queryKey: ["user", "has-password"],
    queryFn: async () => {
      const res = await apiClient.user["has-password"].$get();
      if (!res.ok) throw new Error("Failed to check password status");
      return res.json();
    },
  });

export const linkedAccountsOptions = () =>
  queryOptions({
    queryKey: ["user", "linked-accounts"],
    queryFn: async () => {
      const res = await apiClient.user["linked-accounts"].$get();
      if (!res.ok) throw new Error("Failed to fetch linked accounts");
      return res.json();
    },
  });

export const sessionsOptions = () =>
  queryOptions({
    queryKey: ["user", "sessions"],
    queryFn: async () => {
      const res = await apiClient.user.sessions.$get();
      if (!res.ok) throw new Error("Failed to fetch sessions");
      return res.json();
    },
  });
