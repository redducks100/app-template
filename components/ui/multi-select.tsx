"use client";

import { Popover } from "@base-ui/react/popover";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, XIcon } from "lucide-react";

type MultiSelectProps = {
  options: { value: string; label: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  onBlur?: () => void;
  placeholder?: string;
};

export function MultiSelect({
  options,
  value,
  onChange,
  onBlur,
  placeholder,
}: MultiSelectProps) {
  const toggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const remove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optionValue));
  };

  return (
    <Popover.Root>
      <Popover.Trigger
        onBlur={onBlur}
        className={cn(
          "border-input dark:bg-input/30 dark:hover:bg-input/50 focus-visible:border-ring focus-visible:ring-ring/50",
          "flex min-h-9 w-full items-center gap-1.5 rounded-md border bg-transparent px-2.5 py-1.5 text-sm shadow-xs transition-[color,box-shadow] focus-visible:ring-3 outline-none",
          "cursor-pointer"
        )}
      >
        <div className="flex flex-1 flex-wrap items-center gap-1">
          {value.length === 0 && (
            <span className="text-muted-foreground text-sm">
              {placeholder}
            </span>
          )}
          {value.map((v) => {
            const option = options.find((o) => o.value === v);
            return (
              <Badge key={v} variant="secondary" className="gap-0.5 pr-1">
                {option?.label ?? v}
                <button
                  type="button"
                  className="ml-0.5 rounded-full hover:bg-foreground/10 p-px"
                  onClick={(e) => remove(v, e)}
                >
                  <XIcon className="size-3" />
                </button>
              </Badge>
            );
          })}
        </div>
        {value.length > 0 && (
          <>
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground rounded-sm p-0.5"
              onClick={(e) => {
                e.stopPropagation();
                onChange([]);
              }}
            >
              <XIcon className="size-3.5" />
            </button>
            <span className="bg-border w-px self-stretch" />
          </>
        )}
        <ChevronDownIcon className="text-muted-foreground size-4 shrink-0" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner side="bottom" sideOffset={4} align="start" className="z-50">
          <Popover.Popup
            className={cn(
              "bg-popover text-popover-foreground ring-foreground/10",
              "data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2",
              "min-w-44 rounded-md p-1 shadow-md ring-1 duration-100 origin-(--transform-origin)",
              "w-(--anchor-width)"
            )}
          >
            {options.map((option) => {
              const isSelected = value.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer outline-none"
                  onClick={() => toggle(option.value)}
                >
                  <Checkbox
                    checked={isSelected}
                    tabIndex={-1}
                    className="pointer-events-none"
                  />
                  {option.label}
                </button>
              );
            })}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
