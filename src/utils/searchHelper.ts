import { Dataset } from '../pages/search-repositories/_config/taskflow.types';

interface SearchResult extends Dataset {
  // Add any additional fields if needed
}

export const searchHelper = {
  searchDatasets: async (
    searchText: string,
    datasets: Dataset[]
  ): Promise<SearchResult[]> => {
    return datasets.filter((dataset) =>
      dataset.title.toLowerCase().includes(searchText.toLowerCase())
    ) as SearchResult[];
  },

  searchDatasetsAsync: async (): Promise<SearchResult[]> => {
    // Implementation here
    return [];
  },

  getSuggestions: async (): Promise<string[]> => {
    // Implementation here
    return [];
  },
};
