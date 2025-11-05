"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { User } from "better-auth";
import { KeyIcon, LockIcon } from "lucide-react";
import { AccountViewCard } from "../components/account-view-card";
import { ChangePasswordForm } from "./change-password-form";
import { SendChangePasswordEmailForm } from "./send-change-password-email-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionCard } from "./session-card";
import { Button } from "@/components/ui/button";

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
      <div className="space-y-4">
        {currentSession && <SessionCard session={currentSession} />}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Other Active Sessions</h3>
            <Button variant="destructive" size="small">
              Revoke other sessions
            </Button>
          </div>
          {otherSessions.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No other active sessions
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {otherSessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AccountViewCard>
  );
};
