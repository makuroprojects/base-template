import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { parseSchema } from '../../../src/lib/schema-parser'
import { jsonText, type ToolModule } from './shared'

const ROUTES_CATALOG = [
  { method: 'PAGE', path: '/', auth: 'public', category: 'frontend', description: 'Landing page' },
  { method: 'PAGE', path: '/login', auth: 'public', category: 'frontend', description: 'Login page' },
  { method: 'PAGE', path: '/dev', auth: 'superAdmin', category: 'frontend', description: 'Dev console' },
  { method: 'PAGE', path: '/dashboard', auth: 'admin', category: 'frontend', description: 'Admin dashboard' },
  { method: 'PAGE', path: '/profile', auth: 'authenticated', category: 'frontend', description: 'User profile' },
  { method: 'PAGE', path: '/blocked', auth: 'authenticated', category: 'frontend', description: 'Blocked page' },
  { method: 'POST', path: '/api/auth/login', auth: 'public', category: 'auth', description: 'Email/password login' },
  { method: 'POST', path: '/api/auth/logout', auth: 'authenticated', category: 'auth', description: 'Logout' },
  { method: 'GET', path: '/api/auth/session', auth: 'public', category: 'auth', description: 'Current session' },
  { method: 'GET', path: '/api/auth/google', auth: 'public', category: 'auth', description: 'Google OAuth redirect' },
  { method: 'GET', path: '/api/auth/callback/google', auth: 'public', category: 'auth', description: 'Google OAuth callback' },
  { method: 'GET', path: '/api/admin/users', auth: 'superAdmin', category: 'admin', description: 'List users' },
  { method: 'PUT', path: '/api/admin/users/:id/role', auth: 'superAdmin', category: 'admin', description: 'Change role' },
  { method: 'PUT', path: '/api/admin/users/:id/block', auth: 'superAdmin', category: 'admin', description: 'Block/unblock user' },
  { method: 'GET', path: '/api/admin/presence', auth: 'superAdmin', category: 'admin', description: 'Online users' },
  { method: 'GET', path: '/api/admin/logs/app', auth: 'superAdmin', category: 'admin', description: 'App logs' },
  { method: 'GET', path: '/api/admin/logs/audit', auth: 'superAdmin', category: 'admin', description: 'Audit logs' },
  { method: 'DELETE', path: '/api/admin/logs/app', auth: 'superAdmin', category: 'admin', description: 'Clear app logs' },
  { method: 'DELETE', path: '/api/admin/logs/audit', auth: 'superAdmin', category: 'admin', description: 'Clear audit logs' },
  { method: 'GET', path: '/api/admin/schema', auth: 'superAdmin', category: 'admin', description: 'DB schema' },
  { method: 'GET', path: '/api/admin/routes', auth: 'superAdmin', category: 'admin', description: 'Routes metadata' },
  { method: 'GET', path: '/api/admin/project-structure', auth: 'superAdmin', category: 'admin', description: 'Project structure' },
  { method: 'GET', path: '/api/admin/env-map', auth: 'superAdmin', category: 'admin', description: 'Env vars map' },
  { method: 'GET', path: '/api/admin/test-coverage', auth: 'superAdmin', category: 'admin', description: 'Test coverage' },
  { method: 'GET', path: '/api/admin/dependencies', auth: 'superAdmin', category: 'admin', description: 'NPM deps graph' },
  { method: 'GET', path: '/api/admin/migrations', auth: 'superAdmin', category: 'admin', description: 'Migration timeline' },
  { method: 'GET', path: '/api/admin/sessions', auth: 'superAdmin', category: 'admin', description: 'Active sessions' },
  { method: 'GET', path: '/health', auth: 'public', category: 'utility', description: 'Health check' },
  { method: 'ALL', path: '/mcp', auth: 'secret', category: 'mcp', description: 'MCP over HTTP (MCP_SECRET bearer)' },
  { method: 'GET', path: '/api/hello', auth: 'public', category: 'utility', description: 'Hello world' },
  { method: 'WS', path: '/ws/presence', auth: 'authenticated', category: 'realtime', description: 'Presence tracker' },
]

export const projectTools: ToolModule = {
  name: 'project',
  scope: 'readonly',
  register(server) {
    server.registerTool(
      'project_routes',
      {
        title: 'Project routes',
        description: 'All HTTP + WS + frontend routes with auth level and category',
        inputSchema: {},
      },
      async () => {
        const byMethod: Record<string, number> = {}
        const byAuth: Record<string, number> = {}
        const byCategory: Record<string, number> = {}
        for (const r of ROUTES_CATALOG) {
          byMethod[r.method] = (byMethod[r.method] ?? 0) + 1
          byAuth[r.auth] = (byAuth[r.auth] ?? 0) + 1
          byCategory[r.category] = (byCategory[r.category] ?? 0) + 1
        }
        return jsonText({ routes: ROUTES_CATALOG, summary: { total: ROUTES_CATALOG.length, byMethod, byAuth, byCategory } })
      },
    )

    server.registerTool(
      'project_schema',
      {
        title: 'Prisma schema',
        description: 'Parsed Prisma schema (models, enums, relations)',
        inputSchema: {},
      },
      async () => {
        const path = join(process.cwd(), 'prisma/schema.prisma')
        if (!existsSync(path)) return jsonText({ error: 'schema.prisma not found' })
        const raw = readFileSync(path, 'utf-8')
        return jsonText({ schema: parseSchema(raw) })
      },
    )

    server.registerTool(
      'project_dependencies',
      {
        title: 'NPM dependencies',
        description: 'Runtime and dev dependencies from package.json',
        inputSchema: {},
      },
      async () => {
        const pkgPath = join(process.cwd(), 'package.json')
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
        const runtime = Object.entries(pkg.dependencies ?? {}).map(([name, version]) => ({ name, version, type: 'runtime' as const }))
        const dev = Object.entries(pkg.devDependencies ?? {}).map(([name, version]) => ({ name, version, type: 'dev' as const }))
        const all = [...runtime, ...dev]
        return jsonText({
          name: pkg.name,
          version: pkg.version,
          runtime: runtime.length,
          dev: dev.length,
          total: all.length,
          dependencies: all,
        })
      },
    )

    server.registerTool(
      'project_migrations',
      {
        title: 'Prisma migrations',
        description: 'Timeline of Prisma migrations with SQL snippet',
        inputSchema: {},
      },
      async () => {
        const dir = join(process.cwd(), 'prisma/migrations')
        if (!existsSync(dir)) return jsonText({ migrations: [], total: 0 })
        const entries = readdirSync(dir, { withFileTypes: true })
          .filter((d) => d.isDirectory() && /^\d{14}_/.test(d.name))
          .sort((a, b) => a.name.localeCompare(b.name))
        const migrations = entries.map((d) => {
          const sqlPath = join(dir, d.name, 'migration.sql')
          const sql = existsSync(sqlPath) ? readFileSync(sqlPath, 'utf-8') : ''
          const ts = d.name.slice(0, 14)
          const iso = `${ts.slice(0, 4)}-${ts.slice(4, 6)}-${ts.slice(6, 8)}T${ts.slice(8, 10)}:${ts.slice(10, 12)}:${ts.slice(12, 14)}Z`
          const lines = sql.split('\n').filter((l) => l.trim() && !l.trim().startsWith('--'))
          return {
            name: d.name,
            createdAt: iso,
            sqlPreview: lines.slice(0, 20).join('\n'),
            statementCount: sql.split(';').filter((s) => s.trim()).length,
            bytes: sql.length,
          }
        })
        return jsonText({ total: migrations.length, migrations })
      },
    )

    server.registerTool(
      'project_env_map',
      {
        title: 'Environment variables',
        description: 'Environment variables referenced in src/lib/env.ts with set/unset status',
        inputSchema: {},
      },
      async () => {
        const envTs = readFileSync(join(process.cwd(), 'src/lib/env.ts'), 'utf-8')
        const required = [...envTs.matchAll(/required\(['"](\w+)['"]\)/g)].map((m) => m[1])
        const optional = [...envTs.matchAll(/optional\(['"](\w+)['"],\s*['"]([^'"]*)['"]\)/g)].map((m) => ({ name: m[1], default: m[2] }))
        const known = [
          ...required.map((name) => ({ name, kind: 'required' as const, default: undefined as string | undefined, isSet: !!process.env[name] })),
          ...optional.map((o) => ({ name: o.name, kind: 'optional' as const, default: o.default, isSet: !!process.env[o.name] })),
        ]
        return jsonText({ total: known.length, variables: known })
      },
    )

    server.registerTool(
      'project_structure',
      {
        title: 'Project file structure',
        description: 'Scan src/ prisma/ tests/ directories; return file list with line counts',
        inputSchema: {},
      },
      async () => {
        const root = process.cwd()
        const scanDirs = ['src', 'prisma', 'tests']
        const skipDirs = new Set(['node_modules', 'dist', 'generated', '.git', '.next'])
        const exts = new Set(['.ts', '.tsx', '.prisma'])
        const files: { path: string; lines: number; bytes: number }[] = []
        function walk(dir: string) {
          if (!existsSync(dir)) return
          for (const entry of readdirSync(dir, { withFileTypes: true })) {
            if (skipDirs.has(entry.name)) continue
            const full = join(dir, entry.name)
            if (entry.isDirectory()) {
              walk(full)
              continue
            }
            const dot = entry.name.lastIndexOf('.')
            if (dot < 0 || !exts.has(entry.name.slice(dot))) continue
            try {
              const content = readFileSync(full, 'utf-8')
              const st = statSync(full)
              files.push({
                path: relative(root, full),
                lines: content.split('\n').length,
                bytes: st.size,
              })
            } catch {}
          }
        }
        for (const d of scanDirs) walk(join(root, d))
        const totalLines = files.reduce((s, f) => s + f.lines, 0)
        const totalBytes = files.reduce((s, f) => s + f.bytes, 0)
        return jsonText({ total: files.length, totalLines, totalBytes, files })
      },
    )
  },
}
