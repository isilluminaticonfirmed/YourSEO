'use client';

import { useState } from 'react';
import { UrlInputForm } from '@/components/url-input-form';
import { ComparisonTable } from '@/components/comparison-table';
import { PDFExportModal } from '@/components/pdf-export-modal';
import { HeadingGapAnalysis } from '@/components/heading-gap-analysis';
import { ContentStrategy } from '@/components/content-strategy';
import { VisualEquityTracker } from '@/components/visual-equity-tracker';
import { HeadingDensityAudit } from '@/components/heading-density-audit';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, BarChart3 } from 'lucide-react';
import type { SEOMetadata } from '@/types/seo';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    target: SEOMetadata;
    competitors: SEOMetadata[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (targetUrl: string, competitorUrls: string[]) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/seo-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUrl, competitorUrls }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to analyze URLs');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <main className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center justify-center gap-2">
            <BarChart3 className="w-8 h-8" />
            SEO Competitor Analyzer
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Analyze your website's SEO performance against competitors
          </p>
        </div>

        <UrlInputForm onAnalyze={handleAnalyze} isLoading={isLoading} />

        {error && (
          <Alert variant="destructive" className="mb-8 max-w-4xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {results && (
          <div className="space-y-6">
            {/* Comparison Table with PDF Export */}
            <Card className="max-w-7xl mx-auto">
              <CardContent className="pt-6">
                <div className="flex justify-end mb-4">
                  <PDFExportModal
                    target={results.target}
                    competitors={results.competitors}
                  />
                </div>
                <ComparisonTable
                  target={results.target}
                  competitors={results.competitors}
                />
              </CardContent>
            </Card>

            {/* Heading Gap Analysis */}
            <HeadingGapAnalysis
              target={results.target}
              competitors={results.competitors}
            />

            {/* Suggested Content Strategy */}
            <ContentStrategy
              target={results.target}
              competitors={results.competitors}
            />

            {/* Visual Equity Tracker */}
            <VisualEquityTracker
              target={results.target}
              competitors={results.competitors}
            />

            {/* Heading Density Audit */}
            <HeadingDensityAudit
              target={results.target}
              competitors={results.competitors}
            />
          </div>
        )}
      </main>
    </div>
  );
}
