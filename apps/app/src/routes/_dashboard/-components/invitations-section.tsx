import { useTranslation } from "react-i18next";

import { InvitationsDataTable } from "./invitations-data-table";
import { InviteMemberDialog } from "./invite-member-dialog";

export const InvitationsSection = () => {
  const { t } = useTranslation("invitations");

  return (
    <div className="space-y-6 animate-in-page">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-foreground">
            {t("allInvitations")}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{t("invitationsDescription")}</p>
        </div>
        <InviteMemberDialog />
      </div>

      <InvitationsDataTable />
    </div>
  );
};
