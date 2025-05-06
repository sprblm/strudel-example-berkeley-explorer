import { Box, Container, Typography, Paper, Grid } from '@mui/material';
import React, { useState } from 'react';
import FiltersPanel from './_components/FiltersPanel'; 
import { FilterContextProvider } from '../../components/FilterContext';
import { SearchIcon } from '../../components/Icons';
import DataListPanel from './_components/DataListPanel';
import { PreviewPanel } from './_components/PreviewPanel';
import { SearchHistoryPanel } from './_components/SearchHistoryPanel';
import { taskflow } from './_config/taskflow.config';
import type { Dataset } from './_config/taskflow.types';
import { searchHelper } from '../../utils/searchHelper';
import { Button } from '../../components/Button';
import CampusDataMap from '../../components/CampusDataMap';

/**
 * The main explore page for the search-data-repositories Task Flow.
 * Displays a page header, filters panel, map view, and search results.
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

  const [datasets, setDatasets] = useState<Dataset[]>([
    { id: '1', title: 'Tree Dataset 1', publication_date: '2023-01-01', summary: 'Summary 1', source: 'Source 1' },
    { id: '2', title: 'Air Quality Dataset 2', publication_date: '2023-02-01', summary: 'Summary 2', source: 'Source 2' },
    { id: '3', title: 'Tree Dataset 3', publication_date: '2023-03-01', summary: 'Summary 3', source: 'Source 3' },
  ]);

  const handleSearch = async (searchText: string) => {
    const results = await searchHelper.searchDatasets(searchText, datasets);
    setSearchResults(results);
  };

  const handleClosePreview = () => {
    setPreviewItem(null);
  };

  // Handle map point click
  const handleMapPointClick = (point: any) => {
    // Find dataset related to this point
    const relatedDataset = datasets.find(dataset => 
      dataset.title.toLowerCase().includes(point.type === 'tree' ? 'tree' : 'air')
    );
    
    if (relatedDataset) {
      setPreviewItem(relatedDataset);
    }
  };

  return (
    <FilterContextProvider>
      <Box sx={{ py: 4, backgroundColor: 'background.default', minHeight: '100vh' }}>
        <Container maxWidth="xl">
          {/* Page header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <SearchIcon size={24} color="#3B82F6" />
              <Box>
                <Typography variant="h4" fontWeight={600} sx={{ mb: 0.5 }}>
                  Search Urban Environmental Data
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Find and explore datasets from the local various sources and repositories.
                </Typography>
              </Box>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {/* Left column: Filters panel */}
            <Grid item xs={12} md={3}>
              <FiltersPanel />
            </Grid>

            {/* Right column: Map and search results */}
            <Grid item xs={12} md={9}>
              {/* Interactive Map */}
              <Paper 
                elevation={0} 
                sx={{ 
                  height: 400, 
                  mb: 3, 
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <CampusDataMap 
                  height="100%" 
                  onPointClick={handleMapPointClick}
                />
              </Paper>

              {/* Search results */}
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'grey.200'
                }}
              >
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Search Results ({searchResults.length})
                </Typography>
                
                {searchResults.length > 0 ? (
                  <DataListPanel
                    previewItem={previewItem}
                    setPreviewItem={(item: Dataset | null) => setPreviewItem(item)}
                    searchResults={searchResults}
                  />
                ) : (
                  <Typography color="text.secondary">
                    No datasets found matching your criteria. Try adjusting your search.
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </FilterContextProvider>
  );
};

export default DatasetExplorer;
