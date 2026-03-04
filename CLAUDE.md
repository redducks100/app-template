# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server (app)**: `pnpm dev` (runs Vite SPA dev server on port 3000)
- **Dev server (api)**: `pnpm dev:api` (runs Hono API worker on port 8787)
- **Dev server (home)**: `pnpm dev:home` (runs landing page dev server on port 3001)
- **Build (app)**: `pnpm build`
- **Build (home)**: `pnpm build:home`
- **Deploy (app)**: `pnpm deploy:app` (builds + deploys to Cloudflare Pages)
- **Deploy (api)**: `pnpm deploy:api` (deploys API to Cloudflare Workers)
- **Deploy (home)**: `pnpm deploy:home`
- **DB push**: `pnpm db:push`
- **DB generate migration**: `pnpm db:generate`
- **DB migrate**: `pnpm db:migrate`
- **DB studio**: `pnpm db:studio`

No test framework is configured.

## Tech Stack

- **TanStack Router** (file-based routing) as a client-only SPA
- **Hono** API framework with RPC for type-safe API, deployed as a standalone Cloudflare Worker
- **Vite** for bundling with `@vitejs/plugin-react` + `@tanstack/router-plugin`
- **Cloudflare Pages** for SPA deployment (static), **Cloudflare Workers** for API deployment
- **React 19** with TypeScript
- **Base UI** (`@base-ui/react`) + **shadcn** for components (style: `base-maia`)
- **Tailwind CSS 4** with oklch color variables and `tw-animate-css`
- **TanStack React Query** for data fetching with Hono RPC client
- **Better Auth** for authentication (email/password + Google OAuth, organizations plugin) with cross-subdomain cookies
- **Drizzle ORM** with PostgreSQL
- **TanStack React Form** + Zod for form handling
- **Resend** for transactional email via React Email templates
- **react-i18next** for internationalization
- **pnpm** workspaces monorepo

## Monorepo Structure

```
app-template/
├── apps/
│   ├── api/          # @app/api — Standalone Hono API worker → api.enomisoft.com
│   ├── app/          # @app/app — TanStack Router SPA → app.enomisoft.com (Cloudflare Pages)
│   └── home/         # @app/home — TanStack Start landing page → enomisoft.com
├── packages/
│   └── shared/       # @app/shared — Zod schemas, types, permissions
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── package.json
```

## API App (`apps/api`)

Standalone Hono app deployed as a Cloudflare Worker. Routes are nested under `/api` prefix.

- `src/worker.ts` — Worker entry point (exports `apiApp`)
- `src/app.ts` — Hono app composition, exports `apiApp` (with `/api` prefix) and `AppType` (route-level types without `/api` for RPC client)
- `src/routes/` — Hono RPC routes (organizations, invitations, members, roles, user)
- `src/middleware/auth.ts` — Session auth middleware using `c.req.raw.headers`
- `src/lib/auth.ts` — Better Auth server config with Drizzle adapter, cross-subdomain cookies
- `src/lib/db.ts` — Drizzle connection
- `src/db/schema.ts` — Drizzle schema
- `src/emails/` — React Email templates sent via Resend
- `wrangler.jsonc` — Cloudflare Workers config
- `.dev.vars` — Local dev secrets (gitignored)

### Hono Route Pattern

```ts
export const roleRoutes = new Hono()
  .use(authMiddleware)
  .get('/list', async (c) => { return c.json(result); })
  .post('/create', zValidator('json', schema), async (c) => { return c.json(result, 201); });
```

## Dashboard App (`apps/app`)

Client-only SPA using TanStack Router, deployed to Cloudflare Pages as static files. Communicates with the API at a separate subdomain via Hono RPC client with `credentials: "include"`.

- `index.html` — SPA entry point
- `src/main.tsx` — React bootstrap
- `vite.config.ts` — Vite + TanStack Router plugin + Tailwind CSS
- `src/router.tsx` — `getRouter()` factory
- `src/routes/` — TanStack Router file-based routes
- `src/components/ui/` — shadcn + form system
- `src/lib/api-client.ts` — Hono RPC client (`hc<AppType>`) pointing to `VITE_API_URL`
- `src/lib/auth-client.ts` — Better Auth client pointing to `VITE_API_URL`
- `src/lib/query-options.ts` — TanStack Query option factories
- `src/lib/mutations.ts` — Mutation functions using Hono RPC
- `src/lib/i18n.ts` — i18next configuration
- `src/locales/` — Translation files (en.json, ro.json)
- `public/_redirects` — Cloudflare Pages SPA routing

### Feature Component Pattern

Feature-specific components are co-located with their route files using TanStack Router's `-components/` convention:

```
src/routes/_app/
├── roles/
│   ├── index.tsx              # /roles route
│   ├── create.tsx             # /roles/create route
│   ├── $roleId.tsx            # /roles/$roleId route
│   └── -components/           # Role-specific components
├── users/
│   ├── index.tsx
│   ├── $memberId.tsx
│   └── -components/
├── settings/
│   └── -components/
└── -components/               # Dashboard-level shared components
```

### Routing

- `__root` — fetches auth session once via `authClient.getSession()`, passes `authData` through context
- `_auth` layout — centered card wrapper for sign-in, sign-up, forgot/reset password, verify email, accept-invitation
- `_protected` layout — auth guard only (no sidebar), reads `context.authData`, redirects to `/sign-in` if no session. Used for `/create-org` and `/select-org`
- `_app` layout — auth guard + org guard + sidebar layout. Reads `context.authData`. All dashboard routes at root level
- `_app/users` — member list + `$memberId` detail
- `_app/roles` — role list + `create` + `$roleId` detail
- `_app/settings` layout — settings sidebar + header

### Data Fetching Pattern

```tsx
// Query options (src/lib/query-options.ts)
export const rolesListOptions = () => queryOptions({
  queryKey: ['roles', 'list'],
  queryFn: async () => {
    const res = await apiClient.roles.list.$get();
    return res.json();
  },
});

// In route files — loader + component
export const Route = createFileRoute('/_app/roles/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(rolesListOptions()),
  component: RolesPage,
});
```

### Auth Pattern

Auth session is fetched once at the root route's `beforeLoad`. Layout guards read `context.authData` synchronously — no additional API calls during navigation. The `cookieCache` (5 min TTL) on the server makes the root fetch cheap.

### Shared Components (`apps/app/src/components/ui/`)

Built on Base UI + shadcn. Key subsystem:

**Form components** (`components/ui/form/`): `useAppForm` hook wraps TanStack React Form with pre-registered field components (`Input`, `Textarea`, `Select`, `Checkbox`) and `SubmitButton`.

## Home App (`apps/home`)

Simple TanStack Start landing page deployed to `enomisoft.com`. Minimal setup with Tailwind CSS.

## Shared Package (`packages/shared`)

- `src/schemas/` — Zod validation schemas shared between API and web
- `src/types/` — Shared TypeScript types
- `src/permissions.ts` — Access control definitions (owner/admin/member roles)

## Path Aliases

- `@/*` maps to `apps/app/src/` in the app, `apps/home/src/` in home
- `@app/api` and `@app/shared` are workspace package imports

## Environment Variables

### API Worker (wrangler vars/secrets)
Required: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `APP_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `RESEND_API_KEY`, `COOKIE_DOMAIN`.

### SPA (Cloudflare Pages, build-time)
Required: `VITE_API_URL` (baked into bundle, e.g. `https://api.enomisoft.com`).

### Local Development
- API runs on `localhost:8787` (via `wrangler dev`)
- SPA runs on `localhost:3000` (via `vite dev`)
- SPA defaults `VITE_API_URL` to `http://localhost:8787`
- Cross-origin cookies work on localhost because same-site (port doesn't matter)
