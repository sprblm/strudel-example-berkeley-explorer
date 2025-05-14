import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Stack,
  Button as MuiButton,
  CircularProgress,
  Chip
} from '@mui/material';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  SearchIcon, 
  LineChartIcon, 
  BarChartIcon, 
  UploadIcon,
  CheckCircleIcon,
  AirQualityIcon,
  TreeIcon
} from '../../components/Icons';

import BerkeleyDataMap from '../../components/BerkeleyDataMap';
import type { AirQualityObservation } from '../../types/air-quality.interfaces';

/**
 * HomePage Component
 * 
 * Main landing page for the Berkeley Environmental Health Explorer
 * Displays a hero section, interactive map, feature cards, and about sections
 */
export const HomePage = () => {
  const [loading, setLoading] = useState(true);
  // State for storing the fetched data
  const [, setAirQualityData] = useState<AirQualityObservation[]>([]);
  const [, setTreeData] = useState<any>(null);
  const [latestAirQuality, setLatestAirQuality] = useState<{
    pm25: AirQualityObservation | null;
    ozone: AirQualityObservation | null;
    date: string | null;
  }>({
    pm25: null,
    ozone: null,
    date: null
  });
  const [treeSummary, setTreeSummary] = useState<{
    totalTrees: number;
    speciesCount: number;
    healthyPercentage: number;
  }>({
    totalTrees: 0,
    speciesCount: 0,
    healthyPercentage: 0
  });

  // Load environmental data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch air quality data
        const airResponse = await fetch('/data/airnow/airnow_94720_400days.json');
        if (!airResponse.ok) throw new Error('Failed to fetch air quality data');
        const airData: AirQualityObservation[] = await airResponse.json();
        setAirQualityData(airData);
        
        // Find latest PM2.5 and Ozone readings
        const sortedData = [...airData].sort((a, b) => 
          new Date(b.DateObserved).getTime() - new Date(a.DateObserved).getTime()
        );
        
        const latestDate = sortedData[0]?.DateObserved || null;
        const latestPM25 = sortedData.find(d => d.ParameterName === 'PM2.5') || null;
        const latestOzone = sortedData.find(d => d.ParameterName === 'OZONE') || null;
        
        setLatestAirQuality({
          pm25: latestPM25,
          ozone: latestOzone,
          date: latestDate
        });
        
        // Fetch tree data
        const treeResponse = await fetch('/data/processed/berkeley_trees_processed.json');
        if (!treeResponse.ok) throw new Error('Failed to fetch tree data');
        const treeData = await treeResponse.json();
        setTreeData(treeData);
        
        // Calculate tree statistics
        const trees = Array.isArray(treeData) ? treeData : [];
        const totalTrees = trees.length;
        
        // Count unique species
        const species = new Set();
        trees.forEach((tree: any) => {
          if (tree.species) {
            species.add(tree.species);
          }
        });
        
        // Calculate percentage of healthy trees
        const healthyTrees = trees.filter((tree: any) => 
          tree.healthCondition?.toLowerCase() === 'good' || 
          tree.healthCondition?.toLowerCase() === 'excellent'
        ).length;
        const healthyPercentage = totalTrees > 0 ? Math.round((healthyTrees / totalTrees) * 100) : 0;
        
        setTreeSummary({
          totalTrees,
          speciesCount: species.size,
          healthyPercentage,
        });
      } catch (error) {
        console.error('Error loading environmental data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Get AQI color based on value
  const getAqiColor = (aqi: number): string => {
    if (aqi <= 50) return '#00E400'; // Good
    if (aqi <= 100) return '#FFFF00'; // Moderate
    if (aqi <= 150) return '#FF7E00'; // Unhealthy for Sensitive Groups
    if (aqi <= 200) return '#FF0000'; // Unhealthy
    if (aqi <= 300) return '#99004C'; // Very Unhealthy
    return '#7E0023'; // Hazardous
  };

  /**
   * Feature definitions for the main application sections
   * Each feature includes:
   * - title: Display name for the feature
   * - description: Brief explanation of the feature's purpose
   * - icon: Visual representation of the feature
   * - path: Route to navigate to when clicked
   * - color: Theme color for the feature card
   */
  // Feature cards for navigation - defined for future use
  // Currently not used in the UI but kept for planned feature implementation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const features = [
    {
      title: 'Search',
      description: 'Find specific trees, air quality sensors, or campus locations using filters',
      icon: <SearchIcon size={24} />,
      path: '/search-repositories',
      color: '#4caf50', // green
    },
    {
      title: 'Explore',
      description: 'Visualize tree distribution, health, and air quality readings through interactive maps',
      icon: <LineChartIcon size={24} />,
      path: '/explore-data',
      color: '#2196f3', // blue
    },
    {
      title: 'Compare',
      description: 'Analyze differences in environmental conditions across campus locations or time periods',
      icon: <BarChartIcon size={24} />,
      path: '/compare-data',
      color: '#f44336', // red
    },
    {
      title: 'Contribute',
      description: 'Add observations like tree measurements or air quality readings during fieldwork',
      icon: <UploadIcon size={24} />,
      path: '/contribute',
      color: '#00bcd4', // cyan
    },
  ];

  const benefits = [
    {
      text: 'Tangible, relatable scale for learning and data collection',
      icon: <CheckCircleIcon size={16} color="#4caf50" />,
    },
    {
      text: 'Combines complementary datasets in a familiar setting',
      icon: <CheckCircleIcon size={16} color="#4caf50" />,
    },
    {
      text: 'Enables meaningful citizen science participation',
      icon: <CheckCircleIcon size={16} color="#4caf50" />,
    },
    {
      text: 'Leverages local relevance and immediate impact',
      icon: <CheckCircleIcon size={16} color="#4caf50" />,
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(to bottom, #1e3a8a, #3b82f6)',
          color: 'white', 
          py: 6,
          textAlign: 'center', // Ensure all content is centered
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={2} alignItems="center">
            <Typography variant="h3" component="h1" fontWeight="bold">
              Berkeley Environmental Health Explorer
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: '800px', mx: 'auto', mt: 2 }}>
              Explore, learn about, and contribute to tree inventory and air quality data on the UC Berkeley campus.
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* Map Preview Section */}
      <Box sx={{ bgcolor: '#f5f7fa', py: 4 }}>
        <Container maxWidth="lg">
          {/* Environmental Data Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {/* Air Quality Card */}
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={1}
                sx={{ 
                  borderRadius: 2, 
                  p: 2,
                  height: '100%',
                  borderLeft: '4px solid',
                  borderLeftColor: latestAirQuality.pm25 ? getAqiColor(latestAirQuality.pm25.AQI) : '#ccc'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AirQualityIcon size={24} color="#3B82F6" />
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    Current Air Quality
                  </Typography>
                  {loading && <CircularProgress size={16} sx={{ ml: 'auto' }} />}
                </Box>
                
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <>
                    {latestAirQuality.pm25 ? (
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">PM2.5 AQI</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <Typography variant="h4" fontWeight="bold">
                              {latestAirQuality.pm25.AQI}
                            </Typography>
                            <Chip 
                              label={latestAirQuality.pm25.Category.Name} 
                              size="small" 
                              sx={{ 
                                ml: 1, 
                                bgcolor: getAqiColor(latestAirQuality.pm25.AQI),
                                color: latestAirQuality.pm25.AQI <= 100 ? '#000' : '#fff'
                              }} 
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Ozone AQI</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <Typography variant="h4" fontWeight="bold">
                              {latestAirQuality.ozone?.AQI || 'N/A'}
                            </Typography>
                            {latestAirQuality.ozone && (
                              <Chip 
                                label={latestAirQuality.ozone.Category.Name} 
                                size="small" 
                                sx={{ 
                                  ml: 1, 
                                  bgcolor: getAqiColor(latestAirQuality.ozone.AQI),
                                  color: latestAirQuality.ozone.AQI <= 100 ? '#000' : '#fff'
                                }} 
                              />
                            )}
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Last updated: {new Date(latestAirQuality.date || '').toLocaleDateString()}
                          </Typography>
                          <MuiButton 
                            component={RouterLink} 
                            to="/compare-data" 
                            size="small" 
                            sx={{ mt: 1, px: 0 }}
                          >
                            View Air Quality Trends
                          </MuiButton>
                        </Grid>
                      </Grid>
                    ) : (
                      <Typography>No air quality data available</Typography>
                    )}
                  </>
                )}
              </Paper>
            </Grid>
            
            {/* Tree Data Card */}
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={1}
                sx={{ 
                  borderRadius: 2, 
                  p: 2,
                  height: '100%',
                  borderLeft: '4px solid #4CAF50'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TreeIcon size={24} color="#4CAF50" />
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    Berkeley Tree Inventory
                  </Typography>
                  {loading && <CircularProgress size={16} sx={{ ml: 'auto' }} />}
                </Box>
                
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Total Trees</Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {treeSummary.totalTrees.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Unique Species</Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {treeSummary.speciesCount}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Healthy Trees</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <Typography variant="h4" fontWeight="bold">
                          {Math.round(treeSummary.healthyPercentage)}%
                        </Typography>
                      </Box>
                      <MuiButton 
                        component={RouterLink} 
                        to="/search-repositories" 
                        size="small" 
                        sx={{ mt: 1, px: 0 }}
                      >
                        Search Tree Database
                      </MuiButton>
                    </Grid>
                  </Grid>
                )}
              </Paper>
            </Grid>
          </Grid>
          
          <Paper 
            elevation={1}
            sx={{ 
              borderRadius: 2, 
              overflow: 'hidden',
              position: 'relative',
              height: '400px',
              mb: 1,
            }}
          >
            {/* Interactive Campus Map */}
            <BerkeleyDataMap height="100%" showControls={true} />
          </Paper>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <MuiButton 
              component={RouterLink} 
              to="/explore-data" 
              variant="contained" 
              color="primary"
              startIcon={<LineChartIcon size={16} />}
            >
              Explore Full Map
            </MuiButton>
          </Box>
        </Container>
      </Box>

      {/* About Section */}
      <Box sx={{ bgcolor: '#f5f7fa', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
                About the Project
              </Typography>
              <Typography variant="body1" paragraph>
                The Berkeley Environmental Health Explorer is a web application 
                designed for Berkeley students to discover, explore, compare, and contribute to 
                environmental data on campus.
              </Typography>
              <Typography variant="body1" paragraph>
                Built with STRUDEL Kit, it integrates key scientific data flows into a cohesive educational 
                experience, turning the campus into a living laboratory.
              </Typography>
              <MuiButton 
                variant="outlined" 
                color="primary"
                sx={{ 
                  borderColor: '#1e3a8a', 
                  color: '#1e3a8a',
                  '&:hover': {
                    borderColor: '#3b82f6',
                    bgcolor: 'rgba(59, 130, 246, 0.04)'
                  }
                }}
              >
                Learn More
              </MuiButton>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
                Why Study Campus Environment?
              </Typography>
              <Stack spacing={2}>
                {benefits.map((benefit, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                    {benefit.icon}
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      {benefit.text}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};
