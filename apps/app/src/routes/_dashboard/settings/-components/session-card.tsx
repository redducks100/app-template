import type { InferResponseType } from "hono/client";
import type { apiClient } from "@/lib/api-client";
import {
  Loader2Icon,
  MonitorIcon,
  SmartphoneIcon,
  Trash2Icon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UAParser } from "ua-parser-js";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { revokeSession as revokeSessionMutation } from "@/lib/mutations/user";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type SessionData = InferResponseType<
  (typeof apiClient)["user"]["sessions"]["$get"],
  200
>["data"][number];

type SessionCardProps = {
  session: SessionData;
};

export const SessionCard = ({ session }: SessionCardProps) => {
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

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
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
            {userAgentInfo?.device.type === "mobile" ? (
              <SmartphoneIcon />
            ) : (
              <MonitorIcon />
            )}
            <div>
              <p className="text-sm text-muted-foreground">
                Created: {formatDate(new Date(session.createdAt))}
              </p>
              <p className="text-sm text-muted-foreground">
                Expires: {formatDate(new Date(session.expiresAt))}
              </p>
            </div>
          </div>
          {!session.current && (
            <Button variant="destructive" size="sm" onClick={() => revokeMutation.mutate()}>
              {revokeMutation.isPending ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <Trash2Icon />
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
