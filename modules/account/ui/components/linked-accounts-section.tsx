"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { LinkIcon } from "lucide-react";
import { ViewSection } from "./view-section";
import { SUPPORTED_OAUTH_PROVIDERS } from "@/lib/auth/constants";
import {
  LinkedAccountCard,
  LinkedAccountCardProps,
} from "./linked-account-card";

export const LinkedAccountsSection = () => {
  const trpc = useTRPC();
  const { data: currentAccounts } = useSuspenseQuery(
    trpc.auth.getLinkedAccounts.queryOptions()
  );

  const currentProviders = currentAccounts.map((account) => ({
    provider: account.providerId,
    account: account,
  })) as LinkedAccountCardProps[];
  const supportedProvider = SUPPORTED_OAUTH_PROVIDERS.filter(
    (provider) =>
      !currentAccounts.find((account) => account.providerId === provider)
  ).map(
    (provider) =>
      ({
        provider: provider as string,
        account: undefined,
      }) as LinkedAccountCardProps
  );

  return (
    <ViewSection
      title="Integrations"
      description="LInk OAth providers for easier sign-in"
      Icon={LinkIcon}
    >
      {currentProviders.concat(supportedProvider).map((provider) => (
        <LinkedAccountCard
          key={provider.provider}
          account={provider.account}
          provider={provider.provider}
        />
      ))}
    </ViewSection>
  );
};
