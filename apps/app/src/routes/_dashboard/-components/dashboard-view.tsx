import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { CogIcon, MailsIcon, UserPlusIcon, UsersIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@app/ui/components/button";
import { invitationsListOptions } from "@/lib/queries/invitations";
import { membersListOptions } from "@/lib/queries/members";

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
      className="group rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:shadow-md hover:border-border/80"
    >
      <div className="flex items-center justify-between">
        <div className="rounded-lg bg-muted p-2 text-muted-foreground group-hover:text-foreground transition-colors">
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-3xl font-semibold tracking-tight">{value}</p>
        <p className="mt-1 text-sm text-muted-foreground">{label}</p>
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
      <Button
        variant="outline"
        className="h-auto w-full flex-col gap-2 py-4 hover:bg-muted/50 transition-all duration-200"
      >
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </Button>
    </Link>
  );
}

export const DashboardView = () => {
  const { t } = useTranslation("dashboard");
  const { data: membersData } = useSuspenseQuery(membersListOptions());
  const { data: invitations } = useSuspenseQuery(invitationsListOptions());

  const membersCount = membersData.members.length;
  const pendingInvitations = invitations.filter(
    (inv: { status: string }) => inv.status === "pending",
  ).length;

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
        <h1 className="text-2xl font-semibold tracking-tight">{t("welcome")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{today}</p>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label={t("stats.members")}
          value={membersCount}
          icon={<UsersIcon className="size-5" />}
          href="/users"
        />
        <StatCard
          label={t("stats.pendingInvitations")}
          value={pendingInvitations}
          icon={<MailsIcon className="size-5" />}
          href="/invitations"
        />
      </div>

      {/* Quick actions */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">{t("quickActions")}</h2>
        <div className="grid grid-cols-2 gap-3">
          <QuickAction
            label={t("actions.inviteMember")}
            icon={<UserPlusIcon className="size-5 text-muted-foreground" />}
            href="/invitations"
          />
          <QuickAction
            label={t("actions.settings")}
            icon={<CogIcon className="size-5 text-muted-foreground" />}
            href="/settings/profile"
          />
        </div>
      </div>
    </div>
  );
};
