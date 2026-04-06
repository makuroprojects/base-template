# Sessions & Auth Live View (React Flow)

**Priority:** 5
**Status:** pending
**File:** `src/frontend/routes/dev.tsx`

## Deskripsi

Visualisasi active sessions secara real-time. Nodes = users dengan sessions, edges = user → role → accessible routes.

## Node Types

### SessionUserNode
- User name + email
- Role badge
- Online/offline indicator (green/gray dot)
- Session count + expiry info
- Blocked indicator (red border jika blocked)

### RoleNode
- Role name (SUPER_ADMIN, ADMIN, USER)
- User count per role

### RouteAccessNode
- Route paths yang bisa diakses per role

## Layout

```
[Users]          [Roles]          [Routes]
 SuperAdmin ──→ SUPER_ADMIN ──→ /dev, /dashboard, /profile
 Admin1    ──→ ADMIN       ──→ /dashboard, /profile
 User1     ──→ USER        ──→ /profile
```

## Fitur

- Auto-refresh setiap 10 detik
- Online status dari presence
- Badge: active/expired sessions
- Summary: total sessions, online users, by role
- Reload button
- Auto-save positions + viewport
