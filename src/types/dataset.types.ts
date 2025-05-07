export interface Dataset {
  id: string;
  title: string;
  publication_date?: string;
  summary?: string;
  source?: string;
  details?: {
    type: string;
    count?: number;
    format?: string;
    fields?: string[];
    parameters?: string[];
    timespan?: string;
    [key: string]: any;
  };
  [key: string]: any;
}
