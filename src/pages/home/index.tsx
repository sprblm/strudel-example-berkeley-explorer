/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Box, Container, Typography, Paper, Stack, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExploreIcon from '@mui/icons-material/Explore';
import { Link as RouterLink } from 'react-router-dom';

export const HomePage = () => {
  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Box textAlign="center">
            <Typography variant="h3" component="h1" gutterBottom>
              Climate Data Analysis Platform
            </Typography>
            <Typography variant="h5" color="text.secondary" paragraph>
              Discover, explore, and analyze climate data from multiple sources
            </Typography>
          </Box>

          <Stack 
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            justifyContent="center"
          >
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                flex: 1,
                textAlign: 'center',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
            >
              <SearchIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Search Data Repositories
              </Typography>
              <Typography paragraph>
                Find climate datasets from NOAA, NASA, WorldClim, and other sources.
              </Typography>
              <Button 
                variant="contained" 
                component={RouterLink} 
                to="/search-repositories"
                startIcon={<SearchIcon />}
              >
                Search Data
              </Button>
            </Paper>

            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                flex: 1,
                textAlign: 'center',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
            >
              <ExploreIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Explore & Visualize
              </Typography>
              <Typography paragraph>
                Analyze climate data with interactive charts, maps, and visualizations.
              </Typography>
              <Button 
                variant="contained" 
                component={RouterLink} 
                to="/explore-data"
                startIcon={<ExploreIcon />}
              >
                Explore Data
              </Button>
            </Paper>
          </Stack>

          <Paper sx={{ p: 3, mt: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              About This Platform
            </Typography>
            <Typography paragraph>
              The Climate Data Analysis Platform is a case study example application built with the Strudel Kit, 
              demonstrating how scientific data can be searched, explored, and visualized in a user-friendly interface.
            </Typography>
            <Typography paragraph>
              This platform provides access to climate data from various sources, including NOAA, NASA, WorldClim, CMIP6, 
              and ERA5, allowing researchers and climate scientists to easily find and analyze relevant datasets.
            </Typography>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
};
