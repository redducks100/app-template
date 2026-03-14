import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { revokeOtherSessions as revokeOtherSessionsMutation } from "@/lib/mutations/user";
import { sessionsOptions } from "@/lib/queries/user";
import { Button } from "@app/ui/components/button";

import { SessionCard } from "./session-card";

export const SessionsSection = () => {
  const queryClient = useQueryClient();
  const { data: sessions } = useSuspenseQuery(sessionsOptions());

  const revokeAllMutation = useMutation({
    mutationFn: revokeOtherSessionsMutation,
    onSuccess: () => {
      toast.success("Successfully revoked all other sessions");
      queryClient.invalidateQueries({ queryKey: ["user", "sessions"] });
    },
  });

  const currentSession = sessions.find((x) => x.current);
  const otherSessions = sessions.filter((x) => !x.current);

  return (
    <div className="space-y-3">
      {currentSession && <SessionCard session={currentSession} />}

      {otherSessions.length > 0 && (
        <>
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm font-medium text-muted-foreground">Other Active Sessions</p>
            <Button variant="destructive" size="sm" onClick={() => revokeAllMutation.mutate()}>
              {revokeAllMutation.isPending ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                "Revoke all"
              )}
            </Button>
          </div>
          {otherSessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </>
      )}

      {otherSessions.length === 0 && (
        <div className="border border-border bg-card py-8 text-center text-muted-foreground">
          No other active sessions
        </div>
      )}
    </div>
  );
};
