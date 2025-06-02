/**
 * SearchDataRepositoriesLayout component for the Search Repositories section.
 * Serves as the layout wrapper for all data repository search pages, providing consistent navigation.
 * Renders the TopBar navigation and contains the outlet for child route components.
 */
import { Box } from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from '../../components/TopBar';
const SearchDataRepositoriesLayout: React.FC = () => {
  // Content to render on the page for this component
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

export default SearchDataRepositoriesLayout;
