'use client';

import { useState } from 'react';
import AnalyzeForm from '@/components/AnalyzeForm';
import InsightsList from '@/components/InsightsList';
import InsightCard from '@/components/InsightCard';
import { Insight } from '@/lib/api';

export default function Home() {
  const [latestInsight, setLatestInsight] = useState<Insight | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAnalyzed = (insight: Insight) => {
    setLatestInsight(insight);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            AI Insight Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Transform text into actionable insights
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left: Analyze Form */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm dark:bg-gray-900 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">
              Analyze Content
            </h2>
            <AnalyzeForm onAnalyzed={handleAnalyzed} />
          </div>

          {/* Right: Latest Result */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm dark:bg-gray-900 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">
              Latest Result
            </h2>
            {latestInsight ? (
              <InsightCard insight={latestInsight} />
            ) : (
              <div className="flex items-center justify-center h-40 text-gray-400 dark:text-gray-500">
                <p>Results will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* History Section */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm dark:bg-gray-900 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">
            Recent Insights
          </h2>
          <InsightsList refreshTrigger={refreshTrigger} />
        </div>
      </main>
    </div>
  );
}
