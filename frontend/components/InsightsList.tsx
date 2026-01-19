'use client';

import { useState, useEffect } from 'react';
import { getInsights, Insight } from '@/lib/api';
import InsightCard from './InsightCard';

interface InsightsListProps {
    refreshTrigger?: number;
}

export default function InsightsList({ refreshTrigger }: InsightsListProps) {
    const [insights, setInsights] = useState<Insight[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        loadInsights();
    }, [refreshTrigger]);

    const loadInsights = async () => {
        try {
            setLoading(true);
            const data = await getInsights(search || undefined);
            setInsights(data);
        } catch (err) {
            console.error('Failed to load insights:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadInsights();
    };

    return (
        <div className="space-y-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search insights..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                    Search
                </button>
            </form>

            {/* Results */}
            {loading ? (
                <div className="flex justify-center py-8">
                    <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                </div>
            ) : insights.length === 0 ? (
                <p className="text-center text-gray-500 py-8 dark:text-gray-400">
                    No insights yet. Analyze some text to get started!
                </p>
            ) : (
                <div className="space-y-4">
                    {insights.map((insight) => (
                        <InsightCard key={insight.id} insight={insight} />
                    ))}
                </div>
            )}
        </div>
    );
}
