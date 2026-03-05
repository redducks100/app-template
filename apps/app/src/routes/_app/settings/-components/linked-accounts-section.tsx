import { Separator } from "@/components/ui/separator";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SUPPORTED_OAUTH_PROVIDERS } from "@/lib/constants";
import {
  LinkedAccountCard,
  LinkedAccountCardProps,
} from "./linked-account-card";
import { linkedAccountsOptions } from "@/lib/query-options";

export const LinkedAccountsSection = () => {
  const { data: currentAccounts } = useSuspenseQuery(linkedAccountsOptions());

  const currentProviders = currentAccounts.map((account) => ({
    provider: account.providerId,
    account: account,
  })) as LinkedAccountCardProps[];
  const supportedProvider = SUPPORTED_OAUTH_PROVIDERS.filter(
    (provider) =>
      !currentAccounts.find((account) => account.providerId === provider),
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
          <LinkedAccountCard
            account={provider.account}
            provider={provider.provider}
          />
        </div>
      ))}
    </div>
  );
};
