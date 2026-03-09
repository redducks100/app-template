import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "react-i18next";
import { PERMISSION_MAP, RESOURCE_TRANSLATION_KEY } from "@app/shared/types/roles";

type PermissionEditorProps = {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
};

const RESOURCE_ORDER = ["organization", "member", "invitation"] as const;

export const PermissionEditor = ({
  value,
  onChange,
  disabled = false,
}: PermissionEditorProps) => {
  const { t } = useTranslation("roles");

  const isChecked = (permission: string) => value.includes(permission);

  const toggle = (permission: string) => {
    if (disabled) return;
    if (isChecked(permission)) {
      onChange(value.filter((v) => v !== permission));
    } else {
      onChange([...value, permission]);
    }
  };

  const getGroupState = (resource: string) => {
    const actions = PERMISSION_MAP[resource] ?? [];
    const checkedCount = actions.filter((a) =>
      value.includes(`${resource}:${a}`),
    ).length;
    if (checkedCount === 0) return "none";
    if (checkedCount === actions.length) return "all";
    return "partial";
  };

  const toggleGroup = (resource: string) => {
    if (disabled) return;
    const actions = PERMISSION_MAP[resource] ?? [];
    const groupPermissions = actions.map((a) => `${resource}:${a}`);
    const state = getGroupState(resource);

    if (state === "all") {
      onChange(value.filter((v) => !groupPermissions.includes(v)));
    } else {
      const newValue = new Set(value);
      for (const p of groupPermissions) newValue.add(p);
      onChange(Array.from(newValue));
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card divide-y divide-border">
      {RESOURCE_ORDER.map((resource) => {
        const actions = PERMISSION_MAP[resource] ?? [];
        const groupState = getGroupState(resource);
        const translationKey = RESOURCE_TRANSLATION_KEY[resource] as
          | "organization"
          | "members"
          | "invitations";

        return (
          <div key={resource} className="px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                {t(translationKey)}
              </span>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs text-muted-foreground">
                  {t("selectAll")}
                </span>
                <Checkbox
                  checked={groupState === "all"}
                  indeterminate={groupState === "partial"}
                  onCheckedChange={() => toggleGroup(resource)}
                  disabled={disabled}
                />
              </label>
            </div>
            <div className="space-y-1">
              {actions.map((action) => {
                const permission = `${resource}:${action}`;
                return (
                  <label
                    key={permission}
                    className="flex items-center gap-2 py-1.5 px-1 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <Checkbox
                      checked={isChecked(permission)}
                      onCheckedChange={() => toggle(permission)}
                      disabled={disabled}
                    />
                    <span className="text-sm text-foreground capitalize">
                      {t(
                        action as
                          | "read"
                          | "create"
                          | "update"
                          | "delete"
                          | "cancel",
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
