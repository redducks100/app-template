"use client";

import * as React from "react";

import { createSafeContext } from "../../lib/create-safe-context";
import { Button } from "./button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

type ConfirmDialogContextValue = {
  setOpen: (open: boolean) => void;
};

const [ConfirmDialogProvider, useConfirmDialogContext] =
  createSafeContext<ConfirmDialogContextValue>("ConfirmDialog");

function ConfirmDialog({
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  return (
    <ConfirmDialogProvider value={{ setOpen }}>
      <Dialog open={open} onOpenChange={setOpen}>
        {children}
      </Dialog>
    </ConfirmDialogProvider>
  );
}

function ConfirmDialogTrigger({ children }: { children: React.ReactNode }) {
  return (
    <DialogTrigger nativeButton={false} render={<span className="contents" />}>
      {children}
    </DialogTrigger>
  );
}

function ConfirmDialogContent({ children }: { children: React.ReactNode }) {
  return <DialogContent showCloseButton={false}>{children}</DialogContent>;
}

function ConfirmDialogHeaderComponent({ children }: { children: React.ReactNode }) {
  return <DialogHeader>{children}</DialogHeader>;
}

function ConfirmDialogTitleComponent({ children }: { children: React.ReactNode }) {
  return <DialogTitle>{children}</DialogTitle>;
}

function ConfirmDialogDescriptionComponent({ children }: { children: React.ReactNode }) {
  return <DialogDescription>{children}</DialogDescription>;
}

function ConfirmDialogFooterComponent({
  variant = "default",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  disabled,
}: {
  variant?: "default" | "destructive";
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  disabled?: boolean;
}) {
  const { setOpen } = useConfirmDialogContext();

  return (
    <DialogFooter>
      <DialogClose render={<Button variant="outline" />}>{cancelLabel}</DialogClose>
      <Button
        variant={variant}
        disabled={disabled}
        onClick={() => {
          onConfirm();
          setOpen(false);
        }}
      >
        {confirmLabel}
      </Button>
    </DialogFooter>
  );
}

export {
  ConfirmDialog,
  ConfirmDialogTrigger,
  ConfirmDialogContent,
  ConfirmDialogHeaderComponent as ConfirmDialogHeader,
  ConfirmDialogTitleComponent as ConfirmDialogTitle,
  ConfirmDialogDescriptionComponent as ConfirmDialogDescription,
  ConfirmDialogFooterComponent as ConfirmDialogFooter,
};
