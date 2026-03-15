# App Template

A template/starter for building multi-tenant SaaS applications with React, Hono, and Cloudflare Workers.

## Tech Stack

- **React 19** with TypeScript — client-only SPA
- **TanStack Router** — file-based routing with type-safe data loading
- **Hono** — API framework with RPC for end-to-end type safety
- **Cloudflare Workers** — edge deployment for both SPA and API
- **Better Auth** — authentication (email/password + Google OAuth, organizations)
- **Kysely + Neon** — type-safe SQL query builder with serverless PostgreSQL
- **Tailwind CSS 4** — utility-first styling with oklch color system
- **Turborepo** — monorepo build orchestration with caching
- **pnpm** workspaces

## Monorepo Structure

```
app-template/
├── apps/
│   ├── api/          # Standalone Hono API worker
│   └── app/          # TanStack Router SPA (Cloudflare Workers Static Assets)
├── packages/
│   ├── data-ops/     # Database, auth, password, emails, migrations, queries
│   ├── shared/       # Zod schemas, types, permissions
│   └── ui/           # UI components, hooks, utilities, CSS theme
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm

### Setup

```bash
pnpm install
```

The API requires a `.dev.vars` file in `apps/api/` with database and auth secrets (see [CLAUDE.md](CLAUDE.md) for the full list of environment variables).

The SPA defaults `VITE_API_URL` to `http://localhost:8787` for local development.

### Development

```bash
pnpm dev        # Start both API (port 8787) and SPA (port 3000)
pnpm dev:app    # SPA only
pnpm dev:api    # API only
```

## Available Scripts

| Command                               | Description                                 |
| ------------------------------------- | ------------------------------------------- |
| `pnpm dev`                            | Run all dev servers in parallel             |
| `pnpm build`                          | Build all packages with dependency ordering |
| `pnpm typecheck`                      | TypeScript checks across workspace          |
| `pnpm lint` / `pnpm lint:fix`         | Lint with oxlint                            |
| `pnpm fmt` / `pnpm fmt:check`         | Format with oxfmt                           |
| `pnpm fix`                            | Lint + format fixes combined                |
| `pnpm db:migrate`                     | Run all pending database migrations         |
| `pnpm db:codegen`                     | Regenerate DB types after migrations        |
| `pnpm syncpack` / `pnpm syncpack:fix` | Check/fix dependency version consistency    |

## Deployment

CI-driven via GitHub Actions. Push/merge to `main` triggers deployment to Cloudflare Workers.

- **API**: `api.enomisoft.com`
- **SPA**: `app.enomisoft.com`

## Project Documentation

See [CLAUDE.md](CLAUDE.md) for detailed architecture, patterns, and environment variable reference.
