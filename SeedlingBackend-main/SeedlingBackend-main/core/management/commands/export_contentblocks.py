import json
from pathlib import Path

from django.core.management.base import BaseCommand

from core.models import ContentBlock


class Command(BaseCommand):
    help = "Export ContentBlock pages into JSON for Supabase import."

    def add_arguments(self, parser):
        parser.add_argument(
            "--output",
            type=str,
            default="supabase/export/contentblocks.json",
            help="Output file path.",
        )

    def handle(self, *args, **options):
        output_path = Path(options["output"])
        output_path.parent.mkdir(parents=True, exist_ok=True)

        pages_payload = []
        pages = ContentBlock.objects.live().public().order_by("id")
        for page in pages:
            raw_data = page.body.raw_data if page.body else []
            page_item = {
                "id": page.id,
                "title": page.title,
                "tag": page.tag,
                "author": page.author,
                "published_date": page.date.isoformat() if page.date else None,
                "legacy_type": "core.ContentBlock",
                "body": raw_data,
            }
            pages_payload.append(page_item)

        output_path.write_text(json.dumps(pages_payload, indent=2), encoding="utf-8")
        self.stdout.write(
            self.style.SUCCESS(
                f"Exported {len(pages_payload)} pages to {output_path.as_posix()}"
            )
        )
