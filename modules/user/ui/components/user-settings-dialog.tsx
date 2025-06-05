"use client";

import { User, Shield, CreditCard, UserIcon, ShieldIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ActiveTab = "profile" | "security";

const sidebarItems = [
  { id: "profile" as ActiveTab, label: "Profile", icon: UserIcon },
  { id: "security" as ActiveTab, label: "Security", icon: ShieldIcon },
];

export const UserSettingsDialog = ({
  open,
  onOpenChange,
}: SettingsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0">
        <DialogTitle className="px-6 py-4 border-b">Settings</DialogTitle>

        <div className="flex max-h-[calc(80vh-80px)]">
          <Tabs
            defaultValue="profile"
            className="w-full border-r max-w-64"
            orientation="vertical"
          >
            <TabsList className="flex flex-col h-full w-full bg-muted rounded-none rounded-bl-lg space-y-2">
              {sidebarItems.map((x) => (
                <TabsTrigger
                  key={x.id}
                  value={x.id}
                  className="w-full flex justify-start items-center px-4 py-2"
                >
                  <x.icon className="size-4 mr-2" />
                  {x.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
