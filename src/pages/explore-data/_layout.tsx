/**
 * ExploreDataLayout component for the Explore Data section.
 * Serves as the layout wrapper for all data exploration pages, providing consistent navigation and structure.
 * Renders the TopBar navigation and contains the outlet for child route components.
 */
import { Box } from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from '../../components/TopBar';
const ExploreDataLayout: React.FC = () => {
  return (
    <Box>
      <Box sx={{ flexGrow: 1 }}>
        <TopBar />
      </Box>
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
};

export default ExploreDataLayout;
