import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";
import { ac, owner, admin, member } from "@app/shared/permissions";
import { customSessionClient } from "better-auth/client/plugins";
import type { auth } from "@app/api/lib/auth";

export const authClient = createAuthClient({
  baseURL:
    typeof window === "undefined"
      ? process.env.BETTER_AUTH_URL!
      : window.location.origin,
  plugins: [
    organizationClient({
      ac,
      roles: { owner, admin, member },
      dynamicAccessControl: { enabled: true },
    }),
    customSessionClient<typeof auth>(),
  ],
});
