# Data Flow View (React Flow)

**Priority:** 7
**Status:** done
**File:** `src/frontend/routes/dev.tsx`

## Deskripsi

Visualisasi lifecycle request dari client hingga response, termasuk middleware, auth, database, redis, logging, dan WebSocket flow.

## Node Types

### LayerNode
- Representasi layer arsitektur: Client, Server, Auth, Handler, Database, Redis, WebSocket

### ProcessNode
- Step dalam pipeline: request parsing, session check, role guard, business logic, response

## Flow

```
[Client Browser]
      ↓ HTTP Request
[Elysia Server]
      ↓
[onAfterResponse Hook] → [App Log (Redis)]
      ↓
[Auth Middleware] → No Session → [401 Response]
      ↓ Has Session
[Role Guard] → Insufficient → [403 Response]
      ↓ OK
[Route Handler]
   ↙        ↘
[Prisma DB]  [Redis Cache]
   ↘        ↙
[JSON Response] → [Client]

--- WebSocket Flow ---
[Client] → WS Connect → [Cookie Auth] → [Presence Tracker (Memory)]
                                              ↓
                                    [Broadcast to Admin Subs]

--- Logging Flow ---
[Every Request] → [App Log → Redis List (max 500)]
[Auth Events] → [Audit Log → PostgreSQL (rotate 90d)]
```

## Fitur Tambahan

- Grouped by concern: HTTP flow, WS flow, Logging flow
- Warna per layer: client=blue, server=green, db=orange, redis=red, ws=purple
- Animated edges menunjukkan direction
- Auto-save positions + viewport
