"""LLM service for text analysis using OpenRouter."""

import json
from dataclasses import dataclass

from openai import OpenAI

from config import settings


@dataclass
class AnalysisResult:
    """Result from LLM text analysis."""

    summary: str
    sentiment: str
    sentiment_score: float
    themes: list[str]


class LLMService:
    """Service for analyzing text using OpenRouter LLM API."""

    def __init__(self):
        self.client = OpenAI(
            base_url=settings.openrouter_base_url,
            api_key=settings.openrouter_api_key,
        )
        self.model = settings.openrouter_model

    def analyze_text(self, text: str) -> AnalysisResult:
        """
        Analyze text to extract sentiment, themes, and summary.

        Args:
            text: The text content to analyze.

        Returns:
            AnalysisResult with summary, sentiment, sentiment_score, and themes.
        """
        system_prompt = """You are an expert text analyst. Analyze the given text and return a JSON object with:
1. "summary": A concise 3-sentence summary of the main points
2. "sentiment": Overall sentiment as "positive", "negative", or "neutral"
3. "sentiment_score": A float from -1.0 (very negative) to 1.0 (very positive)
4. "themes": An array of 3-5 key themes/topics extracted from the text

Return ONLY valid JSON, no additional text or markdown."""

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Analyze this text:\n\n{text}"},
            ],
            temperature=0.3,
            response_format={"type": "json_object"},
        )

        result = json.loads(response.choices[0].message.content)

        return AnalysisResult(
            summary=result.get("summary", ""),
            sentiment=result.get("sentiment", "neutral"),
            sentiment_score=float(result.get("sentiment_score", 0.0)),
            themes=result.get("themes", []),
        )


# Singleton instance
llm_service = LLMService()
