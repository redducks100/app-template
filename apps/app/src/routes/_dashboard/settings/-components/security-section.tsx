import { useSuspenseQuery } from "@tanstack/react-query";
import { User } from "better-auth";
import { ChangePasswordForm } from "./change-password-form";
import { SendChangePasswordEmailForm } from "./send-change-password-email-form";
import { hasPasswordOptions } from "@/lib/query-options/user";

type SecuritySectionProps = {
  user: User;
};

export const SecuritySection = ({ user }: SecuritySectionProps) => {
  const { data } = useSuspenseQuery(hasPasswordOptions());

  return data.hasPassword ? (
    <ChangePasswordForm />
  ) : (
    <SendChangePasswordEmailForm email={user.email} />
  );
};
