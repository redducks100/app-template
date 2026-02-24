# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server**: `pnpm dev` (runs Hono + Vite dev server)
- **Build**: `pnpm build` (builds shared → api → web)
- **Start**: `pnpm start` (runs production server)
- **Lint**: `pnpm lint`
- **DB push**: `pnpm db:push`
- **DB generate migration**: `pnpm db:generate`
- **DB migrate**: `pnpm db:migrate`
- **DB studio**: `pnpm db:studio`

No test framework is configured.

## Tech Stack

- **Hono** server framework with RPC for type-safe API
- **TanStack Router** (file-based routing) with SSR via `@hono/vite-dev-server`
- **Vite** for bundling with `@vitejs/plugin-react` and `@tanstack/router-plugin`
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
│   ├── api/          # @app/api — Hono API app (no serve, no CORS)
│   └── web/          # @app/web — Hono server + TanStack Router SSR
├── packages/
│   └── shared/       # @app/shared — Zod schemas, types, permissions
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── package.json
```

## API App (`apps/api`)

Pure Hono app exported from `src/app.ts`. No `serve()` call — mounted by the web server.

- `src/app.ts` — Hono app composition, exports `apiApp` and `AppType`
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

## Web App (`apps/web`)

Unified Hono server that mounts the API at `/api` and handles SSR for all other routes.

- `server.ts` — Hono app: mounts API + SSR catch-all
- `prod-server.ts` — Production entry with `serve()`
- `src/entry-client.tsx` — Client hydration
- `src/entry-server.tsx` — SSR render using `createRequestHandler`
- `src/router.tsx` — Shared `createRouter()` factory
- `src/routes/` — TanStack Router file-based routes (feature components co-located via `-components/` subdirectories)
- `src/components/ui/` — shadcn + form system
- `src/lib/api-client.ts` — Hono RPC client (`hc<AppType>`)
- `src/lib/auth-client.ts` — Better Auth client
- `src/lib/query-options.ts` — TanStack Query option factories
- `src/lib/mutations.ts` — Mutation functions using Hono RPC
- `src/lib/i18n.ts` — i18next configuration
- `src/locales/` — Translation files (en.json, ro.json)

### Feature Component Pattern

Feature-specific components are co-located with their route files using TanStack Router's `-components/` convention (directories prefixed with `-` are ignored by the route generator):

```
src/routes/_protected/dashboard/
├── roles/
│   ├── index.tsx              # /roles route
│   ├── create.tsx             # /roles/create route
│   ├── $roleId.tsx            # /roles/$roleId route
│   └── -components/           # Role-specific components
│       ├── roles-section.tsx
│       ├── role-detail.tsx
│       └── create-role-form.tsx
├── users/
│   ├── index.tsx
│   ├── $memberId.tsx
│   └── -components/
├── settings/
│   └── -components/
└── -components/               # Dashboard-level shared components
```

### Routing

- `_auth` layout — centered card wrapper for sign-in, sign-up, forgot/reset password, verify email, accept-invitation (no auth guard)
- `_protected` layout — auth guard via `beforeLoad`, redirects to `/sign-in` if no session
- `_protected/dashboard` layout — sidebar layout, checks active org
- `_protected/dashboard/users` — member list + `$memberId` detail
- `_protected/dashboard/roles` — role list + `create` + `$roleId` detail
- `_protected/dashboard/settings` layout — settings sidebar + header
- Route guards on `_protected` use `beforeLoad` hooks that call the session check API

### Data Fetching Pattern

```tsx
// Query options (src/lib/query-options.ts)
export const rolesListOptions = () => queryOptions({
  queryKey: ['roles', 'list'],
  queryFn: async () => {
    const client = getApiClient();
    const res = await client.roles.list.$get();
    return res.json();
  },
});

// In route files — loader + component
export const Route = createFileRoute('/_protected/_dashboard/roles/')({
  component: RolesPage,
});
function RolesPage() {
  const { data } = useSuspenseQuery(rolesListOptions());
}
```

### Shared Components (`apps/web/src/components/ui/`)

Built on Base UI + shadcn. Key subsystem:

**Form components** (`components/ui/form/`): `useAppForm` hook wraps TanStack React Form with pre-registered field components (`Input`, `Textarea`, `Select`, `Checkbox`) and `SubmitButton`.

## Shared Package (`packages/shared`)

- `src/schemas/` — Zod validation schemas shared between API and web
- `src/types/` — Shared TypeScript types
- `src/permissions.ts` — Access control definitions (owner/admin/member roles)

## Path Aliases

- `@/*` maps to `apps/web/src/` in the web app
- `@app/api` and `@app/shared` are workspace package imports

## Environment Variables

Required: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `RESEND_API_KEY`.
