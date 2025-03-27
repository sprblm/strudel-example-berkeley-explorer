import { Box, Stack, Divider } from '@mui/material';
import React, { useState } from 'react';
import { PageHeader } from '../../components/PageHeader';
import DataListPanel from './_components/DataListPanel';
import FiltersPanel from './_components/FiltersPanel'; 
import { PreviewPanel } from './_components/PreviewPanel';
import { SearchHistoryPanel } from './_components/SearchHistoryPanel';
import SearchInput from './_components/SearchInput';
import { taskflow } from './_config/taskflow.config';
import type { Dataset } from './_config/taskflow.types';
import { FilterContextProvider } from '../../components/FilterContext';
import { searchHelper } from '../../utils/searchHelper';

/**
 * The main explore page for the search-data-repositories Task Flow.
 * Displays a page header, `<FiltersPanel>`, `<DataListPanel>`, and `<PreviewPanel>`.
 */

interface TaskflowPages {
  index: {
    title: string;
    description: string;
  };
}

const DatasetExplorer: React.FC = () => {
  const [previewItem, setPreviewItem] = useState<Dataset | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<Dataset[]>([]);
  const pageConfig = (taskflow.pages as unknown as TaskflowPages)?.index;

  const handleSearch = async (searchText: string) => {
    const datasets: Dataset[] = []; // TODO: Get actual datasets
    const results = await searchHelper.searchDatasets(searchText, datasets);
    setSearchResults(results);
  };

  const fetchSuggestions = async () => {
    const suggestions = await searchHelper.getSuggestions();
    setSuggestions(suggestions);
  };

  const handleClosePreview = () => {
    setPreviewItem(null);
  };

  /**
   * Content to render on the page for this component
   */
  return (
    <FilterContextProvider>
      <Box>
        <PageHeader
          pageTitle={pageConfig?.title || 'Search Climate Datasets'}
          description={pageConfig?.description || ''}
          sx={{
            marginBottom: 1,
            padding: 2,
          }}
        >
          <SearchInput
            onSearch={handleSearch}
            suggestions={suggestions}
            onInputChange={fetchSuggestions}
          />
        </PageHeader>
        <Box>
          <Stack direction="row">
            <Box
              sx={{
                width: '350px',
              }}
            >
              <FiltersPanel />
            </Box>
            <Box
              sx={{
                border: 'none',
                flex: 1,
                minHeight: '600px',
                minWidth: 0,
                padding: 2,
              }}
            >
              {/* Search History Panel */}
              <SearchHistoryPanel />

              <Divider sx={{ my: 2 }} />

              {/* Data List Panel */}
              <DataListPanel
                previewItem={previewItem}
                setPreviewItem={(item: Dataset | null) => setPreviewItem(item)}
                searchResults={searchResults}
              />
            </Box>
            {previewItem && (
              <Box
                sx={{
                  maxWidth: '600px',
                  minWidth: '400px',
                }}
              >
                <PreviewPanel
                  previewItem={previewItem}
                  onClose={handleClosePreview}
                />
              </Box>
            )}
          </Stack>
        </Box>
      </Box>
    </FilterContextProvider>
  );
};

export default DatasetExplorer;
