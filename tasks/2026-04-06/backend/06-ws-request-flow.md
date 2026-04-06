# WebSocket Live Request Flow

**Priority:** 6
**Status:** pending
**Endpoint:** enhance `WS /ws/presence` or new broadcast via app log

## Deskripsi

Extend app logging agar bisa broadcast request events ke admin subscribers secara real-time. Digunakan untuk live API request flow visualization.

## Approach

Tidak perlu WS baru. Extend existing `onAfterResponse` hook:
- Setelah log ke Redis, juga broadcast ke admin WS subscribers
- Message type baru: `{ type: 'request', method, path, status, duration }`
- Frontend subscribe via existing presence WS connection

## Message Format

```json
{
  "type": "request",
  "method": "GET",
  "path": "/api/auth/session",
  "status": 200,
  "duration": 12,
  "timestamp": "2024-01-01T10:00:00.000Z"
}
```

## Detail

- Reuse existing `/ws/presence` WebSocket — admin subs sudah ada
- Add request broadcast di `onAfterResponse` hook (hanya /api/ routes)
- Track request start time di `onRequest` untuk duration calculation
- Frontend: collect events, update node hit counts + edge animations
- Throttle broadcast: max 10 events/second to avoid flooding
- SUPER_ADMIN only (already filtered by adminSubs)
