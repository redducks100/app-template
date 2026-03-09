import { useTranslation } from "react-i18next";
import { MembersDataTable } from "./members-data-table";
import { InviteMemberDialog } from "../../-components/invite-member-dialog";

export const MembersSection = () => {
  const { t } = useTranslation("members");

  return (
    <div className="space-y-6 animate-in-page">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-foreground">
            {t("allMembers")}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("membersDescription")}
          </p>
        </div>
        <InviteMemberDialog />
      </div>

      <MembersDataTable />
    </div>
  );
};
