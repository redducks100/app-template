import { queryOptions } from "@tanstack/react-query";

import { apiClient, callRPC } from "../api-client";

export const hasPasswordOptions = () =>
  queryOptions({
    queryKey: ["user", "has-password"],
    queryFn: async () => {
      const res = await callRPC(apiClient.user.password.$get());
      if (!res.success) throw new Error(res.error.message);
      return res.data;
    },
  });

export const linkedAccountsOptions = () =>
  queryOptions({
    queryKey: ["user", "linked-accounts"],
    queryFn: async () => {
      const res = await callRPC(apiClient.user["linked-accounts"].$get());
      if (!res.success) throw new Error(res.error.message);
      return res.data;
    },
  });

export const sessionsOptions = () =>
  queryOptions({
    queryKey: ["user", "sessions"],
    queryFn: async () => {
      const res = await callRPC(apiClient.user.sessions.$get());
      if (!res.success) throw new Error(res.error.message);
      return res.data;
    },
  });
