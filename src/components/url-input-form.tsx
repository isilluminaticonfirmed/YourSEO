'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Globe } from 'lucide-react';

interface UrlInputFormProps {
  onAnalyze: (targetUrl: string, competitorUrls: string[]) => void;
  isLoading: boolean;
}

export function UrlInputForm({ onAnalyze, isLoading }: UrlInputFormProps) {
  const [targetUrl, setTargetUrl] = useState('');
  const [competitors, setCompetitors] = useState(['', '', '']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validCompetitors = competitors.filter(url => url.trim() !== '');
    onAnalyze(targetUrl, validCompetitors);
  };

  const updateCompetitor = (index: number, value: string) => {
    const newCompetitors = [...competitors];
    newCompetitors[index] = value;
    setCompetitors(newCompetitors);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          SEO Analysis Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Target URL</label>
            <Input
              type="url"
              placeholder="https://yourwebsite.com"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium block">Competitor URLs (up to 3)</label>
            {competitors.map((url, index) => (
              <Input
                key={index}
                type="url"
                placeholder={`https://competitor${index + 1}.com`}
                value={url}
                onChange={(e) => updateCompetitor(index, e.target.value)}
              />
            ))}
          </div>

          <Button type="submit" disabled={isLoading || !targetUrl} className="w-full">
            <Search className="w-4 h-4 mr-2" />
            {isLoading ? 'Analyzing...' : 'Analyze SEO'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
