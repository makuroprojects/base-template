# API Environment Map Endpoint

**Priority:** 1 (highest)
**Status:** pending
**Endpoint:** `GET /api/admin/env-map`

## Deskripsi

Endpoint yang return semua environment variables yang dipakai project, statusnya (set/unset/default), dan file mana yang consume-nya.

## Output JSON

```json
{
  "variables": [
    {
      "name": "DATABASE_URL",
      "required": true,
      "isSet": true,
      "default": null,
      "category": "database",
      "description": "PostgreSQL connection string",
      "usedBy": ["src/lib/db.ts"]
    },
    {
      "name": "REDIS_URL",
      "required": true,
      "isSet": true,
      "default": null,
      "category": "cache",
      "description": "Redis connection string",
      "usedBy": ["src/lib/redis.ts"]
    },
    {
      "name": "PORT",
      "required": false,
      "isSet": false,
      "default": "3000",
      "category": "app",
      "description": "Server port",
      "usedBy": ["src/lib/env.ts", "src/index.tsx"]
    }
  ],
  "summary": {
    "total": 8,
    "set": 6,
    "unset": 2,
    "required": 4,
    "byCategory": { "database": 1, "cache": 1, "auth": 3, "app": 3 }
  }
}
```

## Detail

- Baca `src/lib/env.ts` untuk daftar env variables + required/optional + default values
- Scan semua `.ts/.tsx` files untuk `env.VARIABLE_NAME` dan `process.env.VARIABLE_NAME` usage
- Check `process.env` runtime untuk status set/unset (JANGAN expose value, hanya boolean isSet)
- Categorize: database, cache, auth (Google OAuth), app (PORT, REACT_EDITOR, dll)
- SUPER_ADMIN only
