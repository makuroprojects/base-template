# Dev Sidebar - Project Menu

**Priority:** 3
**Status:** done
**File:** `src/frontend/routes/dev.tsx`

## Deskripsi

Tambah menu "Project" di sidebar Dev Console, di antara "Database" dan "Settings". Icon: `TbFolderCode` atau `TbSitemap`.

## Detail

- Tambah NavLink "Project" di sidebar
- Tab key: `project`
- Render `ProjectPanel` component
- URL: `/dev?tab=project`
- Panel berisi SegmentedControl untuk switch sub-view:
  - `API Routes` — visualisasi semua endpoint
  - `File Structure` — directory + import graph
  - `User Flow` — frontend route navigation map
  - `Data Flow` — request lifecycle visualization
- Masing-masing sub-view punya React Flow canvas sendiri
- Auto-save positions & viewport per sub-view (key berbeda di localStorage)
