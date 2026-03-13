import type { InferResponseType } from "hono/client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, MonitorIcon, SmartphoneIcon, Trash2Icon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { UAParser } from "ua-parser-js";

import type { apiClient } from "@/lib/api-client";

import { revokeSession as revokeSessionMutation } from "@/lib/mutations/user";
import { Badge } from "@app/ui/components/badge";
import { Button } from "@app/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@app/ui/components/card";
import { formatDateTime } from "@app/ui/lib/utils";

type SessionData = InferResponseType<
  (typeof apiClient)["user"]["sessions"]["$get"],
  200
>["data"][number];

type SessionCardProps = {
  session: SessionData;
};

export const SessionCard = ({ session }: SessionCardProps) => {
  const { i18n } = useTranslation();
  const queryClient = useQueryClient();
  const userAgentInfo = session.userAgent ? UAParser(session.userAgent) : null;

  const revokeMutation = useMutation({
    mutationFn: () => revokeSessionMutation({ token: session.token }),
    onSuccess: () => {
      toast.success("Session successfully revoked");
      queryClient.invalidateQueries({ queryKey: ["user", "sessions"] });
    },
  });

  function getBrowserInformation() {
    if (userAgentInfo == null) return "Unknown Device";
    if (userAgentInfo.browser.name == null && userAgentInfo.os.name == null)
      return "Unknown Device";

    if (userAgentInfo.browser.name == null) return userAgentInfo.os.name;
    if (userAgentInfo.os.name == null) return userAgentInfo.browser.name;

    return `${userAgentInfo.browser.name}, ${userAgentInfo.os.name}`;
  }

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <CardTitle>{getBrowserInformation()}</CardTitle>
        {session.current && <Badge>Current Session</Badge>}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {userAgentInfo?.device.type === "mobile" ? <SmartphoneIcon /> : <MonitorIcon />}
            <div>
              <p className="text-sm text-muted-foreground">
                Created: {formatDateTime(session.createdAt, i18n.language)}
              </p>
              <p className="text-sm text-muted-foreground">
                Expires: {formatDateTime(session.expiresAt, i18n.language)}
              </p>
            </div>
          </div>
          {!session.current && (
            <Button variant="destructive" size="sm" onClick={() => revokeMutation.mutate()}>
              {revokeMutation.isPending ? <Loader2Icon className="animate-spin" /> : <Trash2Icon />}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
