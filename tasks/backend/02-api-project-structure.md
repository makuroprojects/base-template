# API Project Structure Endpoint

**Priority:** 2
**Status:** done
**Endpoint:** `GET /api/admin/project-structure`

## Deskripsi

Buat endpoint yang scan project directory dan parse import/export dari setiap file TypeScript/TSX. Return tree structure + dependency edges.

## Output JSON

```json
{
  "files": [
    {
      "path": "src/app.ts",
      "category": "backend",
      "lines": 350,
      "exports": ["createApp"],
      "imports": [
        { "from": "src/lib/db.ts", "names": ["prisma"] },
        { "from": "src/lib/redis.ts", "names": ["redis"] }
      ]
    }
  ],
  "directories": [
    { "path": "src", "fileCount": 5, "category": "root" },
    { "path": "src/lib", "fileCount": 5, "category": "backend" },
    { "path": "src/frontend", "fileCount": 3, "category": "frontend" }
  ],
  "summary": {
    "totalFiles": 25,
    "totalLines": 3500,
    "totalExports": 60,
    "totalImports": 120,
    "byCategory": { "frontend": 10, "backend": 8, "lib": 5, "config": 2 }
  }
}
```

## Detail

- Scan `src/`, `prisma/`, `tests/` directories
- Parse imports via regex (`import { x } from './y'` dan `import x from './y'`)
- Parse exports via regex (`export function`, `export const`, `export default`)
- Hitung line count per file
- Categorize: frontend (`src/frontend/**`), backend (`src/app.ts`, `src/index.tsx`, `src/serve.ts`), lib (`src/lib/**`), prisma (`prisma/**`), tests (`tests/**`), config (root files)
- Skip `node_modules`, `dist`, `generated`, `.git`
- SUPER_ADMIN only access
