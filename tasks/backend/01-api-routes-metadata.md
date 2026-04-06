# API Routes Metadata Endpoint

**Priority:** 1 (highest)
**Status:** done
**Endpoint:** `GET /api/admin/routes`

## Deskripsi

Buat endpoint yang mengekstrak semua route metadata dari Elysia app secara runtime. Data ini menjadi sumber utama untuk visualisasi di frontend.

## Output JSON

```json
{
  "routes": [
    {
      "method": "GET",
      "path": "/api/auth/session",
      "auth": "authenticated",
      "category": "auth",
      "description": "Check current session"
    }
  ],
  "websockets": [
    {
      "path": "/ws/presence",
      "auth": "authenticated",
      "category": "realtime",
      "description": "Real-time presence"
    }
  ],
  "summary": {
    "total": 18,
    "byMethod": { "GET": 10, "POST": 3, "PUT": 2, "DELETE": 2, "WS": 1 },
    "byAuth": { "public": 3, "authenticated": 5, "superAdmin": 10 },
    "byCategory": { "auth": 5, "admin": 8, "utility": 2, "realtime": 1, "frontend": 6 }
  }
}
```

## Detail

- Gunakan `app.routes` dari Elysia untuk daftar routes
- Categorize otomatis berdasarkan path prefix (`/api/auth/*` → auth, `/api/admin/*` → admin, dll)
- Detect auth level dari guard/hook yang dipakai (public, authenticated, SUPER_ADMIN)
- Include frontend routes (`/`, `/login`, `/dev`, `/dashboard`, `/profile`, `/blocked`)
- Include WebSocket endpoints terpisah
- SUPER_ADMIN only access
