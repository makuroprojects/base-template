# Environment Map View (React Flow)

**Priority:** 1
**Status:** pending
**File:** `src/frontend/routes/dev.tsx`

## Deskripsi

Visualisasi semua env variables, grouped by category, dengan edge menunjukkan file mana yang consume-nya.

## Node Types

### EnvVarNode
- Nama variable
- Badge: required (red) / optional (gray)
- Status indicator: set (green dot) / unset (red dot) / has default (yellow dot)
- Default value jika ada
- Description text

### EnvConsumerNode
- File path yang menggunakan env
- Badge: berapa env yang dipakai

## Layout

```
[Database]           [Auth]              [App]
 DATABASE_URL        GOOGLE_CLIENT_ID     PORT
       ↓             GOOGLE_CLIENT_SECRET REACT_EDITOR
 src/lib/db.ts       SUPER_ADMIN_EMAIL    AUDIT_LOG_RETENTION_DAYS
                           ↓
                     src/lib/env.ts
                     src/app.ts
```

## Fitur

- Warna node per category
- Unset variables di-highlight merah sebagai warning
- Reload button
- Auto-save positions + viewport
- Summary bar: total vars, set/unset count, required count
