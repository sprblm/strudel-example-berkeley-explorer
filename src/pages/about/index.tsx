import React from 'react';
import { Box, Container, Typography } from '@mui/material';

export const AboutPage = () => {
  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h1" gutterBottom>
          About Climate Data Analysis Platform
        </Typography>
        <Typography paragraph>
          The Climate Data Analysis Platform is an open-source project designed
          to help researchers and scientists access and analyze climate data
          from multiple sources in a unified interface.
        </Typography>
        <Typography paragraph>
          Built with modern web technologies including React, Material-UI, and
          React Query, the platform provides powerful tools for data discovery,
          visualization, and analysis.
        </Typography>
        <Typography paragraph>
          Our goal is to make climate data more accessible and easier to work
          with, enabling researchers to focus on their scientific work rather
          than data wrangling.
        </Typography>
      </Container>
    </Box>
  );
};
