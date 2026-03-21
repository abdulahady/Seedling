import os
from urllib.parse import urljoin

import requests


class SupabaseApiError(RuntimeError):
    pass


def _get_required_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise SupabaseApiError(f"Missing required environment variable: {name}")
    return value


def supabase_rest_get(table: str, query: str = ""):
    supabase_url = _get_required_env("SUPABASE_URL").rstrip("/")
    service_key = _get_required_env("SUPABASE_SERVICE_ROLE_KEY")
    base = urljoin(f"{supabase_url}/", f"rest/v1/{table}")
    url = f"{base}?{query}" if query else base
    response = requests.get(
        url,
        headers={
            "apikey": service_key,
            "Authorization": f"Bearer {service_key}",
            "Content-Type": "application/json",
        },
        timeout=15,
    )
    response.raise_for_status()
    return response.json()


def build_public_asset_url(bucket_name: str, object_path: str) -> str:
    if object_path and str(object_path).startswith(("http://", "https://")):
        return object_path
    supabase_url = _get_required_env("SUPABASE_URL").rstrip("/")
    return f"{supabase_url}/storage/v1/object/public/{bucket_name}/{object_path}"
