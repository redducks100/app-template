import { useTranslation } from "react-i18next";
import { CreateInvitationForm } from "./create-invitation-form";
import { InvitationsDataTable } from "./invitations-data-table";

export const InvitationsSection = () => {
  const { t } = useTranslation("invitations");

  return (
    <div className="space-y-12">
      <section>
        <h3 className="text-base font-semibold text-foreground mb-4">
          {t("inviteMember")}
        </h3>
        <CreateInvitationForm />
      </section>

      <section>
        <h3 className="text-base font-semibold text-foreground mb-4">
          {t("allInvitations")}
        </h3>
        <InvitationsDataTable />
      </section>
    </div>
  );
};
