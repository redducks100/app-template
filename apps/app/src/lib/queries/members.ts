import { queryOptions } from "@tanstack/react-query";

import { apiClient, callRPC } from "../api-client";

export const membersListOptions = () =>
  queryOptions({
    queryKey: ["members", "list"],
    queryFn: async () => {
      const res = await callRPC(apiClient.members.$get());
      if (!res.success) throw new Error(res.error.message);
      return res.data;
    },
  });

export const membersPermissionsOptions = () =>
  queryOptions({
    queryKey: ["members", "permissions"],
    queryFn: async () => {
      const res = await callRPC(apiClient.members.permissions.$get());
      if (!res.success) throw new Error(res.error.message);
      return res.data;
    },
  });
