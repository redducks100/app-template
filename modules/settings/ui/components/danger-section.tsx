"use client";

import { TriangleAlertIcon } from "lucide-react";
import { ViewSection } from "./view-section";
import { SendDeleteAccountEmailForm } from "./send-delete-account-email-form";

export const DangerSection = () => {
  return (
    <ViewSection
      title="Danger zone"
      description="Irreversible actions"
      Icon={TriangleAlertIcon}
      iconVariant="destructive"
    >
      <SendDeleteAccountEmailForm />
    </ViewSection>
  );
};
