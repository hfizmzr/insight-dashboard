"""API routes for insight analysis."""

import json
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

from database import get_session
from models.insight import Insight, InsightCreate, InsightResponse
from services.llm_service import llm_service
from services.scraper_service import scraper_service

router = APIRouter(tags=["insights"])


@router.post("/analyze", response_model=InsightResponse)
async def analyze_content(
    request: InsightCreate,
    session: Session = Depends(get_session),
):
    """
    Analyze text or URL content to extract insights.

    Accepts either raw text or a URL. If a URL is provided,
    the content will be fetched and analyzed.

    Returns the analysis with sentiment, themes, and summary.
    """
    # Validate input
    if not request.text and not request.url:
        raise HTTPException(
            status_code=400,
            detail="Either 'text' or 'url' must be provided",
        )

    source_text = request.text or ""
    source_url = request.url

    # Fetch content from URL if provided
    if request.url and not request.text:
        try:
            source_text = await scraper_service.fetch_url_content(request.url)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to fetch URL content: {str(e)}",
            )

    if not source_text.strip():
        raise HTTPException(
            status_code=400,
            detail="No text content to analyze",
        )

    # Analyze with LLM
    try:
        analysis = llm_service.analyze_text(source_text)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"LLM analysis failed: {str(e)}",
        )

    # Save to database
    insight = Insight(
        source_text=source_text[:5000],  # Limit stored text
        source_url=source_url,
        summary=analysis.summary,
        sentiment=analysis.sentiment,
        sentiment_score=analysis.sentiment_score,
        themes=json.dumps(analysis.themes),
    )

    session.add(insight)
    session.commit()
    session.refresh(insight)

    # Return response
    return InsightResponse(
        id=insight.id,
        source_text=insight.source_text,
        source_url=insight.source_url,
        summary=insight.summary,
        sentiment=insight.sentiment,
        sentiment_score=insight.sentiment_score,
        themes=json.loads(insight.themes),
        created_at=insight.created_at,
    )


@router.get("/insights", response_model=list[InsightResponse])
async def list_insights(
    session: Session = Depends(get_session),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(50, ge=1, le=100, description="Maximum records to return"),
    search: Optional[str] = Query(None, description="Search term for filtering"),
):
    """
    Get list of all analyzed insights.

    Supports pagination with skip/limit and optional search filtering.
    """
    query = select(Insight).order_by(Insight.created_at.desc())

    # Apply search filter if provided
    if search:
        search_term = f"%{search}%"
        query = query.where(
            Insight.source_text.ilike(search_term)
            | Insight.summary.ilike(search_term)
            | Insight.themes.ilike(search_term)
        )

    # Apply pagination
    query = query.offset(skip).limit(limit)

    insights = session.exec(query).all()

    # Convert to response format
    return [
        InsightResponse(
            id=insight.id,
            source_text=insight.source_text,
            source_url=insight.source_url,
            summary=insight.summary,
            sentiment=insight.sentiment,
            sentiment_score=insight.sentiment_score,
            themes=json.loads(insight.themes),
            created_at=insight.created_at,
        )
        for insight in insights
    ]


@router.get("/insights/{insight_id}", response_model=InsightResponse)
async def get_insight(
    insight_id: int,
    session: Session = Depends(get_session),
):
    """Get a specific insight by ID."""
    insight = session.get(Insight, insight_id)

    if not insight:
        raise HTTPException(status_code=404, detail="Insight not found")

    return InsightResponse(
        id=insight.id,
        source_text=insight.source_text,
        source_url=insight.source_url,
        summary=insight.summary,
        sentiment=insight.sentiment,
        sentiment_score=insight.sentiment_score,
        themes=json.loads(insight.themes),
        created_at=insight.created_at,
    )
