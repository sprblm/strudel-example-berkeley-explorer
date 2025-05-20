import { Box, Typography, Paper, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { ArrowRightIcon } from '../../../components/Icons';
import { Button } from '../../../components/Button';
import { DataListPanelProps } from '../_config/taskflow.types';
import { useState, useEffect } from 'react';

/**
 * Display search results in a clean, modern format
 * Shows dataset title, description, and metadata
 */
const DataListPanel = ({ searchResults, previewItem, setPreviewItem }: DataListPanelProps) => {
  const [sortBy, setSortBy] = useState('relevance');
  const [sortedResults, setSortedResults] = useState(searchResults);

  // Update sorted results when searchResults or sortBy changes
  useEffect(() => {
    let results = [...searchResults];
    switch (sortBy) {
      case 'distance':
        // Assuming dataset has a distance property or we can calculate it
        results.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        break;
      case 'species':
        results.sort((a, b) => (a.species || '').localeCompare(b.species || ''));
        break;
      case 'dbh':
        results.sort((a, b) => (a.dbh || 0) - (b.dbh || 0));
        break;
      case 'date':
        results.sort((a, b) => new Date(a.observationDate || '').getTime() - new Date(b.observationDate || '').getTime());
        break;
      default:
        // Relevance or other default sorting
        break;
    }
    setSortedResults(results);
  }, [searchResults, sortBy]);

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as string);
  };

  const formatDownloads = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 1 }}>
              Search Results
            </Typography>
            <Box sx={{ minWidth: 120 }}>
              <Select
                value={sortBy}
                onChange={handleSortChange}
                size="small"
                sx={{ fontSize: '0.875rem' }}
              >
                <MenuItem value="relevance">Relevance</MenuItem>
                <MenuItem value="distance">Distance</MenuItem>
                <MenuItem value="species">Species (A-Z)</MenuItem>
                <MenuItem value="dbh">DBH (Smallest-Largest)</MenuItem>
                <MenuItem value="date">Date (Oldest-Newest)</MenuItem>
              </Select>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Showing {sortedResults.length} results
          </Typography>
        </Box>

        <Box>
          {sortedResults.map((dataset, index) => (
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
