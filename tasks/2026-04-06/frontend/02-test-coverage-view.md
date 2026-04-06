# Test Coverage Map View (React Flow)

**Priority:** 2
**Status:** pending
**File:** `src/frontend/routes/dev.tsx`

## Deskripsi

Visualisasi source files dan test files dengan edge menunjukkan relasi test → source. Warna menunjukkan coverage status.

## Node Types

### SourceNode
- File path, line count
- Border color: green (covered), yellow (partial), red (uncovered)
- Badge: exports count
- List test files yang cover

### TestNode
- File path
- Badge: test type (unit/integration/e2e)
- Warna per type: unit=blue, integration=green, e2e=violet

## Layout

- Source files di kiri, test files di kanan
- Edges: test → source yang di-test
- Uncovered files di-highlight dengan glow merah

## Fitur

- Filter: All / Covered / Partial / Uncovered
- Summary bar: coverage %, covered/partial/uncovered counts
- Reload button
- Click source node → open in editor (reuse openInEditor)
- Auto-save positions + viewport
