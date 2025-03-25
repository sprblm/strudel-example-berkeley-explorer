import { AppBar, Toolbar, Typography, Button, Stack, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ExploreIcon from '@mui/icons-material/Explore';
import InfoIcon from '@mui/icons-material/Info';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import React from 'react';
import { config } from '../../strudel.config';
import { ImageWrapper } from './ImageWrapper';
import { cleanPath } from '../utils/queryParams.utils';

/**
 * Top navigation bar component
 */
export const TopBar: React.FC = () => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Stack direction="row" sx={{ alignItems: 'center', flexGrow: 1 }}>
          <RouterLink to="/">
            {!config.navbar.logo && (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
              >
                <HomeIcon />
              </IconButton>
            )}
            {config.navbar.logo && (
              <ImageWrapper height={30}>
                <img
                  src={cleanPath(
                    `${import.meta.env.BASE_URL}/${config.navbar.logo}`
                  )}
                  alt={config.navbar.title || "Application logo"}
                />
              </ImageWrapper>
            )}
          </RouterLink>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Climate Data Analysis Platform
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/"
              startIcon={<HomeIcon />}
            >
              Home
            </Button>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/search-repositories"
              startIcon={<SearchIcon />}
            >
              Search Data
            </Button>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/explore-data"
              startIcon={<ExploreIcon />}
            >
              Explore Data
            </Button>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/about"
              startIcon={<InfoIcon />}
            >
              About
            </Button>
            <IconButton color="inherit">
              <AccountCircleIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
