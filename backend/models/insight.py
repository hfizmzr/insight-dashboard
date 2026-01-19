"""Insight data models using SQLModel."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field
from sqlmodel import SQLModel, Field as SQLField


class InsightBase(SQLModel):
    """Base insight model with shared fields."""

    source_text: str = SQLField(description="Original text that was analyzed")
    source_url: Optional[str] = SQLField(
        default=None, description="URL if content was fetched from web"
    )


class Insight(InsightBase, table=True):
    """Insight database table model."""

    __tablename__ = "insights"

    id: Optional[int] = SQLField(default=None, primary_key=True)
    summary: str = SQLField(description="3-sentence summary of the content")
    sentiment: str = SQLField(description="Overall sentiment: positive, negative, or neutral")
    sentiment_score: float = SQLField(
        default=0.0, description="Sentiment score from -1 (negative) to 1 (positive)"
    )
    themes: str = SQLField(description="JSON array of key themes extracted")
    created_at: datetime = SQLField(default_factory=datetime.utcnow)


class InsightCreate(BaseModel):
    """Schema for creating a new insight analysis."""

    text: Optional[str] = Field(
        default=None, description="Raw text to analyze"
    )
    url: Optional[str] = Field(
        default=None, description="URL to fetch and analyze content from"
    )

    class Config:
        json_schema_extra = {
            "examples": [
                {"text": "This product is amazing! Great quality and fast shipping."},
                {"url": "https://example.com/article"},
            ]
        }


class InsightResponse(BaseModel):
    """Schema for insight API responses."""

    id: int
    source_text: str
    source_url: Optional[str] = None
    summary: str
    sentiment: str
    sentiment_score: float
    themes: list[str]
    created_at: datetime

    class Config:
        from_attributes = True
