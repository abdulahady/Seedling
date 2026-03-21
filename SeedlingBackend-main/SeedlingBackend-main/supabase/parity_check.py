import json
import os
from typing import Any

import requests


LEGACY_BASE = os.getenv(
    "LEGACY_API_BASE", "https://seedlingbackend-production.up.railway.app/api/v2"
)
SUPABASE_COMPAT_BASE = os.getenv("SUPABASE_COMPAT_BASE", "http://localhost:8000/api/v3")


def fetch_json(url: str) -> Any:
    response = requests.get(url, timeout=20)
    response.raise_for_status()
    return response.json()


def check_page_ids(tag: str):
    legacy = fetch_json(f"{LEGACY_BASE}/pages/?type=core.ContentBlock&tag={tag}")
    compat = fetch_json(f"{SUPABASE_COMPAT_BASE}/pages?type=core.ContentBlock&tag={tag}")
    legacy_ids = sorted([item["id"] for item in legacy.get("items", [])])
    compat_ids = sorted([item["id"] for item in compat.get("items", [])])
    return {"tag": tag, "legacy_ids": legacy_ids, "compat_ids": compat_ids}


def check_page_detail(page_id: int):
    legacy = fetch_json(f"{LEGACY_BASE}/pages/{page_id}/")
    compat = fetch_json(f"{SUPABASE_COMPAT_BASE}/pages/{page_id}/")
    return {
        "page_id": page_id,
        "title_match": legacy.get("title") == compat.get("title"),
        "author_match": legacy.get("author") == compat.get("author"),
        "date_match": str(legacy.get("date")) == str(compat.get("date")),
        "legacy_body_count": len(legacy.get("body", [])),
        "compat_body_count": len(compat.get("body", [])),
    }


def main():
    tags = ["transfer", "miscellaneous", "MATH-171", "PHYS-101"]
    sample_page_ids = [28, 31, 36]

    report = {
        "tag_checks": [check_page_ids(tag) for tag in tags],
        "page_checks": [check_page_detail(page_id) for page_id in sample_page_ids],
    }

    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
