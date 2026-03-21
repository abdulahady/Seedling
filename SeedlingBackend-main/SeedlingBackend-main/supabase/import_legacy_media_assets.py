import json
import os
from pathlib import Path

import requests


LEGACY_API_BASE = os.getenv(
    "LEGACY_API_BASE", "https://seedlingbackend-production.up.railway.app/api/v2"
)


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


def fetch_json(url: str):
    response = requests.get(url, timeout=20)
    response.raise_for_status()
    return response.json()


def main():
    export_path = Path(
        os.getenv("SEEDLING_EXPORT_PATH", "supabase/export/contentblocks.json")
    )
    if not export_path.exists():
        raise FileNotFoundError(f"Missing export file: {export_path}")

    pages = json.loads(export_path.read_text(encoding="utf-8"))
    media_pairs = set()
    for page in pages:
        for block in page.get("body", []) or []:
            block_type = block.get("type")
            block_value = block.get("value")
            if block_type in {"image", "document"} and isinstance(block_value, int):
                media_pairs.add((block_type, block_value))

    media_rows = []
    for asset_type, asset_id in sorted(media_pairs, key=lambda x: (x[0], x[1])):
        payload = fetch_json(f"{LEGACY_API_BASE}/{asset_type}s/{asset_id}/")
        media_rows.append(
            {
                "id": asset_id,
                "asset_type": asset_type,
                "title": payload.get("title"),
                "bucket_name": "legacy-external",
                "object_path": payload.get("meta", {}).get("download_url"),
                "mime_type": None,
            }
        )

    response = requests.post(
        _rest_url("media_assets", on_conflict="id"),
        headers=_headers(),
        data=json.dumps(media_rows),
        timeout=30,
    )
    if not response.ok:
        raise RuntimeError(
            f"Failed media import: {response.status_code} {response.text}"
        )

    print(f"Imported {len(media_rows)} media_assets rows into Supabase.")


if __name__ == "__main__":
    main()
