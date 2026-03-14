import { ComponentProps, ElementType } from "react";

import { GoogleIcon } from "@app/ui/components/google-icon";

export const SUPPORTED_OAUTH_PROVIDERS = ["google"] as const;
export type SupportedOAuthProvider = (typeof SUPPORTED_OAUTH_PROVIDERS)[number];

export const SUPPORTED_OATH_PROVIDER_DETAILS: Record<
  SupportedOAuthProvider,
  { name: string; Icon: ElementType<ComponentProps<"svg">> }
> = {
  google: { name: "Google", Icon: GoogleIcon },
};
