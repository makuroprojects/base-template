Default to using Bun instead of Node.js.

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>`
- Use `bunx <package> <command>` instead of `npx <package> <command>`
- Bun automatically loads .env, so don't use dotenv.

## Server

Elysia.js as the HTTP framework, running on Bun. API routes are in `src/app.ts` (exported as `createApp()`), frontend serving and dev tools are in `src/index.tsx`.

- `src/app.ts` — Elysia app factory with all API routes (auth, hello, health, Google OAuth). Testable via `app.handle(request)`.
- `src/index.tsx` — Server entry. Adds Vite middleware (dev) or static file serving (prod), click-to-source editor integration, and `.listen()`.
- `src/serve.ts` — Dev entry (`bun --watch src/serve.ts`). Dynamic import workaround for Bun EADDRINUSE race.

## Database

PostgreSQL via Prisma v6. Client generated to `./generated/prisma` (gitignored).

- Schema: `prisma/schema.prisma` — User (id, name, email, password, timestamps) + Session (id, token, userId, expiresAt)
- Client singleton: `src/lib/db.ts` — import `{ prisma }` from here
- Seed: `prisma/seed.ts` — demo users with `Bun.password.hash` bcrypt
- Commands: `bun run db:migrate`, `bun run db:seed`, `bun run db:generate`

## Auth

Session-based auth with HttpOnly cookies stored in DB.

- Login: `POST /api/auth/login` — finds user by email, verifies password with `Bun.password.verify`, creates Session record
- Google OAuth: `GET /api/auth/google` → Google → `GET /api/auth/callback/google` — upserts user, creates session
- Session: `GET /api/auth/session` — looks up session by cookie token, returns user or 401, auto-deletes expired
- Logout: `POST /api/auth/logout` — deletes session from DB, clears cookie

## Frontend

React 19 + Vite 8 (middleware mode in dev). File-based routing with TanStack Router.

- Entry: `src/frontend.tsx` — renders App, removes splash screen, DevInspector in dev
- App: `src/frontend/App.tsx` — MantineProvider (dark, forced), QueryClientProvider, RouterProvider
- Routes: `src/frontend/routes/` — `__root.tsx`, `index.tsx`, `login.tsx`, `dashboard.tsx`
- Auth hooks: `src/frontend/hooks/useAuth.ts` — `useSession()`, `useLogin()`, `useLogout()`
- UI: Mantine v8 (dark theme `#242424`), react-icons
- Splash: `index.html` has inline dark CSS + spinner, removed on React mount

## Dev Tools

- Click-to-source: `Ctrl+Shift+Cmd+C` toggles inspector. Custom Vite plugin (`inspectorPlugin` in `src/vite.ts`) injects `data-inspector-*` attributes. Reads original file from disk for accurate line numbers.
- HMR: Vite 8 with `@vitejs/plugin-react` v6. `dedupeRefreshPlugin` fixes double React Refresh injection.
- Editor: `REACT_EDITOR` env var. `zed` and `subl` use `file:line:col`, others use `--goto file:line:col`.

## Testing

Tests use `bun:test`. Three levels:

```bash
bun run test              # All tests
bun run test:unit         # tests/unit/ — env, db connection, bcrypt
bun run test:integration  # tests/integration/ — API endpoints via app.handle()
bun run test:e2e          # tests/e2e/ — browser tests via Lightpanda CDP
```

- `tests/helpers.ts` — `createTestApp()`, `seedTestUser()`, `createTestSession()`, `cleanupTestData()`
- Integration tests use `createApp().handle(new Request(...))` — no server needed
- E2E tests use Lightpanda browser (Docker, `ws://127.0.0.1:9222`). App URLs use `host.docker.internal` from container. Lightpanda executes JS but POST fetch returns 407 — use integration tests for mutations.

## APIs

- `Bun.password.hash()` / `Bun.password.verify()` for bcrypt
- `Bun.file()` for static file serving in production
- `Bun.which()` / `Bun.spawn()` for editor integration
- `crypto.randomUUID()` for session tokens
