export interface CardFields {
  title: string;
  source?: string;
  quality?: string;
  thumbnail?: string;
  content?: string;
  temporal_coverage?: string;
  spatial_coverage?: string;
  resolution?: string;
  variables?: string | string[];
  citation?: string;
  download_url?: string;
}
