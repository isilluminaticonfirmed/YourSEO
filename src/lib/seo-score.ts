import type { SEOMetadata } from '@/types/seo';

export function calculateSEOScore(meta: SEOMetadata): number {
  let score = 0;

  // Title (0-20 points)
  if (meta.title) {
    score += 10;
    if (meta.title.length >= 30 && meta.title.length <= 60) {
      score += 10;
    } else if (meta.title.length > 0) {
      score += 5;
    }
  }

  // Description (0-20 points)
  if (meta.description) {
    score += 10;
    if (meta.description.length >= 120 && meta.description.length <= 160) {
      score += 10;
    } else if (meta.description.length > 0) {
      score += 5;
    }
  }

  // Headings structure (0-20 points)
  const totalHeadings = meta.h1.length + meta.h2.length + meta.h3.length;
  if (meta.h1.length > 0) score += 8;
  if (meta.h2.length > 0) score += 6;
  if (meta.h3.length > 0) score += 4;
  if (meta.h4.length > 0 || meta.h5.length > 0 || meta.h6.length > 0) score += 2;

  // Images with alt tags (0-15 points)
  if (meta.totalImages > 0) {
    const altRatio = (meta.totalImages - meta.imagesWithoutAlt) / meta.totalImages;
    score += Math.round(altRatio * 15);
  } else {
    score += 15; // No images to worry about
  }

  // Content length (0-15 points)
  if (meta.wordCount >= 300) score += 15;
  else if (meta.wordCount >= 150) score += 10;
  else if (meta.wordCount >= 50) score += 5;

  // Keyword density (0-10 points)
  const topKeywords = Object.values(meta.keywords).sort((a, b) => b - a)[0];
  if (topKeywords) {
    if (topKeywords >= 3 && topKeywords <= 10) score += 10;
    else if (topKeywords > 10) score += 5;
  }

  return Math.min(score, 100);
}
