## Legacy Backend Inventory for Supabase Migration

### Source Models

- `core.models.ContentBlock` (Wagtail `Page` subclass)
  - `title` (inherited from `Page`)
  - `tag` (`CharField`)
  - `author` (`CharField`)
  - `date` (`DateField`)
  - `body` (`StreamField`) with `image`, `paragraph`, `document`, `embed`
- `core.models.FileModel`
  - `file` (`FileField`, private storage)

### Legacy API Routes Consumed by Frontend

- `GET /api/v2/pages`
  - Frontend needs: `data.items[].id`
- `GET /api/v2/pages/:id/`
  - Frontend needs: `title`, `author`, `date`, `body`
- `GET /api/v2/pages/?type=core.ContentBlock&tag=:tag`
  - Frontend needs: `data.items[].id`
- `GET /api/v2/images/:id/`
  - Frontend needs: `data.meta.download_url`
- `GET /api/v2/documents/:id/`
  - Frontend needs: `data.meta.download_url`

### Frontend Enriched Contract (Current)

`src/components/ApiHandler.tsx` enriches page payloads into:

```json
{
  "id": 31,
  "title": "string",
  "author": "string",
  "date": "YYYY-MM-DD",
  "body": [],
  "imageUrls": ["https://..."],
  "documentUrls": ["https://..."]
}
```

### Supabase Mapping

- `content_pages` table: page-level metadata.
- `page_blocks` table: normalized stream body blocks.
- `media_assets` table: image/document metadata and storage path.
- Storage buckets:
  - `seedling-images`
  - `seedling-documents`

### Compatibility Requirement

The migration keeps route semantics compatible with current frontend code by exposing:

- `/api/v3/pages`
- `/api/v3/pages/:id/`
- `/api/v3/images/:id/`
- `/api/v3/documents/:id/`

These responses are shaped so frontend cutover is limited to base URL/environment toggles.
