# User Flow View (React Flow)

**Priority:** 6
**Status:** done
**File:** `src/frontend/routes/dev.tsx`

## Deskripsi

Visualisasi navigasi user berdasarkan role. Menunjukkan kemana user diarahkan setelah login, route mana yang bisa diakses, dan redirect rules.

## Node Types

### PageNode
- Nama halaman + path
- Icon sesuai halaman
- Badge roles yang bisa akses

### DecisionNode (diamond shape)
- Role check / auth check / blocked check
- Cabang: yes/no atau per-role

### ActionNode
- Login, logout, redirect, block

## Flow

```
[Visit /] → [Login Page]
                ↓
          [Auth Check] → No → [Stay Login]
                ↓ Yes
          [Role Check]
           ↙    ↓     ↘
    SUPER_ADMIN  ADMIN  USER
        ↓         ↓      ↓
      /dev    /dashboard  /profile
        ↓         ↓
    /dashboard  /profile
        ↓
    /profile

[Blocked Check] → Yes → /blocked (logout only)
```

## Fitur Tambahan

- Warna edge per role (SUPER_ADMIN=red, ADMIN=orange, USER=blue)
- Animasi edge menunjukkan arah flow
- Legend: role warna mapping
- Auto-save positions + viewport
