# File Structure View (React Flow)

**Priority:** 5
**Status:** done
**File:** `src/frontend/routes/dev.tsx`

## Deskripsi

Visualisasi directory tree + import dependency graph. Setiap file jadi node, edge menunjukkan import relationship.

## Node Types

### DirectoryNode
- Folder icon + nama
- Badge: jumlah file di dalamnya
- Warna per kategori: frontend=blue, backend=green, lib=violet, prisma=orange, tests=yellow, config=gray

### FileNode
- File icon + nama (tanpa path prefix)
- Info: line count, jumlah exports
- Warna sesuai kategori parent directory
- Hover tooltip: list exports

## Layout

- Tree layout: directories di kiri, files expand ke kanan
- Import edges: garis dari file A ke file B jika A imports dari B
- Edge label: nama yang di-import

## Fitur Tambahan

- Filter by kategori (SegmentedControl: All / Frontend / Backend / Lib / Tests)
- Search box: highlight node yang match
- Stats bar: total files, total lines, most imported file
- Click node → bisa lihat daftar exports dan imports
- Auto-save positions + viewport
