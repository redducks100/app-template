"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "@/lib/utils";
import { AnyFieldApi } from "@tanstack/react-form";

function FormLabel({
  field,
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & { field: AnyFieldApi }) {
  return (
    <Label
      htmlFor={field.name}
      className={cn(
        field.state.meta.isTouched &&
          !field.state.meta.isValid &&
          "text-destructive",
        className,
      )}
      {...props}
    />
  );
}

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Label, FormLabel };
