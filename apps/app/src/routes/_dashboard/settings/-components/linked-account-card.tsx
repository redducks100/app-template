import { useQueryClient } from "@tanstack/react-query";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { SUPPORTED_OATH_PROVIDER_DETAILS, SupportedOAuthProvider } from "@/lib/constants";
import { LoaderButton } from "@app/ui/components/loader-button";

export type LinkedAccountCardProps = {
  provider: string;
  account?: {
    accountId: string;
    providerId: string;
    createdAt: string;
  };
};

export const LinkedAccountCard = ({ provider, account }: LinkedAccountCardProps) => {
  const { t } = useTranslation("settings");
  const [loading, setLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const providerDetails = SUPPORTED_OATH_PROVIDER_DETAILS[provider as SupportedOAuthProvider];

  function unlinkAccount() {
    if (account == null) {
      toast.error(t("integrations.accountNotFound"));
      return;
    }
    setLoading(true);
    authClient.unlinkAccount(
      {
        accountId: account.accountId,
        providerId: provider,
      },
      {
        onSuccess: () => {
          setLoading(false);
          toast.success(t("integrations.unlinkSuccess"));
          queryClient.invalidateQueries({
            queryKey: ["user", "linked-accounts"],
          });
        },
        onError: (error) => {
          setLoading(false);
          toast.error(error.error.message || t("integrations.unlinkError"));
        },
      },
    );
  }

  function linkAccount() {
    setLoading(true);
    authClient.linkSocial(
      {
        provider: provider,
        callbackURL: new URL("/settings/integrations", window.location.origin).href,
      },
      {
        onError: (error) => {
          setLoading(false);
          toast.error(error.error.message || t("integrations.linkError"));
        },
      },
    );
  }
  return (
    <div className="flex items-center justify-between p-6">
      <div className="flex items-center space-x-3">
        {<providerDetails.Icon className="size-5" />}
        <div>
          <p className="text-sm font-medium">{providerDetails.name}</p>
          {account == null ? (
            <p className="text-sm text-muted-foreground">
              {t("integrations.connectDescription", { provider: providerDetails.name })}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t("integrations.linkedOn", {
                date: new Date(account.createdAt).toLocaleDateString(),
              })}
            </p>
          )}
        </div>
      </div>
      {account == null ? (
        <LoaderButton
          variant="outline"
          size="sm"
          loading={loading}
          icon={<PlusIcon />}
          onClick={linkAccount}
        >
          {t("integrations.link")}
        </LoaderButton>
      ) : (
        <LoaderButton
          variant="destructive"
          size="sm"
          loading={loading}
          icon={<Trash2Icon />}
          onClick={unlinkAccount}
        >
          {t("integrations.unlink")}
        </LoaderButton>
      )}
    </div>
  );
};
