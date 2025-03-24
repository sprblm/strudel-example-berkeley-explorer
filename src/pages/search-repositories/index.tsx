import { Box, Stack, Divider } from '@mui/material';
import React, { useState } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { SharedPreviewPanel } from '../../components/SharedPreviewPanel';
import { DataListPanel } from './_components/DataListPanel';
import { FiltersPanel } from './_components/FiltersPanel';
import { SearchHistoryPanel } from './_components/SearchHistoryPanel';
import { taskflow } from './_config/taskflow.config';
import { FilterContext } from '../../components/FilterContext';

/**
 * The main explore page for the search-data-repositories Task Flow.
 * Displays a page header, `<FiltersPanel>`, `<DataListPanel>`, and `<PreviewPanel>`.
 */
const DatasetExplorer: React.FC = () => {
  const [previewItem, setPreviewItem] = useState<any>();
  const [showFiltersPanel, setShowFiltersPanel] = useState(true);

  const handleCloseFilters = () => {
    setShowFiltersPanel(false);
  };

  const handleToggleFilters = () => {
    setShowFiltersPanel(!showFiltersPanel);
  };

  const handleClosePreview = () => {
    setPreviewItem(null);
  };

  /**
   * Content to render on the page for this component
   */
  return (
    <FilterContext>
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
                onToggleFiltersPanel={handleToggleFilters}
                previewItem={previewItem}
                setPreviewItem={setPreviewItem}
              />
            </Box>
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
                    path: '/dataset' 
                  }}
                />
              </Box>
            )}
          </Stack>
        </Box>
      </Box>
    </FilterContext>
  );
};

export default DatasetExplorer;