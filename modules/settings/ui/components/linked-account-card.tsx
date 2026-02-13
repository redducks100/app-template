import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth/auth";
import { authClient } from "@/lib/auth/auth-client";
import {
  SUPPORTED_OATH_PROVIDER_DETAILS,
  SupportedOAuthProvider,
} from "@/lib/auth/constants";
import { Loader2Icon, PlusIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export type LinkedAccountCardProps = {
  provider: string;
  account?: Awaited<ReturnType<typeof auth.api.listUserAccounts>>[number];
};

export const LinkedAccountCard = ({
  provider,
  account,
}: LinkedAccountCardProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const providerDetails =
    SUPPORTED_OATH_PROVIDER_DETAILS[provider as SupportedOAuthProvider];

  function unlinkAccount() {
    if (account == null) {
      toast.error("Account not found");
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
          toast.success("Account was unlinked succesfully");
          router.refresh();
        },
        onError: (error) => {
          setLoading(false);
          toast.error(
            error.error.message ||
              "Something went wrong while unlinking the account"
          );
        },
      }
    );
  }

  function linkAccount() {
    setLoading(true);
    authClient.linkSocial(
      {
        provider: provider,
        callbackURL: "/dashboard/account",
      },
      {
        onSuccess: () => {
          setLoading(false);
          toast.success("Account was unlinked succesfully");
        },
        onError: (error) => {
          toast.error(
            error.error.message ||
              "Something went wrong while linking your account"
          );
        },
      }
    );
  }
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {<providerDetails.Icon className="size-5" />}
        <div>
          <p className="font-medium">{providerDetails.name}</p>
          {account == null ? (
            <p className="text-sm text-muted-foreground">
              Connect your {providerDetails.name} account for easier sign-in
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Linked on {account.createdAt.toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      {account == null ? (
        <Button
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={linkAccount}
        >
          {loading ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <>
              <PlusIcon />
              Link
            </>
          )}
        </Button>
      ) : (
        <Button
          variant="destructive"
          size="sm"
          disabled={loading}
          onClick={unlinkAccount}
        >
          {loading ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <>
              <Trash2Icon />
              Unlink
            </>
          )}
        </Button>
      )}
    </div>
  );
};
