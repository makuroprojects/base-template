# API Routes View (React Flow)

**Priority:** 4
**Status:** done
**File:** `src/frontend/routes/dev.tsx`

## Deskripsi

Visualisasi semua API endpoint dan frontend routes dalam React Flow. Grouped by category dengan edge menunjukkan flow antar endpoint.

## Node Types

### RouteNode
- Badge method (GET=green, POST=blue, PUT=orange, DELETE=red, WS=purple)
- Path text
- Auth badge (public=gray, auth=yellow, superadmin=red)
- Category badge kecil

### CategoryNode
- Group header node (Auth, Admin, Utility, Frontend, WebSocket)
- Berisi count routes di dalamnya

## Layout

```
[Frontend Routes]     [Auth Routes]        [Admin Routes]
 /                    POST /login          GET /users
 /login               GET /session         PUT /users/:id/role
 /dev                 POST /logout         PUT /users/:id/block
 /dashboard           GET /google          GET /logs/app
 /profile             GET /callback        ...
 /blocked

[Utility]             [WebSocket]
 GET /hello            WS /ws/presence
 GET /health
```

## Edges

- Login → redirect ke frontend routes (berdasarkan role)
- Google OAuth → callback → redirect
- Session check → 401 → login redirect
- Admin routes → auth dependency
- Presence WS → admin presence endpoint

## Fitur Tambahan

- Tooltip on hover: detail endpoint (request/response schema jika ada)
- Summary bar: total routes, by method, by auth level
- Auto-save positions + viewport
