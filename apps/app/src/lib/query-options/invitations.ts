import { queryOptions } from "@tanstack/react-query";
import { apiClient, callRPC } from "../api-client";

export const invitationGetOptions = (id: string) =>
  queryOptions({
    queryKey: ["invitations", "get", id],
    queryFn: async () => {
      const res = await callRPC(
        apiClient.invitations[":id"].$get({ param: { id } }),
      );
      if (!res.success) throw new Error(res.error.message);
      return res.data;
    },
  });

export const invitationsListOptions = () =>
  queryOptions({
    queryKey: ["invitations", "list"],
    queryFn: async () => {
      const res = await callRPC(apiClient.invitations.$get());
      if (!res.success) throw new Error(res.error.message);
      return res.data;
    },
  });
