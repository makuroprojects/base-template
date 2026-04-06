# Migration Timeline View (React Flow)

**Priority:** 4
**Status:** pending
**File:** `src/frontend/routes/dev.tsx`

## Deskripsi

Visualisasi kronologis semua Prisma migrations sebagai horizontal timeline dengan detail perubahan.

## Node Types

### MigrationNode
- Migration name (tanpa timestamp prefix)
- Date badge
- List changes (CREATE TABLE, ALTER TABLE, dll)
- SQL preview (truncated)
- Click to expand full SQL

## Layout

- Horizontal timeline: left to right chronological
- Edge: sequential migration → next migration
- Current schema summary di paling kanan

## Fitur

- Reload button
- SQL preview on hover/click
- Color per change type: CREATE=green, ALTER=yellow, DROP=red
- Summary: total migrations, date range
- Auto-save positions + viewport
