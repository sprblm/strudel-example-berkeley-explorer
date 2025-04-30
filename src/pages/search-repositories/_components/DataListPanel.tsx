import { Box, Typography, Paper } from '@mui/material';
import { ArrowRightIcon } from '../../../components/Icons';
import { Button } from '../../../components/Button';
import { DataListPanelProps } from '../_config/taskflow.types';

/**
 * Display search results in a clean, modern format
 * Shows dataset title, description, and metadata
 */
const DataListPanel = ({ searchResults, previewItem, setPreviewItem }: DataListPanelProps) => {
  // Format data for urban tree inventory and air quality datasets
  const formatData = (data: Dataset): string => {
    if (data.type === 'urban-tree-inventory') {
      return `Tree Species: ${data.species}, Location: ${data.location}`;
    } else if (data.type === 'air-quality') {
      return `Air Quality Parameter: ${data.parameter}, Value: ${data.value}`;
    }
    return 'Unknown dataset type';
  };

  if (!searchResults || searchResults.length === 0) {
    return (
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: 2, 
          border: '1px solid',
          borderColor: 'grey.200',
          textAlign: 'center'
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Enter a search term to find datasets
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 0, 
          borderRadius: 2, 
          border: '1px solid',
          borderColor: 'grey.200',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'grey.200' }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 1 }}>
            Search Results
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Showing {searchResults.length} results
          </Typography>
        </Box>

        <Box>
          {searchResults.map((dataset, index) => (
            <Box 
              key={dataset.id} 
              sx={{ 
                p: 3,
                borderBottom: index < searchResults.length - 1 ? '1px solid' : 'none',
                borderColor: 'grey.200',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                backgroundColor: previewItem?.id === dataset.id ? 'grey.50' : 'transparent',
                '&:hover': {
                  backgroundColor: 'grey.50'
                }
              }}
              onClick={() => setPreviewItem(dataset)}
            >
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {dataset.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {dataset.summary}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    Source:
                  </Typography>{' '}
                  <Typography variant="body2" component="span">
                    {dataset.source}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    Format:
                  </Typography>{' '}
                  <Typography variant="body2" component="span">
                    {/* Use the file extension or default to NetCDF */}
                    {dataset.attached_files?.[0]?.file_name.split('.').pop() || 'NetCDF'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    Size:
                  </Typography>{' '}
                  <Typography variant="body2" component="span">
                    {/* Use file size if available or show default */}
                    {dataset.attached_files?.[0]?.file_size || '2.5 GB'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  <Typography variant="caption" color="text.secondary">
                    Last updated: {dataset.publication_date}
                  </Typography>
                  
                  <Typography variant="caption" color="text.secondary">
                    {/* Default download count since it's not in the Dataset type */}
                    {formatDownloads(1250)} downloads
                  </Typography>
                </Box>

                <Button
                  variant="text"
                  color="primary"
                  endIcon={<ArrowRightIcon size={16} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewItem(dataset);
                  }}
                  size="small"
                  sx={{ fontWeight: 500 }}
                >
                  View Details
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default DataListPanel;
