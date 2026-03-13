import { organizationClient } from "better-auth/client/plugins";
import { customSessionClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import type { auth } from "@app/api/lib/auth";

import { ac, admin, member, owner } from "@app/shared/permissions";

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
