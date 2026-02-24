import { useSuspenseQuery } from "@tanstack/react-query";
import { User } from "better-auth";
import { ChangePasswordForm } from "./change-password-form";
import { SendChangePasswordEmailForm } from "./send-change-password-email-form";
import { hasPasswordOptions } from "@/lib/query-options";

type SecuritySectionProps = {
  user: User;
};

export const SecuritySection = ({ user }: SecuritySectionProps) => {
  const { data: hasPasswordAccount } = useSuspenseQuery(hasPasswordOptions());

  return hasPasswordAccount ? (
    <ChangePasswordForm />
  ) : (
    <SendChangePasswordEmailForm email={user.email} />
  );
};
