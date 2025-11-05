"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { User } from "better-auth";
import { LockIcon } from "lucide-react";
import { ViewSection } from "./view-section";
import { ChangePasswordForm } from "./change-password-form";
import { SendChangePasswordEmailForm } from "./send-change-password-email-form";

type SecuritySectionProps = {
  user: User;
};

export const SecuritySection = ({ user }: SecuritySectionProps) => {
  const trpc = useTRPC();

  const { data: hasPasswordAccount } = useSuspenseQuery(
    trpc.auth.hasPasswordAccount.queryOptions()
  );

  return (
    <ViewSection
      title="Security"
      description="Keep your account secure"
      Icon={LockIcon}
    >
      {hasPasswordAccount ? (
        <ChangePasswordForm />
      ) : (
        <SendChangePasswordEmailForm email={user.email} />
      )}
    </ViewSection>
  );
};
