import {
  AlertTriangle,
  Link2,
  Monitor,
  Shield,
  User,
} from "lucide-react";

export type SettingsValue = "profile" | "security" | "sessions" | "integrations" | "danger";

export const settingsNavigation: {
  key: string;
  label: string;
  items: { value: SettingsValue; label: string; icon: typeof User }[];
}[] = [
  {
    key: "account",
    label: "Account",
    items: [
      { value: "profile", label: "Profile", icon: User },
      { value: "security", label: "Security", icon: Shield },
      { value: "sessions", label: "Sessions", icon: Monitor },
    ],
  },
  {
    key: "integrations",
    label: "Integrations",
    items: [{ value: "integrations", label: "OAuth Providers", icon: Link2 }],
  },
  {
    key: "advanced",
    label: "Advanced",
    items: [{ value: "danger", label: "Danger Zone", icon: AlertTriangle }],
  },
];
