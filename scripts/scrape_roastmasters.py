"""
Scrape green coffee bean data from roastmasters.com.

Extracts bean name, URL, price, Cup Characteristics, and Roasting Notes
from each product page and writes to CSV.
"""

import csv
import re
import time
from html.parser import HTMLParser
from urllib.parse import urljoin

import requests

BASE_URL = "https://www.roastmasters.com"
INDEX_URL = f"{BASE_URL}/green_coffee.html"
OUTPUT_FILE = "roastmasters_beans.csv"
REQUEST_DELAY = 1  # seconds between requests, be polite

SESSION = requests.Session()
SESSION.headers.update({"User-Agent": "Mozilla/5.0"})


def fetch_page(url: str) -> str:
    resp = SESSION.get(url, timeout=15)
    resp.raise_for_status()
    return resp.text


class LinkExtractor(HTMLParser):
    """Pull all <a href="..."> links from the index page."""

    def __init__(self):
        super().__init__()
        self.links: list[tuple[str, str]] = []  # (href, text)
        self._in_product_row = False
        self._current_href: str | None = None
        self._current_text: list[str] = []

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        if tag == "tr" and "category-product" in attr_dict.get("class", ""):
            self._in_product_row = True
        elif tag == "a" and self._in_product_row:
            href = attr_dict.get("href", "")
            if href and href.endswith(".html"):
                self._current_href = href
                self._current_text = []

    def handle_data(self, data):
        if self._current_href is not None:
            self._current_text.append(data)

    def handle_endtag(self, tag):
        if tag == "tr":
            self._in_product_row = False
        elif tag == "a" and self._current_href is not None:
            text = " ".join("".join(self._current_text).split())
            if text:
                self.links.append((self._current_href, text))
            self._current_href = None
            self._current_text = []


def extract_price(html: str) -> str:
    m = re.search(r"1 pound bag - \$(\d+\.\d{2})", html)
    return m.group(1) if m else ""


def extract_sections(html: str) -> tuple[str, str]:
    """Extract Cup Characteristics and Roasting Notes from a product page."""
    text = re.sub(r"<[^>]+>", "\n", html)
    text = re.sub(r"&[a-zA-Z]+;", " ", text)
    text = re.sub(r"&#\d+;", " ", text)

    def find_section(heading: str) -> str:
        pattern = re.compile(
            rf"{heading}\s*[:\-]?\s*(.*?)(?=(?:Cup Characteristics|Roasting Notes|Roasting Suggestions|$))",
            re.DOTALL | re.IGNORECASE,
        )
        m = pattern.search(text)
        if not m:
            return ""
        content = m.group(1)
        content = re.sub(r"\s+", " ", content).strip()
        # trim trailing noise (navigation, footer, ordering info, JS)
        for stop in [
            "Add to Cart",
            "Select Size",
            "Back to",
            "Home |",
            "Copyright",
            "(function",
            "Category",
            "window.",
        ]:
            idx = content.find(stop)
            if idx != -1:
                content = content[:idx].strip()
        return content

    cup = find_section("Cup Characteristics")
    roast = find_section("Roasting Notes") or find_section("Roasting Suggestions")
    return cup, roast


def main():
    print(f"Fetching index page: {INDEX_URL}")
    index_html = fetch_page(INDEX_URL)

    parser = LinkExtractor()
    parser.feed(index_html)

    # dedupe while preserving order
    seen = set()
    beans = []
    for href, name in parser.links:
        if href not in seen:
            seen.add(href)
            beans.append((href, name))

    print(f"Found {len(beans)} beans. Scraping detail pages...\n")

    count = 0
    with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
        fieldnames = ["name", "url", "price_1lb", "cup_characteristics", "roasting_notes"]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()

        for i, (href, name) in enumerate(beans, 1):
            url = urljoin(INDEX_URL, href)
            print(f"  [{i}/{len(beans)}] {name}")
            try:
                html = fetch_page(url)
                price = extract_price(html)
                cup, roast = extract_sections(html)
                if not cup and not roast:
                    print("           ⚠ no Cup Characteristics or Roasting Notes found")
            except Exception as e:
                print(f"           ✗ error: {e}")
                price, cup, roast = "", "", ""
            writer.writerow(
                {
                    "name": name,
                    "url": url,
                    "price_1lb": price,
                    "cup_characteristics": cup,
                    "roasting_notes": roast,
                }
            )
            f.flush()
            count += 1
            time.sleep(REQUEST_DELAY)

    print(f"\nDone! Wrote {count} beans to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
