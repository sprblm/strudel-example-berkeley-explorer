import React, { useState } from 'react';
import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import SearchIcon from '@mui/icons-material/Search';
import { useFilters } from '../../../components/FilterContext';
import { taskflow } from '../_config/taskflow.config';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      <Box sx={{ p: 3 }}>
        <Typography component="div">{children}</Typography>
      </Box>
    </div>
  );
}

interface SearchItem {
  id: string;
  name: string;
  timestamp: string;
  filters: Record<string, any>;
}

// Mock data for search history
const mockSearchHistory: SearchItem[] = [
  {
    id: 'search-1',
    name: 'Arctic Temperature Data (1950-2020)',
    timestamp: '2025-03-17T14:25:00',
    filters: {
      'spatial_coverage': ['Arctic'],
      'variables': ['Temperature'],
      'temporal_coverage': '1950-01-01 to 2020-12-31'
    }
  },
  {
    id: 'search-2',
    name: 'Global Precipitation Patterns',
    timestamp: '2025-03-17T13:15:00',
    filters: {
      'spatial_coverage': ['Global'],
      'variables': ['Precipitation'],
      'temporal_resolution': ['monthly']
    }
  },
  {
    id: 'search-3',
    name: 'European Drought Conditions',
    timestamp: '2025-03-16T09:45:00',
    filters: {
      'spatial_coverage': ['Europe'],
      'variables': ['Soil Moisture', 'Precipitation'],
      'tags': ['Drought']
    }
  }
];

// Mock data for saved searches
const mockSavedSearches: SearchItem[] = [
  {
    id: 'saved-1',
    name: 'California Wildfire Risk Analysis',
    timestamp: '2025-03-10T11:30:00',
    filters: {
      'spatial_coverage': ['North America'],
      'variables': ['Temperature', 'Precipitation', 'Wind Speed'],
      'tags': ['Fires']
    }
  },
  {
    id: 'saved-2',
    name: 'Sea Level Rise in Coastal Cities',
    timestamp: '2025-03-05T16:20:00',
    filters: {
      'spatial_coverage': ['Global'],
      'variables': ['Sea Level'],
      'tags': ['Sea Level Rise', 'Coastal']
    }
  }
];

/**
 * Panel for displaying search history and saved searches in the Search Data Repositories task flow.
 * Allows users to view, apply, save, and manage their past searches.
 */
export const SearchHistoryPanel: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchHistory, setSearchHistory] = useState<SearchItem[]>(mockSearchHistory);
  const [savedSearches, setSavedSearches] = useState<SearchItem[]>(mockSavedSearches);
  const { updateAllFilters } = useFilters();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleApplySearch = (item: SearchItem) => {
    // Apply the saved filters to the current search
    updateAllFilters(item.filters);
  };

  const handleSaveSearch = (item: SearchItem) => {
    // Check if the search is already saved
    const isAlreadySaved = savedSearches.some(saved => saved.id === item.id);
    
    if (!isAlreadySaved) {
      // Create a new saved search with a different ID
      const newSavedSearch = {
        ...item,
        id: `saved-${Date.now()}`,
      };
      setSavedSearches([newSavedSearch, ...savedSearches]);
    }
  };

  const handleDeleteHistory = (id: string) => {
    setSearchHistory(searchHistory.filter(item => item.id !== id));
  };

  const handleDeleteSaved = (id: string) => {
    setSavedSearches(savedSearches.filter(item => item.id !== id));
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        borderRadius: 1, 
        border: '1px solid', 
        borderColor: 'divider',
        overflow: 'hidden',
        mb: 2
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
        >
          <Tab icon={<HistoryIcon />} label="HISTORY" id="search-history-tab-0" />
          <Tab icon={<BookmarkIcon />} label="SAVED" id="search-history-tab-1" />
        </Tabs>
      </Box>
      
      <TabPanel value={tabValue} index={0} sx={{ p: 0 }}>
        <List>
          {searchHistory.map((item) => (
            <ListItemButton key={item.id}>
              <ListItemText
                primary={
                  <Typography component="div" variant="body2">
                    {item.name}
                  </Typography>
                }
                secondary={
                  <Typography component="div" variant="caption" color="text.secondary">
                    {new Date(item.timestamp).toLocaleDateString()} • {new Date(item.timestamp).toLocaleTimeString()}
                  </Typography>
                }
              />
              <Box>
                <Tooltip title="Save Search">
                  <IconButton edge="end" size="small" onClick={() => handleSaveSearch(item)}>
                    <BookmarkBorderIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete from History">
                  <IconButton edge="end" size="small" onClick={() => handleDeleteHistory(item.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </ListItemButton>
          ))}
        </List>
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <Typography component="div" variant="body1" sx={{ p: 3 }}>
          Saved Searches
        </Typography>
        
        {savedSearches.length === 0 ? (
          <Typography component="div" variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            No saved searches yet
          </Typography>
        ) : (
          <List disablePadding>
            {savedSearches.map((item) => (
              <React.Fragment key={item.id}>
                <ListItem
                  disablePadding
                  secondaryAction={
                    <Tooltip title="Delete Saved Search">
                      <IconButton edge="end" size="small" onClick={() => handleDeleteSaved(item.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  }
                >
                  <ListItemButton 
                    dense 
                    onClick={() => handleApplySearch(item)}
                    sx={{ pr: 8 }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <BookmarkIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.name}
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          {Object.entries(item.filters).map(([key, value]) => (
                            <Typography key={key} component="div" variant="caption" sx={{ mr: 1 }}>
                              {key.split('_').join(' ')}: <strong>{Array.isArray(value) ? value.join(', ') : value}</strong>
                            </Typography>
                          ))}
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        )}
      </TabPanel>
    </Paper>
  );
};
