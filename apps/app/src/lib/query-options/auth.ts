import { queryOptions } from "@tanstack/react-query";
import { authClient } from "../auth-client";

export const sessionOptions = () =>
  queryOptions({
    queryKey: ["auth", "session"],
    queryFn: async () => {
      const { data } = await authClient.getSession();
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 min — matches server cookieCache TTL
  });
