# AGENTS.md — rws-kanban-board

## Project structure

pnpm workspace monorepo (`pnpm-workspace.yaml`: `client/`, `server/`) with two packages:

- **`client/`** — React 19 + Vite + Tailwind CSS v4 + shadcn/ui (Radix Vega style)
  - Entry: `client/src/main.tsx`
  - Path alias: `@/` → `client/src/`
  - **Routing:** TanStack React Router (auto-generated `routeTree.gen.ts`), full type safety via `Register`
  - **Data fetching:** TanStack React Query (`QueryClientProvider` in root) + custom GraphQL client (`src/util/graphql.ts`) using raw `fetch`
  - **GraphQL queries/mutations:** in `src/graphql/` with TanStack Query key factory at `src/graphql/queryKeys.ts`
  - Dev: `pnpm --filter client dev`
- **`server/`** — Express 5 + Apollo Server 5 + Drizzle ORM + PostgreSQL (Neon)
  - Entry: `server/src/index.ts` (calls `startServer()` from `server/src/server.ts`)
  - Dev: `pnpm --filter server dev`
  - Env: `.env.local` (dev), `.env.staging` (staging), `.env` (prod), `.env.example` — validated by zod in `server/env.ts`
  - Env vars: `DATABASE_URL`, `NODE_ENV`, `PORT`, `HOST`, `CORS_ORIGIN` (comma-separated string→array), `LOG_LEVEL`
  - **TypeScript:** no tsconfig or TS compiler — runs via Node native TS stripping (`node --watch`)

## Key commands

| Action | Command |
|--------|---------|
| Client dev server | `pnpm --filter client dev` |
| Client build | `pnpm --filter client build` (runs `tsc -b && vite build`) |
| Client preview | `pnpm --filter client preview` |
| Client lint | `pnpm --filter client lint` (`eslint .`) |
| Client lint:fix | `pnpm --filter client lint:fix` |
| Client typecheck | `pnpm --filter client typecheck` (`tsc --noEmit`) |
| Client test | `pnpm --filter client test` (vitest) |
| Client test:watch | `pnpm --filter client test:watch` |
| Client test:coverage | `pnpm --filter client test:coverage` |
| Client Storybook | `pnpm --filter client storybook` (port 6006) |
| Client build-storybook | `pnpm --filter client build-storybook` |
| Server dev | `pnpm --filter server dev` (node --watch) |
| Server start | `pnpm --filter server start` |
| Server test | `pnpm --filter server test` (vitest) |
| Server test:watch | `pnpm --filter server test:watch` |
| Server test:ui | `pnpm --filter server test:ui` |
| Server lint | `pnpm --filter server lint` (`eslint .`) |
| Server lint:fix | `pnpm --filter server lint:fix` |
| Server migrate | `pnpm --filter server exec drizzle-kit` |
| Format all | `pnpm format` (prettier --write .) |
| Format check | `pnpm format:check` |
| Setup git hooks | `pnpm prepare` (husky) |

No top-level `build`, `test`, or `lint` script exists — must use `--filter` for each package or run `pnpm -r`. Root `lint-staged` config runs ESLint + Prettier on staged files for both packages.

## Testing conventions

- **Client:** Vitest, jsdom environment, setup file at `src/test/setup.ts` (imports `@testing-library/jest-dom/vitest`). Test files match `src/**/*.{test,spec}.{ts,tsx}`.
- **Server:** Vitest, node environment, test files match `src/**/*.test.ts`.
- **Server DB mocking:** `vi.mock('../db/index.ts')` + `__mocks__/index.ts` at `server/src/db/__mocks__/`. The mock exports a `db` object with vi.fn() chains for `select`, `insert`, `update`, `delete`. Resolver unit tests use `vi.mocked(db.select).mockReturnValue(...)` patterns with helper functions like `mockSelectResult()`, `mockInsertResult()`, etc.
- **Integration tests:** Boot real Apollo Server via `startServer()` + supertest, with DB still mocked underneath.

## Formatting & linting

- Prettier: 120 print width, single quotes, trailing commas, semicolons, LF, tailwindcss plugin (functions: `clsx`, `tw`)
- ESLint (both packages): flat config, TypeScript strict, `no-explicit-any` is error, unused imports are error, unused vars are warn with `^_` ignore
- VS Code: format on save with Prettier, eslint autofix on save

## Architecture notes

- **DB schema** (`server/src/db/schema.ts`): three tables — `boards` (id, title, createdAt, updatedAt) → `columns` (id, boardId, title, position) → `cards` (id, columnId, title, description, position, createdAt) with cascade deletes
- **GraphQL** (`server/src/graphql/`): SDL typeDefs + resolver map, assembled in `schema.ts`; served at `/graphql` via `@as-integrations/express5`
- **Vite config** (`client/vite.config.ts`): plugins — `tanstackRouter()` (autoCodeSplitting), `react()`, `tailwindcss()`; test (jsdom, V8 coverage); dev server proxies `/graphql` → `http://localhost:3000`
- **Client sources:** pages in `src/pages/`, routes in `src/routes/`, GraphQL client/util in `src/graphql/` and `src/util/`, hooks in `src/hooks/`, lib utilities in `src/lib/`, UI components in `src/components/ui/` and `src/components/layout/`
- `client/src/assets/` directory exists but is empty
- `client/public/` directory exists (empty)
- `docs/superpowers/` directory exists for agentic planning artifacts (not for production docs)

## Tools

- **Package manager:** pnpm >= 11.1.3 (enforced by server/package.json devEngines)
- **Node:** ESM throughout (`"type": "module"` in all package.json files)
- **TypeScript (client):** ~6.0.2, bundler module resolution, `verbatimModuleSyntax` required, `erasableSyntaxOnly: true`, target `es2023`
- **TypeScript (server):** no tsconfig — Node native TS stripping handles `.ts` files at runtime
- **Git hooks:** Husky (installed via `pnpm prepare`)
