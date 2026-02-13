# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server**: `pnpm dev` (uses Turbopack)
- **Build**: `pnpm build`
- **Lint**: `pnpm lint`
- **DB push**: `pnpm drizzle-kit push`
- **DB generate migration**: `pnpm drizzle-kit generate`
- **DB migrate**: `pnpm drizzle-kit migrate`
- **DB studio**: `pnpm drizzle-kit studio`

No test framework is configured.

## Tech Stack

- **Next.js 16** (App Router) with React 19 and TypeScript
- **Base UI** (`@base-ui/react`) + **shadcn** for components (style: `base-maia`)
- **Tailwind CSS 4** with oklch color variables and `tw-animate-css`
- **tRPC 11** with TanStack React Query for API layer
- **Better Auth** for authentication (email/password + Google OAuth, organizations plugin)
- **Drizzle ORM** with PostgreSQL
- **TanStack React Form** + Zod for form handling
- **Resend** for transactional email via React Email templates
- **pnpm** as package manager

## Architecture

### Module System (`modules/`)

Features are organized into self-contained modules under `modules/`. Each module follows this structure:

```
modules/[feature]/
├── server/procedures.ts   # tRPC router (baseProcedure / protectedProcedure)
├── ui/
│   ├── views/             # Page-level components (*-view.tsx)
│   └── components/        # Feature-specific components
├── types.ts               # Module types
```

Current modules: `auth`, `dashboard`, `organizations`, `settings`, `schemas`, `user`.

Validation schemas live in `modules/schemas/` and are shared between client and server.

### Routing (`app/`)

- `(auth)/` — route group for sign-in, sign-up, forgot/reset password, verify email
- `dashboard/` — protected layout with sidebar; sub-routes for organization, settings
- `api/auth/[...all]/` — Better Auth catch-all handler
- `api/trpc/[trpc]/` — tRPC endpoint

Pages import view components from modules: `app/dashboard/page.tsx` renders `DashboardView` from `modules/dashboard/ui/views/`.

### tRPC (`trpc/`)

- `init.ts` — defines `baseProcedure` and `protectedProcedure` (session check via Better Auth)
- `routers/_app.ts` — combines module routers into `appRouter`
- `client.tsx` — client provider and hooks
- `server.tsx` — server-side caller utilities

### Auth (`lib/auth/`)

- `auth.ts` — Better Auth server config with Drizzle adapter, email/password, Google OAuth, organization plugin
- `auth-client.ts` — client-side auth instance with `organizationClient()` plugin
- `route-helpers.ts` — `verifySession()` and `protectRoute()` for server components
- `constants.ts` — available OAuth providers list

### Database (`drizzle/`)

- Schema in `drizzle/auth.ts` (user, session, account, verification, organization, member, invitation tables)
- Config in `drizzle.config.ts` — reads `DATABASE_URL` from env
- Connection in `lib/db.ts`

### Shared Components (`components/ui/`)

Built on Base UI + shadcn. Key subsystem:

**Form components** (`components/ui/form/`): `useAppForm` hook from `hooks.tsx` wraps TanStack React Form with pre-registered field components (`Input`, `Textarea`, `Select`, `Checkbox`) and `SubmitButton`. Usage:

```tsx
const form = useAppForm({
  defaultValues: { email: "" },
  validators: { onSubmit: someZodSchema },
  onSubmit: async ({ value }) => { /* ... */ },
});

<form.AppField name="email">
  {(field) => <field.Input label="Email" LeftIcon={MailIcon} />}
</form.AppField>
<form.AppForm><form.SubmitButton>Submit</form.SubmitButton></form.AppForm>
```

## Path Alias

`@/*` maps to the repository root. All imports use this alias (e.g., `@/components/ui/button`).

## Environment Variables

Required: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_APP_URL`, `RESEND_API_KEY`.
