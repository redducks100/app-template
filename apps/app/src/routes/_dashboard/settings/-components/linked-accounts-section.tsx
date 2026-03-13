import { useSuspenseQuery } from "@tanstack/react-query";

import { Separator } from "@app/ui/components/separator";
import { SUPPORTED_OAUTH_PROVIDERS } from "@/lib/constants";
import { linkedAccountsOptions } from "@/lib/queries/user";

import { LinkedAccountCard, LinkedAccountCardProps } from "./linked-account-card";

export const LinkedAccountsSection = () => {
  const { data: currentAccounts } = useSuspenseQuery(linkedAccountsOptions());

  const currentProviders = currentAccounts.map((account) => ({
    provider: account.providerId,
    account: account,
  })) as LinkedAccountCardProps[];
  const supportedProvider = SUPPORTED_OAUTH_PROVIDERS.filter(
    (provider) => !currentAccounts.find((account) => account.providerId === provider),
  ).map(
    (provider) =>
      ({
        provider: provider as string,
        account: undefined,
      }) as LinkedAccountCardProps,
  );

  const allProviders = currentProviders.concat(supportedProvider);

  return (
    <div className="rounded-xl border border-border bg-card">
      {allProviders.map((provider, index) => (
        <div key={provider.provider}>
          {index > 0 && <Separator orientation="horizontal" />}
          <LinkedAccountCard account={provider.account} provider={provider.provider} />
        </div>
      ))}
    </div>
  );
};
