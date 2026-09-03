#!/usr/bin/env python3
"""Emit compact metadata for recent OFF Brand by Koto posts.

This intentionally uses the public Substack RSS feed and does not archive article bodies.
PARÉ should treat the source URL as provenance and generate original synthesis downstream.
"""

from __future__ import annotations

import argparse
import email.utils
import hashlib
import json
import sys
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone

DEFAULT_FEED = "https://offbrandkoto.substack.com/feed"
USER_AGENT = "PARE-Brand-Intelligence/1.0 (+https://github.com/executiveusa/brand-kit-builder-)"


def parse_date(value: str | None) -> datetime | None:
    if not value:
        return None
    try:
        parsed = email.utils.parsedate_to_datetime(value)
        if parsed.tzinfo is None:
            parsed = parsed.replace(tzinfo=timezone.utc)
        return parsed.astimezone(timezone.utc)
    except (TypeError, ValueError, OverflowError):
        return None


def text(node: ET.Element | None) -> str:
    return (node.text or "").strip() if node is not None else ""


def fetch_feed(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=30) as response:
        return response.read()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--feed", default=DEFAULT_FEED)
    parser.add_argument("--days", type=int, default=21)
    parser.add_argument("--limit", type=int, default=8)
    args = parser.parse_args()

    raw = fetch_feed(args.feed)
    root = ET.fromstring(raw)
    channel = root.find("channel")
    if channel is None:
        raise RuntimeError("RSS channel not found")

    now = datetime.now(timezone.utc)
    cutoff = now - timedelta(days=max(args.days, 1))
    items: list[dict[str, str | None]] = []

    for item in channel.findall("item"):
        title = text(item.find("title"))
        link = text(item.find("link"))
        published_raw = text(item.find("pubDate"))
        published_dt = parse_date(published_raw)
        if not title or not link:
            continue
        if published_dt and published_dt < cutoff:
            continue

        fingerprint = hashlib.sha256(link.encode("utf-8")).hexdigest()[:16]
        items.append(
            {
                "source": "OFF Brand by Koto",
                "title": title,
                "url": link,
                "published_at": published_dt.isoformat() if published_dt else published_raw or None,
                "fingerprint": fingerprint,
                "usage_policy": "metadata-and-original-synthesis-only",
            }
        )
        if len(items) >= args.limit:
            break

    json.dump({"feed": args.feed, "generated_at": now.isoformat(), "items": items}, sys.stdout, indent=2)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
