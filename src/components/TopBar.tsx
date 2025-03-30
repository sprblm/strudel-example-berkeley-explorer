import { AppBar, Toolbar, InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import React from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Top navigation bar with search input and sidesheet menu
 */
export const TopBar: React.FC = () => {
  const location = useLocation();
  const showSearch = location.pathname !== '/';

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <InputBase
          placeholder="Search..."
          sx={{ 
            ml: 2,
            flexGrow: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: 1,
            px: 1,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
            },
          }}
          startAdornment={
            <SearchIcon sx={{ color: 'inherit', mr: 1 }} />
          }
        />
      </Toolbar>
    </AppBar>
  );
};
