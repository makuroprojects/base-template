# Dependency Graph View (React Flow)

**Priority:** 3
**Status:** pending
**File:** `src/frontend/routes/dev.tsx`

## Deskripsi

Visualisasi semua npm packages, grouped by category dan type (runtime/dev), dengan edge menunjukkan file mana yang import-nya.

## Node Types

### PackageNode
- Package name + version
- Badge: runtime (green) / dev (orange)
- Category badge
- usedBy count

### ConsumerNode (reuse FileNode2)
- File yang import package

## Layout

- Packages grouped by category (columns)
- Files di bawah, connected ke packages yang di-import

## Fitur

- Filter: All / Runtime / Dev
- Group by: Category / Type
- Summary bar: total packages, runtime/dev split
- Reload button
- Auto-save positions + viewport
