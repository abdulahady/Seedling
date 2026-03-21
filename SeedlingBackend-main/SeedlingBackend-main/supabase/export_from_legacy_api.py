import json
import os
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

import requests


LEGACY_API_BASE = os.getenv(
    "LEGACY_API_BASE", "https://seedlingbackend-production.up.railway.app/api/v2"
)


def fetch_json(url: str):
    response = requests.get(url, timeout=20)
    response.raise_for_status()
    return response.json()


def main():
    output_path = Path(
        os.getenv("SEEDLING_EXPORT_PATH", "supabase/export/contentblocks.json")
    )
    output_path.parent.mkdir(parents=True, exist_ok=True)

    pages_response = fetch_json(f"{LEGACY_API_BASE}/pages?type=core.ContentBlock&limit=1000")
    items = pages_response.get("items", [])
    page_ids = [item.get("id") for item in items if item.get("id")]
    payload = []

    def fetch_page_detail(page_id: int):
        detail = fetch_json(f"{LEGACY_API_BASE}/pages/{page_id}/")
        return {
            "id": detail.get("id"),
            "title": detail.get("title"),
            "tag": detail.get("tag"),
            "author": detail.get("author"),
            "published_date": detail.get("date"),
            "legacy_type": "core.ContentBlock",
            "body": detail.get("body", []),
        }

    with ThreadPoolExecutor(max_workers=12) as executor:
        futures = [executor.submit(fetch_page_detail, page_id) for page_id in page_ids]
        for future in as_completed(futures):
            payload.append(future.result())

    payload.sort(key=lambda page: page.get("id") or 0)

    output_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(f"Exported {len(payload)} pages to {output_path.as_posix()}")


if __name__ == "__main__":
    main()
