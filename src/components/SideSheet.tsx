import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ExploreIcon from '@mui/icons-material/Explore';
import InfoIcon from '@mui/icons-material/Info';
import { Link as RouterLink } from 'react-router-dom';
import React, { useState } from 'react';

export const SideSheet: React.FC = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }
    setOpen(open);
  };

  return (
    <>
      <IconButton onClick={toggleDrawer(true)}>
        <MenuIcon />
      </IconButton>
      <Drawer anchor='left' open={open} onClose={toggleDrawer(false)}>
        <List>
          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to='/' onClick={toggleDrawer(false)}>
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary='Home' />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to='/search-repositories' onClick={toggleDrawer(false)}>
              <ListItemIcon><SearchIcon /></ListItemIcon>
              <ListItemText primary='Search Data' />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to='/explore-data' onClick={toggleDrawer(false)}>
              <ListItemIcon><ExploreIcon /></ListItemIcon>
              <ListItemText primary='Explore Data' />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to='/about' onClick={toggleDrawer(false)}>
              <ListItemIcon><InfoIcon /></ListItemIcon>
              <ListItemText primary='About' />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};
