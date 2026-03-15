import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { Suspense, useState } from "react";
import { useTranslation } from "react-i18next";

import { SUPPORTED_OAUTH_PROVIDERS } from "@/lib/constants";
import { linkedAccountsOptions } from "@/lib/queries/user";
import { Button } from "@app/ui/components/button";

import { LinkProviderDialog } from "./-components/link-provider-dialog";
import { LinkedAccountsSection } from "./-components/linked-accounts-section";

export const Route = createFileRoute("/_dashboard/settings/integrations")({
  loader: ({ context }) => context.queryClient.ensureQueryData(linkedAccountsOptions()),
  component: SettingsIntegrationsPage,
});

function SettingsIntegrationsPage() {
  const { t } = useTranslation("settings");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: currentAccounts } = useSuspenseQuery(linkedAccountsOptions());

  const unlinkedProviders = SUPPORTED_OAUTH_PROVIDERS.filter(
    (provider) => !currentAccounts.find((account) => account.providerId === provider),
  ) as string[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{t("integrations.title")}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t("integrations.description")}</p>
        </div>
        {unlinkedProviders.length > 0 && (
          <Button variant="outline" onClick={() => setDialogOpen(true)}>
            <PlusIcon />
            {t("integrations.linkProvider")}
          </Button>
        )}
      </div>
      <Suspense>
        <LinkedAccountsSection
          onLinkClick={unlinkedProviders.length > 0 ? () => setDialogOpen(true) : undefined}
        />
      </Suspense>
      <LinkProviderDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        unlinkedProviders={unlinkedProviders}
      />
    </div>
  );
}
