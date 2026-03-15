import { InfoIcon, Link2, MailsIcon, Monitor, Shield, User, UsersIcon } from "lucide-react";

export type SettingsValue =
  | "general"
  | "invitations"
  | "members"
  | "profile"
  | "security"
  | "sessions"
  | "integrations";

export const settingsNavigation: {
  key: string;
  items: { value: SettingsValue; label: string; icon: typeof User }[];
}[] = [
  {
    key: "organization",
    items: [
      { value: "general", label: "Organization", icon: InfoIcon },
      { value: "invitations", label: "Invitations", icon: MailsIcon },
      { value: "members", label: "Members", icon: UsersIcon },
    ],
  },
  {
    key: "account",
    items: [
      { value: "profile", label: "Account", icon: User },
      { value: "security", label: "Security", icon: Shield },
      { value: "sessions", label: "Sessions", icon: Monitor },
      { value: "integrations", label: "Integrations", icon: Link2 },
    ],
  },
];
