import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_guest")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="flex min-h-svh w-full">
      {/* Left brand panel */}
      <div className="hidden md:flex md:w-105 lg:w-120 shrink-0 flex-col justify-between bg-foreground p-10 text-background relative overflow-hidden">
        {/* Decorative geometric shapes */}
        <div className="absolute -right-24 -top-24 size-64 rounded-full bg-primary/10" />
        <div className="absolute -left-12 bottom-32 size-40 rounded-full bg-primary/5" />
        <div className="absolute right-12 bottom-12 size-20 rounded-full border border-primary/20" />

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">
                C
              </span>
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Corporsky
            </span>
          </div>
        </div>

        <div className="relative z-10 space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight leading-tight">
            Build something
            <br />
            remarkable.
          </h1>
          <p className="text-background/60 text-sm leading-relaxed max-w-[280px]">
            Manage your team, permissions, and workflows — all in one place.
          </p>
        </div>

        <div className="relative z-10 text-xs text-background/40">
          &copy; {new Date().getFullYear()} Corporsky
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center bg-muted/30 p-6 md:p-10">
        <div className="w-full max-w-sm animate-in-page">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
