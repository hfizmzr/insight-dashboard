import { Insight } from '@/lib/api';

interface InsightCardProps {
    insight: Insight;
}

const sentimentColors = {
    positive: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    negative: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
};

export default function InsightCard({ insight }: InsightCardProps) {
    const formattedDate = new Date(insight.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-900 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${sentimentColors[insight.sentiment]}`}>
                    {insight.sentiment} ({(insight.sentiment_score * 100).toFixed(0)}%)
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</span>
            </div>

            {/* Summary */}
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                {insight.summary}
            </p>

            {/* Themes */}
            <div className="flex flex-wrap gap-2 mb-4">
                {insight.themes.map((theme, idx) => (
                    <span
                        key={idx}
                        className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full dark:bg-blue-900/30 dark:text-blue-400"
                    >
                        {theme}
                    </span>
                ))}
            </div>

            {/* Source Preview */}
            <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {insight.source_url ? (
                        <a href={insight.source_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {insight.source_url}
                        </a>
                    ) : (
                        insight.source_text.slice(0, 150) + (insight.source_text.length > 150 ? '...' : '')
                    )}
                </p>
            </div>
        </div>
    );
}
