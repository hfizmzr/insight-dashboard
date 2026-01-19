"""Scraper service for fetching content from URLs."""

import re
from urllib.parse import urlparse

import httpx


class ScraperService:
    """Service for fetching and extracting text content from URLs."""

    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }

    async def fetch_url_content(self, url: str) -> str:
        """
        Fetch and extract text content from a URL.

        Args:
            url: The URL to fetch content from.

        Returns:
            Extracted text content from the page.

        Raises:
            ValueError: If URL is invalid or content cannot be fetched.
        """
        # Validate URL
        parsed = urlparse(url)
        if not parsed.scheme or not parsed.netloc:
            raise ValueError(f"Invalid URL: {url}")

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url, headers=self.headers, follow_redirects=True)
            response.raise_for_status()

        html = response.text
        return self._extract_text(html)

    def _extract_text(self, html: str) -> str:
        """
        Extract readable text from HTML content.

        Uses simple regex-based extraction for basic HTML cleaning.
        """
        # Remove script and style elements
        html = re.sub(r"<script[^>]*>.*?</script>", "", html, flags=re.DOTALL | re.IGNORECASE)
        html = re.sub(r"<style[^>]*>.*?</style>", "", html, flags=re.DOTALL | re.IGNORECASE)

        # Remove HTML tags
        text = re.sub(r"<[^>]+>", " ", html)

        # Clean up whitespace
        text = re.sub(r"\s+", " ", text)
        text = text.strip()

        # Limit text length to avoid token limits
        max_chars = 10000
        if len(text) > max_chars:
            text = text[:max_chars] + "..."

        return text

    def is_youtube_url(self, url: str) -> bool:
        """Check if URL is a YouTube video URL."""
        youtube_patterns = [
            r"youtube\.com/watch",
            r"youtu\.be/",
            r"youtube\.com/embed/",
        ]
        return any(re.search(pattern, url) for pattern in youtube_patterns)


# Singleton instance
scraper_service = ScraperService()
