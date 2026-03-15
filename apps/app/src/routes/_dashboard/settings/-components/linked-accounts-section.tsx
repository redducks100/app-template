import { useSuspenseQuery } from "@tanstack/react-query";
import { LinkIcon, PlusIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { linkedAccountsOptions } from "@/lib/queries/user";
import { Button } from "@app/ui/components/button";
import { Separator } from "@app/ui/components/separator";

import { LinkedAccountCard } from "./linked-account-card";

interface LinkedAccountsSectionProps {
  onLinkClick?: () => void;
}

export const LinkedAccountsSection = ({ onLinkClick }: LinkedAccountsSectionProps) => {
  const { t } = useTranslation("settings");
  const { data: currentAccounts } = useSuspenseQuery(linkedAccountsOptions());

  if (currentAccounts.length === 0) {
    return (
      <div className="border border-border bg-card p-12 text-center">
        <div className="flex flex-col items-center">
          <div className="rounded-lg bg-muted p-3 text-muted-foreground">
            <LinkIcon className="size-6" />
          </div>
          <h3 className="mt-4 text-sm font-medium">{t("integrations.emptyTitle")}</h3>
          <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
            {t("integrations.noLinkedAccounts")}
          </p>
          {onLinkClick && (
            <Button variant="outline" className="mt-4" onClick={onLinkClick}>
              <PlusIcon />
              {t("integrations.connectProvider")}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {currentAccounts.map((account, index) => (
        <div key={account.providerId}>
          {index > 0 && <Separator orientation="horizontal" />}
          <LinkedAccountCard account={account} provider={account.providerId} />
        </div>
      ))}
    </div>
  );
};
