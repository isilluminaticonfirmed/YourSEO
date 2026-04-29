'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, FileText, TrendingUp } from 'lucide-react';
import type { SEOMetadata } from '@/types/seo';

interface ContentStrategyProps {
  target: SEOMetadata;
  competitors: SEOMetadata[];
}

export function ContentStrategy({ target, competitors }: ContentStrategyProps) {
  function generateSuggestions(): Array<{
    title: string;
    reason: string;
    priority: 'high' | 'medium' | 'low';
  }> {
    const suggestions: Array<{
      title: string;
      reason: string;
      priority: 'high' | 'medium' | 'low';
    }> = [];

    // Find the strongest competitor
    const strongestCompetitor = competitors.reduce((max, comp) =>
      comp.score > max.score ? comp : max
    , competitors[0]);

    if (!strongestCompetitor) return suggestions;

    // Get competitor's top keywords
    const topKeywords = Object.entries(strongestCompetitor.keywords)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);

    // Get competitor's location hints from URLs and headings
    const urlObj = new URL(strongestCompetitor.url);
    const domain = urlObj.hostname.replace('www.', '').split('.')[0];

    // Generate page suggestions based on competitor analysis
    if (strongestCompetitor.wordCount > target.wordCount * 1.5) {
      suggestions.push({
        title: `Complete Guide to ${topKeywords.slice(0, 3).join(', ')} - ${domain} Resources`,
        reason: `Competitor has ${strongestCompetitor.wordCount} words vs your ${target.wordCount}. Create comprehensive guides.`,
        priority: 'high',
      });
    }

    if (strongestCompetitor.h2.length > target.h2.length) {
      suggestions.push({
        title: `Services - ${topKeywords.slice(0, 2).join(' & ')} Solutions`,
        reason: `Competitor uses ${strongestCompetitor.h2.length} H2 tags for service structure. Match their depth.`,
        priority: 'high',
      });
    }

    // Check for local SEO opportunities
    const hasLocationKeywords = topKeywords.some(k =>
      ['city', 'town', 'area', 'local', 'near', 'service'].includes(k)
    );
    if (hasLocationKeywords || strongestCompetitor.h2.length > 5) {
      suggestions.push({
        title: `Emergency 24/7 ${topKeywords[0] || 'Service'} in [City] - Same Day Response`,
        reason: `Competitor's heading structure suggests location-based service pages. Create local landing pages.`,
        priority: 'medium',
      });
    }

    // Add comparison-based suggestion
    const avgCompWords = competitors.reduce((sum, c) => sum + c.wordCount, 0) / competitors.length;
    if (avgCompWords > target.wordCount) {
      suggestions.push({
        title: `Why Choose Us - ${topKeywords.slice(0, 2).join(' vs ')} Comparison`,
        reason: `Average competitor has ${Math.round(avgCompWords)} words. Create persuasive comparison content.`,
        priority: 'medium',
      });
    }

    return suggestions.slice(0, 3);
  }

  const suggestions = generateSuggestions();

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Recommended Pages
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suggestions.map((suggestion, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg border bg-gradient-to-r from-blue-50 to-white dark:from-blue-950/20 dark:to-background"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <h4 className="font-semibold text-sm">{suggestion.title}</h4>
                </div>
                <Badge
                  variant={
                    suggestion.priority === 'high'
                      ? 'destructive'
                      : suggestion.priority === 'medium'
                      ? 'default'
                      : 'secondary'
                  }
                  className="text-xs"
                >
                  {suggestion.priority}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {suggestion.reason}
              </p>
            </div>
          ))}

          {suggestions.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No specific recommendations at this time. Your content matches competitors well!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
