/**
 * API client for backend communication
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Insight {
    id: number;
    source_text: string;
    source_url: string | null;
    summary: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    sentiment_score: number;
    themes: string[];
    created_at: string;
}

export interface AnalyzeRequest {
    text?: string;
    url?: string;
}

/**
 * Analyze text or URL content
 */
export async function analyzeText(request: AnalyzeRequest): Promise<Insight> {
    const response = await fetch(`${API_URL}/api/v1/analyze`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Analysis failed' }));
        throw new Error(error.detail || 'Analysis failed');
    }

    return response.json();
}

/**
 * Get all insights with optional search
 */
export async function getInsights(search?: string): Promise<Insight[]> {
    const params = new URLSearchParams();
    if (search) params.set('search', search);

    const url = `${API_URL}/api/v1/insights${params.toString() ? `?${params}` : ''}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Failed to fetch insights');
    }

    return response.json();
}
