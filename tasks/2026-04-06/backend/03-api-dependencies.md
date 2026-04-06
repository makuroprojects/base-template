# API Dependencies Graph Endpoint

**Priority:** 3
**Status:** pending
**Endpoint:** `GET /api/admin/dependencies`

## Deskripsi

Endpoint yang return semua npm packages dari package.json beserta metadata: versi, tipe (runtime/dev), dan file mana yang import-nya.

## Output JSON

```json
{
  "packages": [
    {
      "name": "@elysiajs/cors",
      "version": "^1.0.0",
      "type": "runtime",
      "category": "server",
      "usedBy": ["src/app.ts"]
    },
    {
      "name": "@xyflow/react",
      "version": "^12.0.0",
      "type": "runtime",
      "category": "ui",
      "usedBy": ["src/frontend/routes/dev.tsx"]
    }
  ],
  "summary": {
    "total": 20,
    "runtime": 12,
    "dev": 8,
    "byCategory": { "server": 3, "ui": 6, "database": 2, "build": 4, "test": 2, "other": 3 }
  }
}
```

## Detail

- Parse `package.json` untuk dependencies + devDependencies + versions
- Scan source files untuk `import ... from 'package-name'` (non-relative imports)
- Auto-categorize packages:
  - server: elysia, cors, html
  - ui: react, mantine, tanstack, xyflow, react-icons
  - database: prisma
  - build: vite, typescript, biome
  - test: bun:test related
- Map usedBy: which source files import each package
- SUPER_ADMIN only
