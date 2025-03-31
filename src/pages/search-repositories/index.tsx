import { Box, Stack, Divider, Container, Typography, Paper } from '@mui/material';
import React, { useState } from 'react';
import DataListPanel from './_components/DataListPanel';
import FiltersPanel from './_components/FiltersPanel'; 
import { PreviewPanel } from './_components/PreviewPanel';
import { SearchHistoryPanel } from './_components/SearchHistoryPanel';
import SearchInput from './_components/SearchInput';
import { taskflow } from './_config/taskflow.config';
import type { Dataset } from './_config/taskflow.types';
import { FilterContextProvider } from '../../components/FilterContext';
import { searchHelper } from '../../utils/searchHelper';
import { SearchIcon } from '../../components/Icons';
import { Button } from '../../components/Button';

/**
 * The main explore page for the search-data-repositories Task Flow.
 * Displays a page header, search input, filters, and search results.
 * Redesigned to match the modern aesthetic while preserving functionality.
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
  const [showHistory, setShowHistory] = useState(false);
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

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  /**
   * Content to render on the page for this component
   */
  return (
    <FilterContextProvider>
      <Box sx={{ py: 4, backgroundColor: 'background.default', minHeight: '100vh' }}>
        <Container maxWidth="xl">
          {/* Page header with title and search input */}
          <Box sx={{ mb: 4 }}>
            {/* Updated header style to match Monitor page */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <SearchIcon size={24} color="#3B82F6" />
              <Box>
                <Typography variant="h4" fontWeight={600} sx={{ mb: 0.5 }}>
                  Search Climate Data
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Find and explore climate datasets from various sources and repositories.
                </Typography>
              </Box>
            </Box>
            
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                display: 'flex', 
                alignItems: 'center',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'grey.200'
              }}
            >
              <Box sx={{ flexGrow: 1, mr: 2 }}>
                <SearchInput
                  onSearch={handleSearch}
                  suggestions={suggestions}
                  onInputChange={fetchSuggestions}
                />
              </Box>
              <Button 
                variant="contained"
                onClick={() => handleSearch('')}
                sx={{ px: 4 }}
              >
                Search
              </Button>
            </Paper>
          </Box>

          <Box sx={{ display: 'flex', gap: 3 }}>
            {/* Filters panel on the left */}
            <Box sx={{ width: '240px', flexShrink: 0 }}>
              <FiltersPanel />
            </Box>

            {/* Main content area */}
            <Box sx={{ flexGrow: 1 }}>
              {/* Search history panel (collapsible) */}
              {showHistory && (
                <>
                  <SearchHistoryPanel />
                  <Divider sx={{ my: 3 }} />
                </>
              )}

              {/* Toggle button for search history */}
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={toggleHistory}
                  size="small"
                >
                  {showHistory ? 'Hide History' : 'Show History'}
                </Button>
              </Box>

              {/* Search results */}
              <DataListPanel
                previewItem={previewItem}
                setPreviewItem={(item: Dataset | null) => setPreviewItem(item)}
                searchResults={searchResults}
              />
            </Box>

            {/* Preview panel (conditionally rendered) */}
            {previewItem && (
              <Box sx={{ width: '400px', flexShrink: 0 }}>
                <PreviewPanel
                  previewItem={previewItem}
                  onClose={handleClosePreview}
                />
              </Box>
            )}
          </Box>
        </Container>
      </Box>
    </FilterContextProvider>
  );
};

export default DatasetExplorer;
