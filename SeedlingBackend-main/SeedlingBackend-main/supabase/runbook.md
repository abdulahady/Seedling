## Supabase Migration Runbook

### 1) Provision Supabase

1. Create project and copy:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
2. Create storage buckets:
   - `seedling-images` (public)
   - `seedling-documents` (public)
3. Apply [`supabase/schema.sql`](./schema.sql).

### 2) Export Legacy Content

From Django backend root:

```bash
python manage.py export_contentblocks --output supabase/export/contentblocks.json
```

### 3) Import Into Supabase

Set env vars and run:

```bash
python supabase/import_content.py
```

Required env vars:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- optional `SEEDLING_EXPORT_PATH`

### 4) Validate Parity

Run compatibility checks:

```bash
python supabase/parity_check.py
```

This compares:
- tag query id parity
- page title/author/date parity
- body block counts

### 5) Frontend Cutover

Set either:

- `VITE_USE_SUPABASE_BACKEND=true`
- or `VITE_API_BASE_URL=<supabase-compatible-api-url>`

Frontend will then call `/api/v3` compatibility endpoints.

### 6) Stabilization

- Watch server logs for `/api/v3/*` errors and latency.
- Run parity check on representative IDs after each deploy.
- Keep `ENABLE_LEGACY_WAGTAIL_API=true` until stable.

### 7) Decommission Legacy

When stable:

1. Set `ENABLE_LEGACY_WAGTAIL_API=false`
2. Redeploy backend
3. Keep parity script for post-cutover regression checks
