import { queryOptions } from "@tanstack/react-query";
import { apiClient, callRPC } from "../api-client";

export const rolesListOptions = () =>
  queryOptions({
    queryKey: ["roles", "list"],
    queryFn: async () => {
      const res = await callRPC(apiClient.roles.$get());
      if (!res.success) throw new Error(res.error.message);
      return res.data;
    },
  });
