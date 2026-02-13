"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { SessionCard } from "./session-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const SessionsSection = () => {
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
    return authClient.revokeOtherSessions(undefined, {
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
    <div className="space-y-7">
      <section>
        <h3 className="text-base font-semibold text-foreground mb-4">
          Current Session
        </h3>
        {currentSession && <SessionCard session={currentSession} />}
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-foreground">
            Other Active Sessions
          </h3>
          {otherSessions.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={revokeOtherSessions}
            >
              {loading ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                "Revoke all"
              )}
            </Button>
          )}
        </div>
        {otherSessions.length === 0 ? (
          <div className="rounded-xl border border-border bg-card py-8 text-center text-muted-foreground">
            No other active sessions
          </div>
        ) : (
          <div className="space-y-3">
            {otherSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
