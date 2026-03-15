import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { revokeOtherSessions as revokeOtherSessionsMutation } from "@/lib/mutations/user";
import { sessionsOptions } from "@/lib/queries/user";
import { LoaderButton } from "@app/ui/components/loader-button";

import { SessionCard } from "./session-card";

export const SessionsSection = () => {
  const { t } = useTranslation("settings");
  const queryClient = useQueryClient();
  const { data: sessions } = useSuspenseQuery(sessionsOptions());

  const revokeAllMutation = useMutation({
    mutationFn: revokeOtherSessionsMutation,
    onSuccess: () => {
      toast.success(t("sessions.revokeAllSuccess"));
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
            <p className="text-sm font-medium text-muted-foreground">
              {t("sessions.otherActiveSessions")}
            </p>
            <LoaderButton
              variant="destructive"
              size="sm"
              loading={revokeAllMutation.isPending}
              onClick={() => revokeAllMutation.mutate()}
            >
              {t("sessions.revokeAll")}
            </LoaderButton>
          </div>
          {otherSessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </>
      )}

      {otherSessions.length === 0 && (
        <div className="border border-border bg-card py-8 text-center text-muted-foreground">
          {t("sessions.noOtherSessions")}
        </div>
      )}
    </div>
  );
};
