/* eslint-disable */
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Stack,
  Card,
  CardContent,
  Button as MuiButton
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { 
  SearchIcon, 
  LineChartIcon, 
  BarChartIcon, 
  UploadIcon,
  CheckCircleIcon,
} from '../../components/Icons';

import CampusDataMap from '../../components/CampusDataMap';

/**
 * HomePage Component
 * 
 * Main landing page for the Berkeley Environmental Health Explorer
 * Displays a hero section, interactive map, feature cards, and about sections
 */
export const HomePage = () => {
  /**
   * Feature definitions for the main application sections
   * Each feature includes:
   * - title: Display name for the feature
   * - description: Brief explanation of the feature's purpose
   * - icon: Visual representation of the feature
   * - path: Route to navigate to when clicked
   * - color: Theme color for the feature card
   */
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
            <CampusDataMap height="100%" showControls={true} />
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
