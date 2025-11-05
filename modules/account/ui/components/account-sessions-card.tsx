"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { User } from "better-auth";
import { KeyIcon, Loader2Icon, LockIcon } from "lucide-react";
import { AccountViewCard } from "../components/account-view-card";
import { ChangePasswordForm } from "./change-password-form";
import { SendChangePasswordEmailForm } from "./send-change-password-email-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionCard } from "./session-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const AccountSessionsCard = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const { data: sessions } = useSuspenseQuery(
    trpc.auth.getSessions.queryOptions()
  );

  const currentSession = sessions.find((x) => x.current);
  const otherSessions = sessions.filter((x) => !x.current);

  function revokeOtherSessions() {
    setLoading(true);
    authClient.revokeOtherSessions(undefined, {
      onSuccess: () => {
        setLoading(false);
        toast.success("Successfully revoked all other sessions");
        router.refresh();
      },
      onError: (error) => {
        setLoading(false);
        toast.error(
          error.error.message ||
            "An error occured while revoking other sessions"
        );
      },
    });
  }

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
            {otherSessions.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={revokeOtherSessions}
              >
                {loading ? (
                  <Loader2Icon className="size-4 animate-spin" />
                ) : (
                  "Revoke other sessions"
                )}
              </Button>
            )}
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
