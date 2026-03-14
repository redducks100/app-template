import { useSuspenseQuery } from "@tanstack/react-query";
import { User } from "better-auth";

import { hasPasswordOptions } from "@/lib/queries/user";

import { ChangePasswordForm } from "./change-password-form";
import { SendChangePasswordEmailForm } from "./send-change-password-email-form";

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
