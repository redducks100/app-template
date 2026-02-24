import { defineConfig, loadEnv } from "vite";
import devServer, { defaultOptions } from "@hono/vite-dev-server";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ isSsrBuild }) => {
  // Load .env from monorepo root into process.env for SSR
  const env = loadEnv("development", path.resolve(__dirname, "../.."), "");
  Object.assign(process.env, env);

  return {
    server: {
      port: 3000,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    plugins: [
      TanStackRouterVite({
        routesDirectory: "src/routes",
        generatedRouteTree: "src/routeTree.gen.ts",
        autoCodeSplitting: true,
      }),
      react(),
      devServer({
        entry: "server.ts",
        injectClientScript: false,
        exclude: [/^\/src\/.+/, ...defaultOptions.exclude],
      }),
    ],
    build: isSsrBuild
      ? {
          ssr: true,
          outDir: "dist/server",
          rollupOptions: {
            input: path.resolve(__dirname, "server.ts"),
            output: {
              entryFileNames: "index.js",
            },
          },
        }
      : {
          outDir: "dist/client",
          rollupOptions: {
            input: path.resolve(__dirname, "src/entry-client.tsx"),
            output: {
              entryFileNames: "assets/entry-client.js",
              assetFileNames: (assetInfo) => {
                if (assetInfo.names?.some((n) => n.endsWith(".css"))) {
                  return "assets/styles.css";
                }
                return "assets/[name]-[hash][extname]";
              },
            },
          },
        },
  };
});
