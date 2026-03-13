import type { ComponentProps } from "react";

import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";

import { cn } from "../../lib/utils";
import { buttonVariants } from "./button";

function Pagination({ className, ...props }: ComponentProps<"nav">) {
  return (
    <nav
      data-slot="pagination"
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

interface PaginationLinkProps extends ComponentProps<"button"> {
  isActive?: boolean;
}

function PaginationLink({ className, isActive, ...props }: PaginationLinkProps) {
  return (
    <button
      data-slot="pagination-link"
      aria-current={isActive ? "page" : undefined}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size: "icon-sm",
        }),
        className,
      )}
      {...props}
    />
  );
}

function PaginationPrevious({ className, ...props }: ComponentProps<"button">) {
  return (
    <button
      data-slot="pagination-previous"
      aria-label="Go to previous page"
      className={cn(
        buttonVariants({ variant: "ghost", size: "default" }),
        "gap-1 pl-2.5",
        className,
      )}
      {...props}
    >
      <ChevronLeftIcon className="size-4" />
      <span>Previous</span>
    </button>
  );
}

function PaginationNext({ className, ...props }: ComponentProps<"button">) {
  return (
    <button
      data-slot="pagination-next"
      aria-label="Go to next page"
      className={cn(
        buttonVariants({ variant: "ghost", size: "default" }),
        "gap-1 pr-2.5",
        className,
      )}
      {...props}
    >
      <span>Next</span>
      <ChevronRightIcon className="size-4" />
    </button>
  );
}

function PaginationEllipsis({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="pagination-ellipsis"
      aria-hidden
      className={cn("flex size-8 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
