import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "react-i18next";
import {
  PERMISSION_MAP,
  PERMISSION_GROUPS,
  RESOURCE_TRANSLATION_KEY,
} from "@app/shared/types/roles";

const ALL_ACTIONS = ["read", "create", "update", "delete", "cancel"] as const;

type PermissionEditorProps = {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
};

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

  const isActionSupported = (resource: string, action: string) =>
    (PERMISSION_MAP[resource] ?? []).includes(action);

  return (
    <div className={disabled ? "opacity-60 pointer-events-none" : ""}>
      <div className="space-y-6">
        {PERMISSION_GROUPS.map((group) => (
          <div key={group.key}>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              {t(`permissionGroup.${group.key}`)}
            </h4>

            {/* Desktop grid */}
            <div className="hidden sm:block rounded-xl border border-border bg-card overflow-hidden">
              {/* Header row */}
              <div className="grid grid-cols-[1fr_repeat(5,_3.5rem)_2.5rem] items-center bg-muted/30 px-4 py-2 border-b border-border">
                <span className="text-xs font-medium text-muted-foreground">
                  {t("resource")}
                </span>
                {ALL_ACTIONS.map((action) => (
                  <span
                    key={action}
                    className="text-xs font-medium text-muted-foreground text-center capitalize"
                  >
                    {t(action)}
                  </span>
                ))}
                <span className="text-xs font-medium text-muted-foreground text-center">
                  {t("all")}
                </span>
              </div>

              {/* Resource rows */}
              {group.resources.map((resource) => {
                const groupState = getGroupState(resource);
                const translationKey = RESOURCE_TRANSLATION_KEY[resource] as string;

                return (
                  <div
                    key={resource}
                    className="grid grid-cols-[1fr_repeat(5,_3.5rem)_2.5rem] items-center px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors"
                  >
                    <div>
                      <span className="text-sm font-medium text-foreground">
                        {t(translationKey)}
                      </span>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {t(`resourceDesc.${resource}`)}
                      </p>
                    </div>

                    {ALL_ACTIONS.map((action) => {
                      const supported = isActionSupported(resource, action);
                      const permission = `${resource}:${action}`;

                      return (
                        <div key={action} className="flex justify-center">
                          {supported ? (
                            <Checkbox
                              checked={isChecked(permission)}
                              onCheckedChange={() => toggle(permission)}
                              disabled={disabled}
                            />
                          ) : (
                            <span className="text-muted-foreground/50 text-sm select-none">—</span>
                          )}
                        </div>
                      );
                    })}

                    <div className="flex justify-center">
                      <Checkbox
                        checked={groupState === "all"}
                        indeterminate={groupState === "partial"}
                        onCheckedChange={() => toggleGroup(resource)}
                        disabled={disabled}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden rounded-xl border border-border bg-card overflow-hidden">
              {group.resources.map((resource) => {
                const actions = PERMISSION_MAP[resource] ?? [];
                const groupState = getGroupState(resource);
                const translationKey = RESOURCE_TRANSLATION_KEY[resource] as string;

                return (
                  <div
                    key={resource}
                    className="border-b border-border last:border-b-0"
                  >
                    <div className="flex items-center justify-between px-4 pt-4 pb-2">
                      <div>
                        <span className="text-sm font-medium text-foreground">
                          {t(translationKey)}
                        </span>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {t(`resourceDesc.${resource}`)}
                        </p>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
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

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 pb-4">
                      {actions.map((action) => {
                        const permission = `${resource}:${action}`;
                        return (
                          <label
                            key={permission}
                            className="flex items-center gap-2 cursor-pointer select-none rounded-md px-2 py-1.5 hover:bg-muted/50 transition-colors"
                          >
                            <Checkbox
                              checked={isChecked(permission)}
                              onCheckedChange={() => toggle(permission)}
                              disabled={disabled}
                            />
                            <span className="text-sm text-foreground capitalize">
                              {t(action)}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
