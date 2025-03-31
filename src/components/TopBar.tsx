import { AppBar, Toolbar, InputBase, Box, Button, Tooltip, IconButton } from '@mui/material';
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  SearchIcon, 
  GlobeIcon, 
  HelpCircleIcon, 
  SettingsIcon,
  HomeIcon,
  UploadIcon,
  PlayCircle
} from './Icons';

/**
 * Top navigation bar with search input and navigation options
 * Updated with modern aesthetic and Lucide icons
 */
export const TopBar: React.FC = () => {
  const location = useLocation();
  const showSearch = location.pathname !== '/';

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
            CDAP
          </Button>
          
          {showSearch && (
            <Box sx={{ position: 'relative', ml: 1 }}>
              <InputBase
                placeholder="Search datasets..."
                sx={{ 
                  width: 300,
                  pl: 4.5,
                  pr: 2,
                  py: 0.75,
                  backgroundColor: 'grey.100',
                  borderRadius: 2,
                  fontSize: '0.875rem',
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: 'grey.200',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'grey.200',
                    boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
                  }
                }}
              />
              <Box
                sx={{ 
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(107, 114, 128, 0.8)'
                }}
              >
                <SearchIcon size={18} />
              </Box>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            component={Link}
            to="/search-repositories"
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            Search Data
          </Button>
          
          <Button
            component={Link}
            to="/explore-data"
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            Explore Data
          </Button>
          
          <Button
            component={Link}
            to="/compare-data"
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            Compare Data
          </Button>
          
          <Button
            component={Link}
            to="/run-computation"
            size="small"
            startIcon={<PlayCircle size={16} />}
            sx={{ color: 'text.secondary' }}
          >
            Run Computation
          </Button>
          
          <Button
            component={Link}
            to="/contribute"
            size="small"
            startIcon={<UploadIcon size={16} />}
            sx={{ 
              ml: 1, 
              color: 'primary.main', 
              borderColor: 'primary.main',
              borderRadius: 1,
              borderWidth: 1,
              borderStyle: 'solid',
              px: 2
            }}
          >
            Contribute
          </Button>

          <Box sx={{ ml: 1, display: 'flex', gap: 0.5 }}>
            <Tooltip title="Help & Documentation">
              <IconButton 
                color="inherit" 
                size="small"
                sx={{ 
                  color: 'grey.700',
                  '&:hover': { backgroundColor: 'grey.100' } 
                }}
              >
                <HelpCircleIcon size={20} />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Settings">
              <IconButton 
                color="inherit" 
                size="small"
                sx={{ 
                  color: 'grey.700',
                  '&:hover': { backgroundColor: 'grey.100' } 
                }}
              >
                <SettingsIcon size={20} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
