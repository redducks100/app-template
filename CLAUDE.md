# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server (app)**: `pnpm dev` (runs TanStack Start dev server on port 3000)
- **Dev server (home)**: `pnpm dev:home` (runs landing page dev server on port 3001)
- **Build (app)**: `pnpm build`
- **Build (home)**: `pnpm build:home`
- **Deploy (app)**: `pnpm deploy:app` (builds + deploys to Cloudflare Workers)
- **Deploy (home)**: `pnpm deploy:home`
- **DB push**: `pnpm db:push`
- **DB generate migration**: `pnpm db:generate`
- **DB migrate**: `pnpm db:migrate`
- **DB studio**: `pnpm db:studio`

No test framework is configured.

## Tech Stack

- **TanStack Start** full-stack React framework with SSR
- **Hono** API framework with RPC for type-safe API
- **TanStack Router** (file-based routing) with TanStack Start SSR
- **Vite** for bundling with `@vitejs/plugin-react`
- **Cloudflare Workers** for deployment (`@cloudflare/vite-plugin` + `wrangler`)
- **React 19** with TypeScript
- **Base UI** (`@base-ui/react`) + **shadcn** for components (style: `base-maia`)
- **Tailwind CSS 4** with oklch color variables and `tw-animate-css`
- **TanStack React Query** for data fetching with Hono RPC client
- **Better Auth** for authentication (email/password + Google OAuth, organizations plugin)
- **Drizzle ORM** with PostgreSQL
- **TanStack React Form** + Zod for form handling
- **Resend** for transactional email via React Email templates
- **react-i18next** for internationalization
- **pnpm** workspaces monorepo

## Monorepo Structure

```
app-template/
├── apps/
│   ├── api/          # @app/api — Hono API app (mounted inside apps/app at /api)
│   ├── app/          # @app/app — TanStack Start dashboard app → app.domain.com
│   └── home/         # @app/home — TanStack Start landing page → domain.com
├── packages/
│   └── shared/       # @app/shared — Zod schemas, types, permissions
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── package.json
```

## API App (`apps/api`)

Pure Hono app exported from `src/app.ts`. Routes are nested under `/api` prefix.

- `src/app.ts` — Hono app composition, exports `apiApp` (with `/api` prefix) and `AppType` (route-level types without `/api` for RPC client)
- `src/routes/` — Hono RPC routes (organizations, invitations, members, roles, user)
- `src/middleware/auth.ts` — Session auth middleware using `c.req.raw.headers`
- `src/lib/auth.ts` — Better Auth server config with Drizzle adapter
- `src/lib/db.ts` — Drizzle connection
- `src/db/schema.ts` — Drizzle schema
- `src/emails/` — React Email templates sent via Resend

### Hono Route Pattern

```ts
export const roleRoutes = new Hono()
  .use(authMiddleware)
  .get('/list', async (c) => { return c.json(result); })
  .post('/create', zValidator('json', schema), async (c) => { return c.json(result, 201); });
```

## Dashboard App (`apps/app`)

TanStack Start app that serves the dashboard at `app.domain.com`. Mounts the Hono API at `/api` via a catch-all server route.

- `vite.config.ts` — TanStack Start + Cloudflare Workers + Tailwind CSS
- `wrangler.jsonc` — Cloudflare Workers config
- `src/router.tsx` — `getRouter()` factory (TanStack Start convention)
- `src/routes/` — TanStack Router file-based routes
- `src/routes/api/$.ts` — Catch-all server route that forwards to Hono API
- `src/components/ui/` — shadcn + form system
- `src/lib/api-client.ts` — Hono RPC client (`hc<AppType>`) with dynamic base URL
- `src/lib/auth-client.ts` — Better Auth client
- `src/lib/query-options.ts` — TanStack Query option factories (accept `cookie` param for SSR)
- `src/lib/mutations.ts` — Mutation functions using Hono RPC
- `src/lib/i18n.ts` — i18next configuration
- `src/locales/` — Translation files (en.json, ro.json)

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

- `_auth` layout — centered card wrapper for sign-in, sign-up, forgot/reset password, verify email, accept-invitation (provides `cookie` from `getRequestHeaders()`)
- `_protected` layout — auth guard only (no sidebar), redirects to `/sign-in` if no session. Used for `/create-org` and `/select-org`
- `_app` layout — auth guard + org guard + sidebar layout. All dashboard routes at root level
- `_app/users` — member list + `$memberId` detail
- `_app/roles` — role list + `create` + `$roleId` detail
- `_app/settings` layout — settings sidebar + header
- Route guards use `beforeLoad` hooks with `getRequestHeaders()` from `@tanstack/react-start/server` for SSR cookie forwarding

### Data Fetching Pattern

```tsx
// Query options (src/lib/query-options.ts)
export const rolesListOptions = (cookie?: string) => queryOptions({
  queryKey: ['roles', 'list'],
  queryFn: async () => {
    const res = await apiClient.roles.list.$get({}, cookieHeaders(cookie));
    return res.json();
  },
});

// In route files — loader + component
export const Route = createFileRoute('/_app/roles/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(rolesListOptions(context.cookie)),
  component: RolesPage,
});
```

### SSR Cookie Forwarding

Layouts use `getRequestHeaders()` from `@tanstack/react-start/server` to get cookies during SSR, then pass `cookie` through route context:

```tsx
beforeLoad: async () => {
  const headers = getRequestHeaders();
  const cookie = headers?.get("cookie") ?? undefined;
  // ... use cookie for auth checks and pass in context
  return { cookie, user, session };
}
```

### Shared Components (`apps/app/src/components/ui/`)

Built on Base UI + shadcn. Key subsystem:

**Form components** (`components/ui/form/`): `useAppForm` hook wraps TanStack React Form with pre-registered field components (`Input`, `Textarea`, `Select`, `Checkbox`) and `SubmitButton`.

## Home App (`apps/home`)

Simple TanStack Start landing page deployed to `domain.com`. Minimal setup with Tailwind CSS.

## Shared Package (`packages/shared`)

- `src/schemas/` — Zod validation schemas shared between API and web
- `src/types/` — Shared TypeScript types
- `src/permissions.ts` — Access control definitions (owner/admin/member roles)

## Path Aliases

- `@/*` maps to `apps/app/src/` in the app, `apps/home/src/` in home
- `@app/api` and `@app/shared` are workspace package imports

## Environment Variables

Required: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `RESEND_API_KEY`.
Optional: `APP_URL` (defaults to `http://localhost:3000`, used for SSR API client base URL).
