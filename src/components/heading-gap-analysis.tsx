'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import type { SEOMetadata } from '@/types/seo';

interface HeadingGapAnalysisProps {
  target: SEOMetadata;
  competitors: SEOMetadata[];
}

export function HeadingGapAnalysis({ target, competitors }: HeadingGapAnalysisProps) {
  function extractKeywords(headings: string[]): Set<string> {
    const keywords = new Set<string>();
    headings.forEach(heading => {
      const words = heading
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 3);
      words.forEach(w => keywords.add(w));
    });
    return keywords;
  }

  function findMissingKeywords(): Array<{ keyword: string; foundIn: string[] }> {
    const targetKeywords = new Set([
      ...extractKeywords(target.h2),
      ...extractKeywords(target.h3),
    ]);

    const missing: Array<{ keyword: string; foundIn: string[] }> = [];

    competitors.forEach((comp, compIdx) => {
      const compKeywords = new Set([
        ...extractKeywords(comp.h2),
        ...extractKeywords(comp.h3),
      ]);

      compKeywords.forEach(keyword => {
        if (!targetKeywords.has(keyword)) {
          const existing = missing.find(m => m.keyword === keyword);
          if (existing) {
            existing.foundIn.push(`Competitor ${compIdx + 1}`);
          } else {
            missing.push({ keyword, foundIn: [`Competitor ${compIdx + 1}`] });
          }
        }
      });
    });

    return missing.sort((a, b) => a.keyword.localeCompare(b.keyword));
  }

  const missingKeywords = findMissingKeywords();
  const targetHeadings = target.h2.length + target.h3.length;
  const competitorHeadings = competitors.reduce(
    (sum, c) => sum + c.h2.length + c.h3.length,
    0
  );

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-orange-500" />
          Topical Authority Gaps
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-sm text-muted-foreground">
          Found {missingKeywords.length} keywords in competitor headings missing from your H2/H3 tags.
          (You: {targetHeadings} headings vs Competitors: {competitorHeadings} total)
        </div>

        {missingKeywords.length === 0 ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="w-4 h-4" />
            No significant heading gaps found!
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {missingKeywords.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg border bg-orange-50 dark:bg-orange-950/20"
              >
                <span className="text-sm font-medium">{item.keyword}</span>
                <div className="flex gap-1">
                  {item.foundIn.map((source, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {source}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
