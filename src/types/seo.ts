export interface SEOMetadata {
  url: string;
  title: string;
  description: string;
  h1: string[];
  h2: string[];
  h3: string[];
  h4: string[];
  h5: string[];
  h6: string[];
  imagesWithoutAlt: number;
  totalImages: number;
  wordCount: number;
  keywords: Record<string, number>;
  score: number;
}

export interface SEORequest {
  targetUrl: string;
  competitorUrls: string[];
}

export interface SEOResponse {
  target: SEOMetadata;
  competitors: SEOMetadata[];
}
