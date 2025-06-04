/**
 * Main application entry point component for the Berkeley Environmental Health Explorer.
 * Serves as the root page that provides navigation to all main sections of the application.
 * Displays an overview of available features and quick access to key workflows.
 */
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Paper,
} from '@mui/material';
import React from 'react';
import { AppLink } from '../components/AppLink';
import { Layout } from '../components/Layout';
import SearchIcon from '@mui/icons-material/Search';
import ExploreIcon from '@mui/icons-material/Explore';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ParkIcon from '@mui/icons-material/Park';
import AirIcon from '@mui/icons-material/Air';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

/**
 * Home page component that renders at the root route /
 */
const HomePage: React.FC = () => {
  const features = [
    {
      title: 'Search',
      description:
        'Find specific trees, air quality sensors, or campus locations using filters',
      icon: <SearchIcon fontSize="large" sx={{ color: '#4caf50' }} />,
      path: '/search-repositories',
      color: '#4caf50',
    },
    {
      title: 'Explore',
      description:
        'Visualize tree distribution, health, and air quality readings through interactive maps',
      icon: <ExploreIcon fontSize="large" sx={{ color: '#2196f3' }} />,
      path: '/explore-data',
      color: '#2196f3',
    },
    {
      title: 'Compare',
      description:
        'Analyze differences in environmental conditions across campus locations or time periods',
      icon: <CompareArrowsIcon fontSize="large" sx={{ color: '#f44336' }} />,
      path: '/compare-data',
      color: '#f44336',
    },
    {
      title: 'Contribute',
      description:
        'Add observations like tree measurements or air quality readings during fieldwork',
      icon: <CloudUploadIcon fontSize="large" sx={{ color: '#00bcd4' }} />,
      path: '/contribute',
      color: '#00bcd4',
    },
  ];

  const benefits = [
    {
      text: 'Tangible, relatable scale for learning and data collection',
      icon: (
        <CheckCircleOutlineIcon fontSize="small" sx={{ color: '#4caf50' }} />
      ),
    },
    {
      text: 'Combines complementary datasets in a familiar setting',
      icon: (
        <CheckCircleOutlineIcon fontSize="small" sx={{ color: '#4caf50' }} />
      ),
    },
    {
      text: 'Enables meaningful citizen science participation',
      icon: (
        <CheckCircleOutlineIcon fontSize="small" sx={{ color: '#4caf50' }} />
      ),
    },
    {
      text: 'Leverages local relevance and immediate impact',
      icon: (
        <CheckCircleOutlineIcon fontSize="small" sx={{ color: '#4caf50' }} />
      ),
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(to bottom, #1e3a8a, #3b82f6)',
          color: 'white',
          py: 6,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={2} sx={{ textAlign: 'center' }}>
            <Typography variant="h3" component="h1" fontWeight="bold">
              Berkeley Environmental Health Explorer
            </Typography>
            <Typography
              variant="h6"
              sx={{ maxWidth: '800px', mx: 'auto', mt: 2 }}
            >
              Explore, learn about, and contribute to tree inventory and air
              quality data on the UC Berkeley campus.
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
              height: '300px',
              mb: 1,
            }}
          >
            {/* Mock map with markers */}
            <Box
              sx={{
                height: '100%',
                width: '100%',
                bgcolor: '#e8f5e9',
                position: 'relative',
                p: 2,
              }}
            >
              {/* Map elements */}
              <Box
                sx={{ position: 'absolute', right: 20, top: 20, zIndex: 10 }}
              >
                <Paper elevation={2} sx={{ p: 1, borderRadius: 1 }}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Layers
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ParkIcon fontSize="small" sx={{ color: '#4caf50' }} />
                      <Typography variant="body2">Trees</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AirIcon fontSize="small" sx={{ color: '#f44336' }} />
                      <Typography variant="body2">Air Quality</Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Box>

              {/* Tree markers */}
              <Box sx={{ position: 'absolute', top: '30%', left: '15%' }}>
                <Box
                  sx={{
                    bgcolor: '#4caf50',
                    color: 'white',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="caption">T</Typography>
                </Box>
              </Box>

              <Box sx={{ position: 'absolute', top: '50%', left: '25%' }}>
                <Box
                  sx={{
                    bgcolor: '#4caf50',
                    color: 'white',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="caption">T</Typography>
                </Box>
              </Box>

              <Box sx={{ position: 'absolute', top: '70%', left: '20%' }}>
                <Box
                  sx={{
                    bgcolor: '#4caf50',
                    color: 'white',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="caption">T</Typography>
                </Box>
              </Box>

              {/* Air quality markers */}
              <Box sx={{ position: 'absolute', top: '25%', left: '60%' }}>
                <Box
                  sx={{
                    bgcolor: '#2196f3',
                    color: 'white',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="caption">A</Typography>
                </Box>
              </Box>

              <Box sx={{ position: 'absolute', top: '40%', right: '30%' }}>
                <Box
                  sx={{
                    bgcolor: '#f44336',
                    color: 'white',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="caption">A</Typography>
                </Box>
              </Box>

              <Box sx={{ position: 'absolute', top: '60%', right: '40%' }}>
                <Box
                  sx={{
                    bgcolor: '#2196f3',
                    color: 'white',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="caption">A</Typography>
                </Box>
              </Box>

              {/* Location pin */}
              <Box sx={{ position: 'absolute', top: '45%', left: '45%' }}>
                <Box sx={{ color: '#1e3a8a', transform: 'translateY(-50%)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                    />
                  </svg>
                </Box>
              </Box>

              {/* Building outlines */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '20%',
                  left: '40%',
                  width: '100px',
                  height: '60px',
                  bgcolor: 'rgba(144, 202, 249, 0.5)',
                  border: '1px solid #90caf9',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: '40%',
                  left: '55%',
                  width: '80px',
                  height: '40px',
                  bgcolor: 'rgba(144, 202, 249, 0.5)',
                  border: '1px solid #90caf9',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: '60%',
                  left: '45%',
                  width: '90px',
                  height: '50px',
                  bgcolor: 'rgba(144, 202, 249, 0.5)',
                  border: '1px solid #90caf9',
                }}
              />
            </Box>
          </Paper>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'right' }}
          >
            UC Berkeley Campus Map
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'center', mt: 1 }}
          >
            Interactive map of Berkeley campus showing tree and air quality data
          </Typography>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ my: 6 }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{ textAlign: 'center', mb: 4 }}
        >
          Explore Our Features
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
                  },
                  border: '1px solid',
                  borderColor: 'grey.200',
                }}
              >
                <CardContent
                  sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                    <Typography variant="h6" component="h3" sx={{ ml: 1 }}>
                      {feature.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 2, flexGrow: 1 }}>
                    {feature.description}
                  </Typography>
                  <Button
                    variant="contained"
                    component={AppLink}
                    to={feature.path}
                    sx={{
                      bgcolor: '#4caf50',
                      '&:hover': {
                        bgcolor: '#388e3c',
                      },
                      alignSelf: 'flex-start',
                    }}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* About Section */}
      <Box sx={{ bgcolor: '#f5f7fa', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h5"
                component="h2"
                fontWeight="bold"
                gutterBottom
              >
                About the Project
              </Typography>
              <Typography variant="body1" paragraph>
                The Berkeley Environmental Health Explorer is a web application
                designed for Berkeley students to discover, explore, compare,
                and contribute to environmental data on campus.
              </Typography>
              <Typography variant="body1" paragraph>
                Built with STRUDEL Kit, it integrates key scientific data flows
                into a cohesive educational experience, turning the campus into
                a living laboratory.
              </Typography>
              <Button
                variant="outlined"
                sx={{
                  borderColor: '#1e3a8a',
                  color: '#1e3a8a',
                  '&:hover': {
                    borderColor: '#3b82f6',
                    bgcolor: 'rgba(59, 130, 246, 0.04)',
                  },
                }}
              >
                Learn More
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h5"
                component="h2"
                fontWeight="bold"
                gutterBottom
              >
                Why Study Campus Environment?
              </Typography>
              <Stack spacing={2}>
                {benefits.map((benefit, index) => (
                  <Box
                    key={index}
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
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
    </Layout>
  );
};

export default HomePage;
