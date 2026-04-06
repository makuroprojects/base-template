# Live API Request Flow View (React Flow)

**Priority:** 6
**Status:** pending
**File:** `src/frontend/routes/dev.tsx`

## Deskripsi

Visualisasi live API requests sebagai animated flow. Setiap request masuk, edge animate dari client → endpoint node. Node size/glow berdasarkan frekuensi hit.

## Node Types

### EndpointNode
- Method + path
- Hit counter (total requests since view opened)
- Last status code
- Average response time
- Glow intensity based on recent activity

## Layout

- Reuse API Routes layout tapi simplified
- Central "Server" node
- Endpoint nodes around it
- Animated edges saat request masuk

## Fitur

- Real-time via existing WS /ws/presence (new message type: 'request')
- Hit counter per endpoint
- Color flash: green (2xx), yellow (4xx), red (5xx)
- Status summary bar: total requests, avg response time, error rate
- Pause/resume button
- Clear counters button
- Auto-save positions + viewport
