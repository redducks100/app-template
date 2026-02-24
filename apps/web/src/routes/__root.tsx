import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import "@/lib/i18n";

export interface RouterContext {
  queryClient: QueryClient;
  cookie?: string;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "UTF-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { title: "App Template" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: import.meta.env.PROD
          ? "/assets/styles.css"
          : "/src/globals.css",
      },
    ],
    scripts: [
      // Vite HMR + React Refresh (dev only)
      ...(!import.meta.env.PROD
        ? [
            {
              type: "module",
              children: `import RefreshRuntime from "/@react-refresh"
                RefreshRuntime.injectIntoGlobalHook(window)
                window.$RefreshReg$ = () => {}
                window.$RefreshSig$ = () => (type) => type
                window.__vite_plugin_react_preamble_installed__ = true`,
            },
            { type: "module", src: "/@vite/client" },
          ]
        : []),
      // Client entry
      {
        type: "module",
        src: import.meta.env.PROD
          ? "/assets/entry-client.js"
          : "/src/entry-client.tsx",
      },
    ],
  }),
  component: RootLayout,
  notFoundComponent: () => <div>Page not found</div>,
});

function RootLayout() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="antialiased font-sans">
        <Toaster />
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
