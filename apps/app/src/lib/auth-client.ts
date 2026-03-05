import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";
import { ac, owner, admin, member } from "@app/shared/permissions";
import { customSessionClient } from "better-auth/client/plugins";
import type { auth } from "@app/api/lib/auth";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL,
  fetchOptions: {
    credentials: "include" as RequestCredentials,
  },
  plugins: [
    organizationClient({
      ac,
      roles: { owner, admin, member },
      dynamicAccessControl: { enabled: true },
    }),
    customSessionClient<auth>(),
  ],
});
