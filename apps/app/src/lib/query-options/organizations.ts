import { queryOptions } from "@tanstack/react-query";
import { apiClient, callRPC } from "../api-client";

export const organizationsListOptions = () =>
  queryOptions({
    queryKey: ["organizations", "list"],
    queryFn: async () => {
      const res = await callRPC(apiClient.organizations.$get());
      if (!res.success) throw new Error(res.error.message);
      return res.data;
    },
  });

export const activeOrganizationOptions = () =>
  queryOptions({
    queryKey: ["organizations", "active"],
    queryFn: async () => {
      const res = await callRPC(apiClient.organizations.active.$get());
      if (!res.success) throw new Error(res.error.message);
      return res.data;
    },
  });
