/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { 
  SearchIcon, 
  LineChartIcon, 
  BarChartIcon, 
  PlayIcon, 
  ActivityIcon, 
  UploadIcon 
} from '../../components/Icons';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';

export const HomePage = () => {
  const features = [
    {
      title: 'Search Data',
      description: 'Access climate data from various repositories',
      icon: <SearchIcon size={24} />,
      path: '/search-repositories',
      color: '#3b82f6', // blue
    },
    {
      title: 'Explore Data',
      description: 'Analyze and visualize climate datasets',
      icon: <LineChartIcon size={24} />,
      path: '/explore-data',
      color: '#10b981', // green
    },
    {
      title: 'Compare Data',
      description: 'Compare multiple data sources and models',
      icon: <BarChartIcon size={24} />,
      path: '/compare-data',
      color: '#8b5cf6', // purple
    },
    {
      title: 'Run Computation',
      description: 'Access data processing tools and features',
      icon: <PlayIcon size={24} />,
      path: '/run-computation',
      color: '#f59e0b', // amber
    },
    {
      title: 'Monitor',
      description: 'Track and monitor tools and features',
      icon: <ActivityIcon size={24} />,
      path: '/monitor',
      color: '#ef4444', // red
    },
    {
      title: 'Contribute',
      description: 'Upload and share your own datasets',
      icon: <UploadIcon size={24} />,
      path: '/contribute',
      color: '#0ea5e9', // sky
    },
  ];

  return (
    <Box sx={{ py: 8, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
            Welcome to Climate Data Analysis Platform
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, maxWidth: '800px', mx: 'auto' }}>
            Discover, analyze, and share climate data with the scientific community.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  },
                }}
              >
                <Box
                  sx={{
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: `${feature.color}15`,
                        color: feature.color,
                        mr: 2,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flex: 1 }}>
                    {feature.description}
                  </Typography>

                  <Button
                    component={RouterLink}
                    to={feature.path}
                    variant="text"
                    color="primary"
                    sx={{ alignSelf: 'flex-start', fontWeight: 500 }}
                  >
                    Learn more
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 8, color: 'text.secondary' }}>
          <Typography variant="body2">
            2025 Climate Data Analysis Platform. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
