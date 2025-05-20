import { AppBar, Toolbar, Box, Button, Tooltip, IconButton } from '@mui/material';
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  GlobeIcon, 
  InfoIcon, 
  HomeIcon,
  UploadIcon,
  SearchIcon,
  BarChartIcon
} from './Icons';

/**
 * Top navigation bar with navigation options
 * Updated with modern aesthetic and Lucide icons
 */
export const TopBar: React.FC = () => {
  // Location is available if needed for future use
  // const location = useLocation();

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        borderBottom: '1px solid',
        borderColor: 'grey.200',
        backgroundColor: 'white',
        color: 'text.primary'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            component={Link} 
            to="/"
            startIcon={<HomeIcon />}
            sx={{ 
              mr: 2, 
              fontWeight: 600,
              color: 'primary.main',
              '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.04)' }
            }}
          >
          BEHE
          </Button>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, ml: 2 }}>
          <Button
            component={Link}
            to="/search-repositories"
            startIcon={<SearchIcon size={18} />}
            sx={{ 
              color: 'text.secondary',
              mr: 1.5,
              fontSize: '0.875rem',
              '&:hover': { 
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                color: 'text.primary'
              }
            }}
          >
            Search Data
          </Button>
          
          <Button
            component={Link}
            to="/explore-data"
            startIcon={<GlobeIcon size={18} />}
            sx={{ 
              color: 'text.secondary',
              mr: 1.5,
              fontSize: '0.875rem',
              '&:hover': { 
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                color: 'text.primary'
              }
            }}
          >
            Explore Data
          </Button>
          
          <Button
            component={Link}
            to="/compare-data"
            startIcon={<BarChartIcon size={18} />}
            sx={{ 
              color: 'text.secondary',
              mr: 1.5,
              fontSize: '0.875rem',
              '&:hover': { 
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                color: 'text.primary'
              }
            }}
          >
            Compare Data
          </Button>
          
          <Button
            component={Link}
            to="/contribute"
            startIcon={<UploadIcon size={18} />}
            sx={{
              color: 'primary.main',
              mr: 1.5,
              fontSize: '0.875rem',
              border: '1px solid',
              borderColor: 'primary.main',
              '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.04)' }
            }}
          >
            Contribute
          </Button>
        </Box>

        {/* Right side buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="About">
            <IconButton 
              component={Link}
              to="/about"
              size="small"
              sx={{ mr: 1 }}
            >
              <InfoIcon size={20} />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
