# AGENTS.md — rws-kanban-board

## Project structure

pnpm workspace monorepo with two packages:

- **`client/`** — React 19 + Vite + Tailwind CSS v4 + shadcn/ui (Radix Vega style)
  - Entry: `client/src/main.tsx`
  - Path alias: `@/` → `client/src/`
  - Dev: `pnpm --filter client dev`
- **`server/`** — Express 5 + Apollo Server 5 + Drizzle ORM + PostgreSQL (Neon)
  - Entry: `server/src/index.ts` (calls `startServer()` from `server/src/server.ts`)
  - Dev: `pnpm --filter server dev`
  - Env: `.env.local` (dev), `.env.staging` (staging), `.env` (prod) — validated by zod in `server/env.ts`

## Key commands

| Action | Command |
|--------|---------|
| Client dev server | `pnpm --filter client dev` |
| Client build | `pnpm --filter client build` (runs `tsc -b && vite build`) |
| Client lint | `pnpm --filter client lint` (`eslint .`) |
| Client typecheck | `pnpm --filter client typecheck` (`tsc --noEmit`) |
| Client test | `pnpm --filter client test` (vitest) |
| Client test:watch | `pnpm --filter client test:watch` |
| Client test:coverage | `pnpm --filter client test:coverage` |
| Client Storybook | `pnpm --filter client storybook` (port 6006) |
| Server dev | `pnpm --filter server dev` (node --watch) |
| Server test | `pnpm --filter server test` (vitest) |
| Server lint | `pnpm --filter server lint` (`eslint .`) |
| Server lint:fix | `pnpm --filter server lint:fix` |
| Server migrate | `pnpm --filter server exec drizzle-kit` |
| Format all | `pnpm format` (prettier --write .) |
| Format check | `pnpm format:check` |

No top-level `build`, `test`, or `lint` script exists — must use `--filter` for each package or run `pnpm -r`.

## Testing conventions

- **Client:** Vitest, jsdom environment, setup file at `src/test/setup.ts` (imports `@testing-library/jest-dom/vitest`). Test files match `src/**/*.{test,spec}.{ts,tsx}`.
- **Server:** Vitest, node environment, test files match `src/**/*.test.ts`.
- **Server DB mocking:** `vi.mock('../db/index.ts')` + `__mocks__/index.ts` at `server/src/db/__mocks__/`. The mock exports a `db` object with vi.fn() chains for `select`, `insert`, `update`, `delete`. Resolver unit tests use `vi.mocked(db.select).mockReturnValue(...)` patterns with helper functions like `mockSelectResult()`, `mockInsertResult()`, etc.
- **Integration tests:** Boot real Apollo Server via `startServer()` + supertest, with DB still mocked underneath.

## Formatting & linting

- Prettier: 120 print width, single quotes, trailing commas, semicolons, LF, tailwindcss plugin (functions: `clsx`, `tw`)
- ESLint (both packages): TypeScript strict, `no-explicit-any` is error, unused imports are error, unused vars are warn with `^_` ignore
- VS Code: format on save with Prettier, eslint autofix on save

## Architecture notes

- **DB schema** (`server/src/db/schema.ts`): three tables — `boards` → `columns` → `cards` (cascade deletes)
- **GraphQL** (`server/src/graphql/`): SDL typeDefs + resolver map, assembled in `schema.ts`
- No React Router or data-fetching library wired yet (bare Apollo Server, no Apollo Client on client side)
- `client/assets/` directory exists but is empty
- `client/public/` directory exists (contains `favicon.svg`)
- `docs/superpowers/` directory exists for agentic planning artifacts (not for production docs)

## Tools

- **Package manager:** pnpm >= 11.1.3 (enforced by server/package.json devEngines)
- **Node:** ESM throughout (`"type": "module"` in all package.json files)
- **TypeScript:** ~6.0 (client), bundler module resolution, `verbatimModuleSyntax` required
