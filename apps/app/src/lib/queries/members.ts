import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import { MemberListItem } from "@app/shared/schemas/member";
import { DEFAULT_PAGE_SIZE } from "@app/shared/types/result";

import { apiClient, callRPC } from "../api-client";

function parseMembers<T extends { data: unknown[] }>(res: T) {
  return {
    ...res,
    data: res.data.map((item) => MemberListItem.parse(item)),
  };
}

export const membersListOptions = (params: { page: number; pageSize: number; search: string }) =>
  queryOptions({
    queryKey: ["members", "list", params],
    queryFn: async () => {
      const res = await callRPC(
        apiClient.members.$get({
          query: {
            page: params.page.toString(),
            pageSize: params.pageSize.toString(),
            search: params.search,
          },
        }),
      );
      if (!res.success) throw new Error(res.error.message);
      return parseMembers(res);
    },
  });

export const memberGetOptions = (memberId: string) =>
  queryOptions({
    queryKey: ["members", "get", memberId],
    queryFn: async () => {
      const res = await callRPC(apiClient.members[":id"].$get({ param: { id: memberId } }));
      if (!res.success) throw new Error(res.error.message);
      return MemberListItem.parse(res.data);
    },
  });

export const membersInfiniteOptions = (search: string, pageSize = DEFAULT_PAGE_SIZE) =>
  infiniteQueryOptions({
    queryKey: ["members", "list", "infinite", { search }],
    queryFn: async ({ pageParam }) => {
      const res = await callRPC(
        apiClient.members.$get({
          query: {
            page: pageParam.toString(),
            pageSize: pageSize.toString(),
            search,
          },
        }),
      );
      if (!res.success) throw new Error(res.error.message);
      return parseMembers(res);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
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
