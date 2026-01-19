'use client';

import { useState } from 'react';
import { analyzeText, Insight } from '@/lib/api';

interface AnalyzeFormProps {
    onAnalyzed: (insight: Insight) => void;
}

export default function AnalyzeForm({ onAnalyzed }: AnalyzeFormProps) {
    const [text, setText] = useState('');
    const [url, setUrl] = useState('');
    const [inputType, setInputType] = useState<'text' | 'url'>('text');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const request = inputType === 'text' ? { text } : { url };
            const insight = await analyzeText(request);
            onAnalyzed(insight);
            setText('');
            setUrl('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Analysis failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Type Tabs */}
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => setInputType('text')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${inputType === 'text'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                        }`}
                >
                    Text
                </button>
                <button
                    type="button"
                    onClick={() => setInputType('url')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${inputType === 'url'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                        }`}
                >
                    URL
                </button>
            </div>

            {/* Input Field */}
            {inputType === 'text' ? (
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste your text here to analyze..."
                    className="w-full h-40 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    required
                />
            ) : (
                <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/article"
                    className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    required
                />
            )}

            {/* Error Message */}
            {error && (
                <p className="text-red-500 text-sm">{error}</p>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading || (inputType === 'text' ? !text : !url)}
                className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Analyzing...
                    </span>
                ) : (
                    'Analyze'
                )}
            </button>
        </form>
    );
}
