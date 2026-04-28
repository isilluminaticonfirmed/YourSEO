import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import type { SEOMetadata, SEORequest, SEOResponse } from '@/types/seo';
import { calculateSEOScore } from '@/lib/seo-score';

async function scrapeUrl(url: string): Promise<SEOMetadata> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; SEOAnalyzer/1.0)',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  const title = $('title').text() || '';
  const description = $('meta[name="description"]').attr('content') || '';

  const h1: string[] = [];
  const h2: string[] = [];
  const h3: string[] = [];
  const h4: string[] = [];
  const h5: string[] = [];
  const h6: string[] = [];

  $('h1').each((_, el) => h1.push($(el).text().trim()));
  $('h2').each((_, el) => h2.push($(el).text().trim()));
  $('h3').each((_, el) => h3.push($(el).text().trim()));
  $('h4').each((_, el) => h4.push($(el).text().trim()));
  $('h5').each((_, el) => h5.push($(el).text().trim()));
  $('h6').each((_, el) => h6.push($(el).text().trim()));

  let imagesWithoutAlt = 0;
  let totalImages = 0;
  $('img').each((_, el) => {
    totalImages++;
    if (!$(el).attr('alt')) {
      imagesWithoutAlt++;
    }
  });

  const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
  const wordCount = bodyText.split(' ').filter(w => w.length > 0).length;

  const words: Record<string, number> = {};
  const cleanText = bodyText.toLowerCase().replace(/[^\w\s]/g, '');
  cleanText.split(/\s+/).forEach(word => {
    if (word.length > 3) {
      words[word] = (words[word] || 0) + 1;
    }
  });

  const meta: SEOMetadata = {
    url,
    title,
    description,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    imagesWithoutAlt,
    totalImages,
    wordCount,
    keywords: words,
    score: 0,
  };

  meta.score = calculateSEOScore(meta);
  return meta;
}

export async function POST(request: NextRequest) {
  try {
    const body: SEORequest = await request.json();
    const { targetUrl, competitorUrls } = body;

    if (!targetUrl) {
      return NextResponse.json({ error: 'Target URL is required' }, { status: 400 });
    }

    const allUrls = [targetUrl, ...(competitorUrls || []).filter(Boolean)];
    const results = await Promise.allSettled(
      allUrls.map(url => scrapeUrl(url))
    );

    const targetResult = results[0];
    if (targetResult.status === 'rejected') {
      return NextResponse.json(
        { error: `Failed to analyze target URL: ${targetResult.reason}` },
        { status: 500 }
      );
    }

    const competitors = results.slice(1)
      .filter((r): r is PromiseFulfilledResult<SEOMetadata> => r.status === 'fulfilled')
      .map(r => r.value);

    const response: SEOResponse = {
      target: targetResult.value,
      competitors,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
