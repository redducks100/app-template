import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_guest")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="flex min-h-svh w-full">
      {/* Left brand panel */}
      <div className="hidden md:flex md:w-105 lg:w-120 shrink-0 flex-col justify-between bg-foreground p-10 text-background relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-primary flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">C</span>
            </div>
            <span className="text-lg font-medium tracking-tight">Corporsky</span>
          </div>
        </div>

        <div className="relative z-10 space-y-4">
          <h1 className="text-2xl font-medium tracking-tight leading-tight">
            Build something
            <br />
            remarkable.
          </h1>
          <p className="text-background/60 text-sm leading-relaxed max-w-[280px]">
            Manage your team, permissions, and workflows — all in one place.
          </p>
        </div>

        <div className="relative z-10 text-xs text-background/40 font-mono">
          &copy; {new Date().getFullYear()} Corporsky
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center bg-background p-6 md:p-10">
        <div className="w-full max-w-sm animate-in-page">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
