import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";

import { Toaster } from "@app/ui/components/sonner";

import { getRouter } from "./router";
import "@fontsource-variable/instrument-sans";
import "@fontsource-variable/geist-mono";
import "@app/ui/globals.css";
import "./lib/i18n";

const router = getRouter();

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  ReactDOM.createRoot(rootElement).render(
    <QueryClientProvider client={router.options.context.queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>,
  );
}
