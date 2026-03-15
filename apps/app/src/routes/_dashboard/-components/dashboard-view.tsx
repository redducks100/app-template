import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { CogIcon, MailsIcon, UserPlusIcon, UsersIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { invitationsCountOptions } from "@/lib/queries/invitations";
import { membersCountOptions } from "@/lib/queries/members";
import { Button } from "@app/ui/components/button";

type StatCardProps = {
  label: string;
  value: number;
  icon: React.ReactNode;
  href: string;
};

function StatCard({ label, value, icon, href }: StatCardProps) {
  return (
    <Link
      to={href}
      className="group border border-border bg-card p-4 transition-colors hover:bg-muted/50"
    >
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground group-hover:text-foreground transition-colors">
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-medium tabular-nums tracking-tight">{value}</p>
        <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      </div>
    </Link>
  );
}

type QuickActionProps = {
  label: string;
  icon: React.ReactNode;
  href: string;
};

function QuickAction({ label, icon, href }: QuickActionProps) {
  return (
    <Link to={href}>
      <Button variant="outline" className="h-auto w-full flex-col gap-1.5 py-3">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </Button>
    </Link>
  );
}

export const DashboardView = () => {
  const { t } = useTranslation("dashboard");
  const { data: membersCount } = useSuspenseQuery(membersCountOptions());
  const { data: pendingInvitations } = useSuspenseQuery(invitationsCountOptions());

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="animate-in-stagger space-y-6">
      {/* Welcome header */}
      <div>
        <h1 className="text-xl font-medium tracking-tight">{t("welcome")}</h1>
        <p className="mt-1 text-xs text-muted-foreground">{today}</p>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label={t("stats.members")}
          value={membersCount}
          icon={<UsersIcon className="size-5" />}
          href="/settings/members"
        />
        <StatCard
          label={t("stats.pendingInvitations")}
          value={pendingInvitations}
          icon={<MailsIcon className="size-5" />}
          href="/settings/invitations"
        />
      </div>

      {/* Quick actions */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">{t("quickActions")}</h2>
        <div className="grid grid-cols-2 gap-3">
          <QuickAction
            label={t("actions.inviteMember")}
            icon={<UserPlusIcon className="size-5 text-muted-foreground" />}
            href="/settings/invitations"
          />
          <QuickAction
            label={t("actions.settings")}
            icon={<CogIcon className="size-5 text-muted-foreground" />}
            href="/settings/general"
          />
        </div>
      </div>
    </div>
  );
};
