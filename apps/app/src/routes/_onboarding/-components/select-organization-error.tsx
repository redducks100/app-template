import { Alert, AlertTitle } from "@/components/ui/alert";
import { CircleAlertIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export const SelectOrganizationError = () => {
  const { t } = useTranslation("selectOrg");

  return (
    <div className="py-4 px-8 flex flex-1 items-center justify-center">
      <Alert className="bg-destructive/10 border-none p-10">
        <AlertTitle className="text-sm flex flex-col items-center justify-center gap-y-6">
          <CircleAlertIcon className="size-6 text-destructive!" />
          {t("loadError")}
        </AlertTitle>
      </Alert>
    </div>
  );
};
