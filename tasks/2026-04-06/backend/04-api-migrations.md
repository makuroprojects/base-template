# API Migrations Timeline Endpoint

**Priority:** 4
**Status:** pending
**Endpoint:** `GET /api/admin/migrations`

## Deskripsi

Endpoint yang scan Prisma migrations folder dan return timeline kronologis semua migrasi beserta perubahan yang dilakukan.

## Output JSON

```json
{
  "migrations": [
    {
      "name": "20240101_init",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "changes": ["CREATE TABLE User", "CREATE TABLE Session", "CREATE ENUM Role"],
      "sql": "-- truncated first 500 chars of migration.sql"
    }
  ],
  "currentSchema": {
    "models": ["User", "Session", "AuditLog"],
    "enums": ["Role"]
  },
  "summary": {
    "totalMigrations": 3,
    "firstMigration": "2024-01-01",
    "lastMigration": "2024-06-15",
    "totalChanges": 12
  }
}
```

## Detail

- Scan `prisma/migrations/` directory
- Parse each `migration.sql` file
- Extract date from folder name (format: YYYYMMDDHHMMSS_name)
- Parse SQL changes: detect CREATE TABLE, ALTER TABLE, CREATE INDEX, DROP, CREATE TYPE (enum)
- Return chronological order
- Include first 500 chars of SQL for preview
- SUPER_ADMIN only
