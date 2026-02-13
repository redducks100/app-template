import { AlertTriangle, Link2, Monitor, Shield, User } from "lucide-react";

export const settingsNavigation = [
  {
    label: "Account",
    items: [
      { value: "profile", label: "Profile", icon: User },
      { value: "security", label: "Security", icon: Shield },
      { value: "sessions", label: "Sessions", icon: Monitor },
    ],
  },
  {
    label: "Integrations",
    items: [{ value: "integrations", label: "OAuth Providers", icon: Link2 }],
  },
  {
    label: "Advanced",
    items: [{ value: "danger", label: "Danger Zone", icon: AlertTriangle }],
  },
];
