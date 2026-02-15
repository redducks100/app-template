import {
  AlertTriangle,
  GlobeIcon,
  Link2,
  Monitor,
  Shield,
  User,
} from "lucide-react";

export const settingsNavigation = [
  {
    key: "account",
    label: "Account",
    items: [
      { value: "profile", label: "Profile", icon: User },
      { value: "security", label: "Security", icon: Shield },
      { value: "sessions", label: "Sessions", icon: Monitor },
      { value: "preferences", label: "Preferences", icon: GlobeIcon },
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
