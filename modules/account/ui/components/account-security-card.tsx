"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { User } from "better-auth";
import { LockIcon } from "lucide-react";
import { AccountViewCard } from "../components/account-view-card";
import { ChangePasswordForm } from "./change-password-form";
import { SendChangePasswordEmailForm } from "./send-change-password-email-form";

type AccountSecurityCardProps = {
  user: User;
};

export const AccountSecurityCard = ({ user }: AccountSecurityCardProps) => {
  const trpc = useTRPC();

  const { data: hasPasswordAccount } = useSuspenseQuery(
    trpc.auth.hasPasswordAccount.queryOptions()
  );

  return (
    <AccountViewCard
      title="Security"
      description="Keep your account secure"
      Icon={LockIcon}
    >
      {hasPasswordAccount ? (
        <ChangePasswordForm />
      ) : (
        <SendChangePasswordEmailForm email={user.email} />
      )}
    </AccountViewCard>
  );
};
