'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Image, CheckCircle2 } from 'lucide-react';
import type { SEOMetadata } from '@/types/seo';

interface VisualEquityTrackerProps {
  target: SEOMetadata;
  competitors: SEOMetadata[];
}

export function VisualEquityTracker({ target, competitors }: VisualEquityTrackerProps) {
  function getAltTagPercentage(meta: SEOMetadata): number {
    if (meta.totalImages === 0) return 100;
    return Math.round(((meta.totalImages - meta.imagesWithoutAlt) / meta.totalImages) * 100);
  }

  const targetPercent = getAltTagPercentage(target);
  const competitorAvgs = competitors.map(c => ({
    url: c.url,
    percent: getAltTagPercentage(c),
    total: c.totalImages,
    withoutAlt: c.imagesWithoutAlt,
  }));

  const avgCompetitorImages = competitors.reduce((sum, c) => sum + c.totalImages, 0) / competitors.length;
  const contentRichnessWarning = avgCompetitorImages > target.totalImages * 2;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="w-5 h-5 text-purple-500" />
          Image SEO Health
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Target Site */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Your Site</span>
              <span className="text-sm font-bold">{targetPercent}%</span>
            </div>
            <Progress value={targetPercent} className="h-3" />
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>{target.totalImages - target.imagesWithoutAlt} with alt</span>
              <span>{target.totalImages} total images</span>
            </div>
          </div>

          {/* Competitors */}
          {competitorAvgs.map((comp, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Competitor {idx + 1}</span>
                <span className="text-sm font-bold">{comp.percent}%</span>
              </div>
              <Progress value={comp.percent} className="h-3" />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>{comp.total - comp.withoutAlt} with alt</span>
                <span>{comp.total} total images</span>
              </div>
            </div>
          ))}

          {/* Content Richness Warning */}
          {contentRichnessWarning && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                  Content Richness Warning
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                  Competitors average {Math.round(avgCompetitorImages)} images vs your {target.totalImages} images.
                  Consider adding more visual content to match their content depth.
                </p>
              </div>
            </div>
          )}

          {/* Success State */}
          {!contentRichnessWarning && target.totalImages >= avgCompetitorImages && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <p className="text-sm text-green-800 dark:text-green-200">
                Your visual content matches or exceeds competitors!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
