import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  PERMISSION_MAP,
  RESOURCE_TRANSLATION_KEY,
} from "@app/shared/types/roles";
import {
  Building2,
  CreditCard,
  FileText,
  Mail,
  Shield,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const RESOURCE_ICONS: Record<string, LucideIcon> = {
  organization: Building2,
  member: Users,
  invitation: Mail,
  role: Shield,
  billing: CreditCard,
  audit_log: FileText,
};

const ACCESS_COLORS: Record<string, string> = {
  full: "text-emerald-500",
  partial: "text-amber-500",
  none: "text-muted-foreground/30",
};

function getResourceAccessLevel(
  permission: Record<string, string[]>,
  resource: string,
): "full" | "partial" | "none" {
  const possible = PERMISSION_MAP[resource];
  if (!possible) return "none";
  const granted = permission[resource] ?? [];
  const validCount = granted.filter((a) => possible.includes(a)).length;
  if (validCount === 0) return "none";
  if (validCount >= possible.length) return "full";
  return "partial";
}

export function PermissionSummaryCell({
  permission,
}: {
  permission: Record<string, string[]>;
}) {
  const { t } = useTranslation("roles");

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1.5">
        {Object.keys(PERMISSION_MAP).map((resource) => {
          const level = getResourceAccessLevel(permission, resource);
          const Icon = RESOURCE_ICONS[resource];
          const possible = PERMISSION_MAP[resource];
          const granted = (permission[resource] ?? []).filter((a) =>
            possible.includes(a),
          );
          const translationKey = RESOURCE_TRANSLATION_KEY[resource];
          const resourceName = t(translationKey);

          let tooltipText: string;
          if (level === "full") {
            tooltipText = `${resourceName}: ${t("fullResourceAccess")}`;
          } else if (level === "none") {
            tooltipText = `${resourceName}: ${t("noResourceAccess")}`;
          } else {
            const actionNames = granted.map((a) => t(a)).join(", ");
            tooltipText = `${resourceName}: ${actionNames}`;
          }

          return (
            <Tooltip key={resource}>
              <TooltipTrigger
                aria-label={tooltipText}
                className="cursor-default"
              >
                <Icon className={`size-4 ${ACCESS_COLORS[level]}`} />
              </TooltipTrigger>
              <TooltipContent>{tooltipText}</TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
