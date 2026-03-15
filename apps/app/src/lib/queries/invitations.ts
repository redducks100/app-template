import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import { InvitationListItem } from "@app/shared/schemas/invitation";
import { DEFAULT_PAGE_SIZE } from "@app/shared/types/result";

import { apiClient, callRPC } from "../api-client";

function parseInvitations<T extends { data: unknown[] }>(res: T) {
  return {
    ...res,
    data: res.data.map((item) => InvitationListItem.parse(item)),
  };
}

export const invitationGetOptions = (id: string) =>
  queryOptions({
    queryKey: ["invitations", "get", id],
    queryFn: async () => {
      const res = await callRPC(apiClient.invitations[":id"].$get({ param: { id } }));
      if (!res.success) throw new Error(res.error.message);
      return res.data;
    },
  });

export const invitationsListOptions = (params: {
  page: number;
  pageSize: number;
  search: string;
}) =>
  queryOptions({
    queryKey: ["invitations", "list", params],
    queryFn: async () => {
      const res = await callRPC(
        apiClient.invitations.$get({
          query: {
            page: params.page.toString(),
            pageSize: params.pageSize.toString(),
            search: params.search,
          },
        }),
      );
      if (!res.success) throw new Error(res.error.message);
      return parseInvitations(res);
    },
  });

export const invitationsInfiniteOptions = (search: string, pageSize = DEFAULT_PAGE_SIZE) =>
  infiniteQueryOptions({
    queryKey: ["invitations", "list", "infinite", { search }],
    queryFn: async ({ pageParam }) => {
      const res = await callRPC(
        apiClient.invitations.$get({
          query: {
            page: pageParam.toString(),
            pageSize: pageSize.toString(),
            search,
          },
        }),
      );
      if (!res.success) throw new Error(res.error.message);
      return parseInvitations(res);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });

export const invitationsCountOptions = () =>
  queryOptions({
    queryKey: ["invitations", "count"],
    queryFn: async () => {
      const res = await callRPC(apiClient.invitations.count.$get());
      if (!res.success) throw new Error(res.error.message);
      return res.data.count;
    },
  });

export const invitationPermissionsOptions = () =>
  queryOptions({
    queryKey: ["invitations", "permissions"],
    queryFn: async () => {
      const res = await callRPC(apiClient.invitations.permissions.$get());
      if (!res.success) throw new Error(res.error.message);
      return res.data;
    },
  });
