"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { User } from "better-auth";
import { KeyIcon, LockIcon } from "lucide-react";
import { AccountViewCard } from "../components/account-view-card";
import { ChangePasswordForm } from "./change-password-form";
import { SendChangePasswordEmailForm } from "./send-change-password-email-form";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionCard } from "./session-card";

export const AccountSessionsCard = () => {
  const trpc = useTRPC();

  const { data: sessions } = useSuspenseQuery(
    trpc.auth.getSessions.queryOptions()
  );

  const currentSession = sessions.find((x) => x.current);
  const otherSessions = sessions.filter((x) => !x.current);

  return (
    <AccountViewCard
      title="Sessions"
      description="Manage all of your sessions"
      Icon={KeyIcon}
    >
      <div>{currentSession && <SessionCard session={currentSession} />}</div>
    </AccountViewCard>
  );
};
