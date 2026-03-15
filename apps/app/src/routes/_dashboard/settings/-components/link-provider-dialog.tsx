import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { SUPPORTED_OATH_PROVIDER_DETAILS, type SupportedOAuthProvider } from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@app/ui/components/dialog";
import { LoaderButton } from "@app/ui/components/loader-button";

type LinkProviderDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unlinkedProviders: string[];
};

export const LinkProviderDialog = ({
  open,
  onOpenChange,
  unlinkedProviders,
}: LinkProviderDialogProps) => {
  const { t } = useTranslation("settings");
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  function linkAccount(provider: string) {
    setLoadingProvider(provider);
    authClient.linkSocial(
      {
        provider: provider,
        callbackURL: new URL("/settings/integrations", window.location.origin).href,
      },
      {
        onError: (error) => {
          setLoadingProvider(null);
          toast.error(error.error.message || t("integrations.linkError"));
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("integrations.linkProviderTitle")}</DialogTitle>
          <DialogDescription>{t("integrations.linkProviderDescription")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-1">
          {unlinkedProviders.map((provider) => {
            const details = SUPPORTED_OATH_PROVIDER_DETAILS[provider as SupportedOAuthProvider];
            const isLoading = loadingProvider === provider;
            return (
              <div
                key={provider}
                className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <details.Icon className="size-5" />
                  <span className="text-sm font-medium">{details.name}</span>
                </div>
                <LoaderButton
                  variant="outline"
                  size="sm"
                  loading={isLoading}
                  icon={<PlusIcon />}
                  onClick={() => linkAccount(provider)}
                >
                  {t("integrations.linkProvider")}
                </LoaderButton>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
