# API Sessions Live Endpoint

**Priority:** 5
**Status:** pending
**Endpoint:** `GET /api/admin/sessions`

## Deskripsi

Endpoint yang return semua active sessions dari DB, grouped by user, termasuk info online status dari presence tracker.

## Output JSON

```json
{
  "sessions": [
    {
      "id": "uuid",
      "userId": "uuid",
      "userName": "Super Admin",
      "userEmail": "superadmin@example.com",
      "userRole": "SUPER_ADMIN",
      "userBlocked": false,
      "isOnline": true,
      "createdAt": "2024-01-01T10:00:00.000Z",
      "expiresAt": "2024-01-02T10:00:00.000Z",
      "isExpired": false
    }
  ],
  "summary": {
    "totalSessions": 5,
    "activeSessions": 4,
    "expiredSessions": 1,
    "onlineUsers": 2,
    "byRole": { "SUPER_ADMIN": 1, "ADMIN": 2, "USER": 2 }
  }
}
```

## Detail

- Query all sessions from DB with user info
- Cross-reference dengan presence tracker untuk online status
- Include expired status (expiresAt < now)
- Group summary by role
- SUPER_ADMIN only
