import { Box, Container, Typography, Paper, Grid, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import FiltersPanel from './_components/FiltersPanel'; 
import { FilterContextProvider } from '../../components/FilterContext';
import { SearchIcon } from '../../components/Icons';
import DataListPanel from './_components/DataListPanel';
import type { Dataset } from '../../types/dataset.types';
import CampusDataMap from '../../components/CampusDataMap';
import type { AirQualityObservation } from '../../types/air-quality.interfaces';

/**
 * The main explore page for the search-data-repositories Task Flow.
 * Displays a page header, filters panel, map view, and search results.
 */

const DatasetExplorer: React.FC = () => {
  const [previewItem, setPreviewItem] = useState<Dataset | null>(null);
  const [searchResults, setSearchResults] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);

  // State for real datasets
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  
  // Load real environmental data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load tree data
        const treeResponse = await fetch('/data/processed/berkeley_trees_processed.json');
        if (!treeResponse.ok) throw new Error('Failed to fetch tree data');
        const treeData = await treeResponse.json();
        
        // Load air quality data
        const airResponse = await fetch('/data/airnow/airnow_94720_400days.json');
        if (!airResponse.ok) throw new Error('Failed to fetch air quality data');
        const airData: AirQualityObservation[] = await airResponse.json();
        
        // Create dataset entries from the real data
        const treeDataset: Dataset = {
          id: 'berkeley-trees',
          title: 'Berkeley Tree Inventory',
          publication_date: '2013-01-01',
          summary: `Complete inventory of ${Array.isArray(treeData) ? treeData.length.toLocaleString() : 0} trees in Berkeley, including species, condition, and location data.`,
          source: 'City of Berkeley',
          details: {
            type: 'tree',
            count: Array.isArray(treeData) ? treeData.length : 0,
            format: 'JSON',
            fields: ['species', 'healthCondition', 'dbh', 'height']
          }
        };
        
        // Group air quality data by parameter
        const pm25Data = airData.filter(d => d.ParameterName === 'PM2.5');
        const ozoneData = airData.filter(d => d.ParameterName === 'OZONE');
        
        const airQualityDataset: Dataset = {
          id: 'airnow-berkeley',
          title: 'Berkeley Air Quality Measurements',
          publication_date: new Date().toISOString().split('T')[0],
          summary: `Air quality measurements for Berkeley area, including ${pm25Data.length} PM2.5 readings and ${ozoneData.length} Ozone readings.`,
          source: 'AirNow API',
          details: {
            type: 'air',
            parameters: ['PM2.5', 'OZONE'],
            timespan: '400 days',
            format: 'JSON'
          }
        };
        
        setDatasets([treeDataset, airQualityDataset]);
        setSearchResults([treeDataset, airQualityDataset]); // Show all datasets by default
      } catch (error) {
        // Handle error silently or use a custom error handling utility
        setSearchResults([]); // Reset results on error
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);



  // Handle map point click
  const handleMapPointClick = (point: any) => {
    // Find dataset related to this point type
    const relatedDataset = datasets.find(dataset => 
      dataset.details?.type === point.type
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
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Environmental Datasets ({searchResults.length})
                  </Typography>
                  {loading && <CircularProgress size={24} />}
                </Box>
                
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={40} />
                  </Box>
                ) : searchResults.length > 0 ? (
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
