"use client";

import { Session } from "better-auth";
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
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

type SessionCardProps = {
  session: Session & { current: boolean };
};

export const SessionCard = ({ session }: SessionCardProps) => {
  const [loading, setLoading] = useState<boolean>();
  const router = useRouter();
  const userAgentInfo = session.userAgent ? UAParser(session.userAgent) : null;

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
    }).format(new Date(date));
  }

  function revokeSession() {
    setLoading(true);
    authClient.revokeSession(
      {
        token: session.token,
      },
      {
        onSuccess: () => {
          setLoading(false);
          toast.success("Session successfully revoked");
          router.refresh();
        },
        onError: (error) => {
          setLoading(false);
          toast.error(
            error.error.message ?? "An error occured while revoking session"
          );
        },
      }
    );
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
                Created: {formatDate(session.createdAt)}
              </p>
              <p className="text-sm text-muted-foreground">
                Expires: {formatDate(session.expiresAt)}
              </p>
            </div>
          </div>
          {!session.current && (
            <Button variant="destructive" size="sm" onClick={revokeSession}>
              {loading ? (
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
