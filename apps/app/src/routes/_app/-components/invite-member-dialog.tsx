import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CreateInvitationForm } from "./create-invitation-form";

export const InviteMemberDialog = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation("invitations");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <PlusIcon className="size-4" />
        {t("inviteMember")}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("inviteMember")}</DialogTitle>
          <DialogDescription>{t("inviteDescription")}</DialogDescription>
        </DialogHeader>
        <CreateInvitationForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
