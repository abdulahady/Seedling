import json
import os
from pathlib import Path

import requests


def _required_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(f"Missing env var: {name}")
    return value


def _headers() -> dict:
    service_key = _required_env("SUPABASE_SERVICE_ROLE_KEY")
    return {
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates",
    }


def _rest_url(table: str, on_conflict: str | None = None) -> str:
    base = _required_env("SUPABASE_URL").rstrip("/")
    if on_conflict:
        return f"{base}/rest/v1/{table}?on_conflict={on_conflict}"
    return f"{base}/rest/v1/{table}"


def upsert_rows(table: str, rows: list[dict], on_conflict: str | None = None):
    if not rows:
        return
    response = requests.post(
        _rest_url(table, on_conflict=on_conflict),
        headers=_headers(),
        data=json.dumps(rows),
        timeout=30,
    )
    if not response.ok:
        raise RuntimeError(
            f"Failed upsert for {table}: {response.status_code} {response.text}"
        )


def main():
    export_path = Path(
        os.getenv("SEEDLING_EXPORT_PATH", "supabase/export/contentblocks.json")
    )
    if not export_path.exists():
        raise FileNotFoundError(
            f"Export file not found: {export_path}. Run export_contentblocks first."
        )

    pages = json.loads(export_path.read_text(encoding="utf-8"))
    content_pages = []
    page_blocks = []

    for page in pages:
        content_pages.append(
            {
                "id": page["id"],
                "title": page.get("title"),
                "tag": page.get("tag"),
                "author": page.get("author"),
                "published_date": page.get("published_date"),
                "legacy_type": page.get("legacy_type", "core.ContentBlock"),
            }
        )

        body = page.get("body") or []
        for index, block in enumerate(body):
            page_blocks.append(
                {
                    "page_id": page["id"],
                    "block_order": index,
                    "block_type": block.get("type"),
                    "block_value": block.get("value"),
                }
            )

    upsert_rows("content_pages", content_pages, on_conflict="id")
    upsert_rows("page_blocks", page_blocks, on_conflict="page_id,block_order")
    print(
        f"Imported {len(content_pages)} content_pages and {len(page_blocks)} page_blocks into Supabase."
    )


if __name__ == "__main__":
    main()
