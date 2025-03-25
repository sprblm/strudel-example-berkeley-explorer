import { Box, Paper, Stack } from '@mui/material';
import React, { useState } from 'react';
import { FilterContextProvider } from '../../components/FilterContext';
import { PageHeader } from '../../components/PageHeader';
import { SharedPreviewPanel } from '../../components/SharedPreviewPanel';
import { DataView } from './_components/DataView';
import { DataViewHeader } from './_components/DataViewHeader';
import { FiltersPanel } from './_components/FiltersPanel';
import { taskflow } from './_config/taskflow.config';
import { ChartView } from './_components/ChartView';
import { MapView } from './_components/MapView';
import { CardView } from './_components/CardView';

/**
 * Main explorer page in the explore-data Task Flow.
 * This page includes the page header, filters panel,
 * main table, and the table row preview panel.
 */

interface PreviewItem {
  id: string;
  title: string;
  description?: string;
  // Add other necessary fields based on your data structure
}

const DataExplorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [previewItem, setPreviewItem] = useState<PreviewItem | null>(null);
  const [showFiltersPanel, setShowFiltersPanel] = useState(true);
  const [viewMode, setViewMode] = useState('table');

  const handleCloseFilters = () => {
    setShowFiltersPanel(false);
  };

  const handleToggleFilters = () => {
    setShowFiltersPanel(!showFiltersPanel);
  };

  const handleClosePreview = () => {
    setPreviewItem(null);
  };

  const handleViewModeChange = (mode: string) => {
    setViewMode(mode);
  };

  return (
    <FilterContextProvider>
      <Box>
        <PageHeader
          pageTitle={taskflow.pages.index.title}
          description={taskflow.pages.index.description}
          sx={{
            marginBottom: 1,
            padding: 2,
          }}
        />
        <Box>
          <Stack direction="row">
            {showFiltersPanel && (
              <Box
                sx={{
                  width: '350px',
                }}
              >
                <FiltersPanel onClose={handleCloseFilters} />
              </Box>
            )}
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                minHeight: '600px',
                minWidth: 0,
              }}
            >
              <DataViewHeader
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onToggleFiltersPanel={handleToggleFilters}
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
              />
              
              {viewMode === 'table' && (
                <DataView
                  searchTerm={searchTerm}
                  setPreviewItem={setPreviewItem}
                />
              )}
              
              {viewMode === 'chart' && (
                <ChartView 
                  searchTerm={searchTerm}
                  setPreviewItem={setPreviewItem}
                />
              )}
              
              {viewMode === 'map' && (
                <MapView 
                  searchTerm={searchTerm}
                  setPreviewItem={setPreviewItem}
                />
              )}
              
              {viewMode === 'card' && (
                <CardView 
                  searchTerm={searchTerm}
                  setPreviewItem={setPreviewItem}
                />
              )}
            </Paper>
            
            {previewItem && (
              <Box
                sx={{
                  maxWidth: '600px',
                  minWidth: '400px',
                }}
              >
                <SharedPreviewPanel
                  previewItem={previewItem}
                  onClose={handleClosePreview}
                  idField={taskflow.data.list.idField}
                  columns={taskflow.pages.index.tableColumns}
                  detailsConfig={{ 
                    enabled: true, 
                    path: '/explore' 
                  }}
                />
              </Box>
            )}
          </Stack>
        </Box>
      </Box>
    </FilterContextProvider>
  );
};

export default DataExplorer;
