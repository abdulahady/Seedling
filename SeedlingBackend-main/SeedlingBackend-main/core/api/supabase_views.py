from django.http import JsonResponse
from django.views import View

from .supabase_client import SupabaseApiError, build_public_asset_url, supabase_rest_get


def _cached_json_response(data: dict, status: int, cache_control: str) -> JsonResponse:
    response = JsonResponse(data, status=status)
    response["Cache-Control"] = cache_control
    return response


def _normalize_block(block_row: dict) -> dict:
    block_type = block_row.get("block_type")
    block_value = block_row.get("block_value")
    if isinstance(block_value, dict):
        value = block_value.get("value", block_value)
        children = block_value.get("children")
    else:
        value = block_value
        children = None

    # StreamField may store only a PK, or a dict like {"id": n} if imported from API-shaped JSON.
    if block_type in {"document", "image"} and isinstance(value, dict):
        pk = value.get("id")
        if pk is not None:
            value = pk

    block = {"type": block_type, "value": value}
    if children is not None:
        block["children"] = children
    return block


def _build_page_payload(page_row: dict, blocks: list[dict]) -> dict:
    return {
        "id": page_row.get("id"),
        "title": page_row.get("title"),
        "tag": page_row.get("tag"),
        "author": page_row.get("author"),
        "date": page_row.get("published_date"),
        "body": [_normalize_block(block) for block in blocks],
    }


class SupabasePagesView(View):
    def get(self, request, page_id=None):
        try:
            if page_id is not None:
                return self._get_single_page(page_id)
            return self._get_pages(request)
        except SupabaseApiError as error:
            return JsonResponse({"error": str(error)}, status=500)
        except Exception as error:
            return JsonResponse({"error": str(error)}, status=500)

    def _get_pages(self, request):
        query_parts = ["select=id,title,tag,author,published_date", "order=id.asc"]
        tag = request.GET.get("tag")

        # We currently store ContentBlock records only in this compatibility table.
        # Keep accepting ?type=core.ContentBlock without filtering on this field
        # to avoid PostgREST parsing issues with dotted type strings.
        if tag:
            query_parts.append(f"tag=eq.{tag}")

        rows = supabase_rest_get("content_pages", "&".join(query_parts))
        return _cached_json_response(
            {"items": rows},
            status=200,
            cache_control="public, max-age=120, s-maxage=300, stale-while-revalidate=600",
        )

    def _get_single_page(self, page_id):
        pages = supabase_rest_get(
            "content_pages",
            f"select=id,title,tag,author,published_date,legacy_type&id=eq.{page_id}&limit=1",
        )
        if not pages:
            return JsonResponse({"detail": "Not found."}, status=404)

        blocks = supabase_rest_get(
            "page_blocks",
            f"select=block_type,block_value,block_order&page_id=eq.{page_id}&order=block_order.asc",
        )
        payload = _build_page_payload(pages[0], blocks)
        return _cached_json_response(
            payload,
            status=200,
            cache_control="public, max-age=300, s-maxage=900, stale-while-revalidate=1800",
        )


class SupabaseAssetView(View):
    asset_type = None

    def get(self, request, asset_id=None):
        try:
            rows = supabase_rest_get(
                "media_assets",
                f"select=id,asset_type,bucket_name,object_path&id=eq.{asset_id}&asset_type=eq.{self.asset_type}&limit=1",
            )
            if not rows:
                return JsonResponse({"detail": "Not found."}, status=404)
            asset = rows[0]
            return _cached_json_response(
                {
                    "id": asset.get("id"),
                    "meta": {
                        "download_url": build_public_asset_url(
                            asset.get("bucket_name"), asset.get("object_path")
                        )
                    },
                },
                status=200,
                cache_control="public, max-age=3600, s-maxage=86400, stale-while-revalidate=172800",
            )
        except SupabaseApiError as error:
            return JsonResponse({"error": str(error)}, status=500)
        except Exception as error:
            return JsonResponse({"error": str(error)}, status=500)


class SupabaseImageView(SupabaseAssetView):
    asset_type = "image"


class SupabaseDocumentView(SupabaseAssetView):
    asset_type = "document"
