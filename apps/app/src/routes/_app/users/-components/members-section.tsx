import { useTranslation } from "react-i18next";
import { MembersDataTable } from "./members-data-table";

export const MembersSection = () => {
  const { t } = useTranslation("members");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">
          {t("allMembers")}
        </h3>
      </div>

      <MembersDataTable />
    </div>
  );
};
