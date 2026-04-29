'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle2, Heading } from 'lucide-react';
import type { SEOMetadata } from '@/types/seo';

interface HeadingDensityAuditProps {
  target: SEOMetadata;
  competitors: SEOMetadata[];
}

export function HeadingDensityAudit({ target, competitors }: HeadingDensityAuditProps) {
  function calculateDensity(meta: SEOMetadata): {
    totalHeadings: number;
    ratio: number;
    wordsPerHeading: number;
    isFragmented: boolean;
  } {
    const totalHeadings = meta.h1.length + meta.h2.length + meta.h3.length + meta.h4.length;
    const wordsPerHeading = totalHeadings > 0 ? Math.round(meta.wordCount / totalHeadings) : meta.wordCount;
    const isFragmented = wordsPerHeading <= 40 && totalHeadings > 10;

    return {
      totalHeadings,
      ratio: totalHeadings > 0 ? Math.round((meta.wordCount / totalHeadings) * 10) / 10 : 0,
      wordsPerHeading,
      isFragmented,
    };
  }

  const targetDensity = calculateDensity(target);
  const compDensities = competitors.map(c => calculateDensity(c));

  const avgCompWordsPerHeading = compDensities.reduce((sum, d) => sum + d.wordsPerHeading, 0) / compDensities.length;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heading className="w-5 h-5 text-indigo-500" />
          Readability Alert
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Target Analysis */}
          <div className={`p-4 rounded-lg border ${
            targetDensity.isFragmented
              ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
              : 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
          }`}>
            <div className="flex items-start gap-3">
              {targetDensity.isFragmented ? (
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className={`text-sm font-semibold ${
                  targetDensity.isFragmented ? 'text-red-800 dark:text-red-200' : 'text-green-800 dark:text-green-200'
                }`}>
                  Your Content: {targetDensity.isFragmented ? 'Fragmented Content' : 'Good Heading Structure'}
                </p>
                <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Total Headings:</span>
                    <p className="font-bold">{targetDensity.totalHeadings}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Word Count:</span>
                    <p className="font-bold">{target.wordCount}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Words/Heading:</span>
                    <p className={`font-bold ${targetDensity.wordsPerHeading <= 40 ? 'text-red-600' : 'text-green-600'}`}>
                      {targetDensity.wordsPerHeading}
                    </p>
                  </div>
                </div>
                {targetDensity.isFragmented && (
                  <p className="text-xs mt-2 text-red-700 dark:text-red-300">
                    You have a heading every {targetDensity.wordsPerHeading} words. Consider consolidating headings for better UX.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Competitor Comparison */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Competitor Comparison:</p>
            {compDensities.map((density, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded bg-muted/50 text-xs">
                <span>Competitor {idx + 1}</span>
                <div className="flex gap-4">
                  <span>{density.totalHeadings} headings</span>
                  <span className={density.wordsPerHeading <= 40 ? 'text-red-600' : 'text-green-600'}>
                    {density.wordsPerHeading} words/heading
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Suggestion */}
          {targetDensity.isFragmented && (
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                <strong>Suggestion:</strong> Aim for 1 heading per 50-80 words (like your competitors averaging {Math.round(avgCompWordsPerHeading)} words/heading). Merge related H2/H3 tags and expand content sections.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
