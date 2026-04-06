# API Test Coverage Map Endpoint

**Priority:** 2
**Status:** pending
**Endpoint:** `GET /api/admin/test-coverage`

## Deskripsi

Endpoint yang scan source files dan test files, lalu mapping relasi mana yang sudah di-test dan mana yang belum.

## Output JSON

```json
{
  "sourceFiles": [
    {
      "path": "src/app.ts",
      "lines": 350,
      "exports": ["createApp"],
      "testedBy": ["tests/integration/auth-login.test.ts", "tests/integration/health.test.ts"],
      "coverage": "partial"
    },
    {
      "path": "src/lib/db.ts",
      "lines": 10,
      "exports": ["prisma"],
      "testedBy": ["tests/unit/db.test.ts"],
      "coverage": "covered"
    }
  ],
  "testFiles": [
    {
      "path": "tests/unit/db.test.ts",
      "lines": 30,
      "type": "unit",
      "targets": ["src/lib/db.ts"]
    }
  ],
  "summary": {
    "totalSource": 15,
    "totalTests": 12,
    "covered": 8,
    "partial": 4,
    "uncovered": 3,
    "coveragePercent": 80
  }
}
```

## Detail

- Scan `src/` untuk source files (exclude routeTree.gen.ts)
- Scan `tests/` untuk test files (*.test.ts)
- Parse test files: cari `import ... from '../../src/...'` untuk detect target
- Parse test files: cari `fetch('/api/...')` patterns untuk detect API route tests
- Coverage status: "covered" (langsung di-import di test), "partial" (di-test lewat integration), "uncovered" (tidak ada test)
- Type detection dari path: `tests/unit/` → unit, `tests/integration/` → integration, `tests/e2e/` → e2e
- SUPER_ADMIN only
