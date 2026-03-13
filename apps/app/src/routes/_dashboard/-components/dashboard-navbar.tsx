import { SearchIcon } from "lucide-react";

import { Button } from "@app/ui/components/button";
import { Separator } from "@app/ui/components/separator";
import { SidebarTrigger } from "@app/ui/components/sidebar";

export const DashboardNavbar = () => {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/50 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
      </div>
      <div className="flex items-center gap-1 px-4">
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground h-8 px-3">
          <SearchIcon className="size-4" />
          <span className="text-xs hidden sm:inline">Search...</span>
          <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>
    </header>
  );
};
