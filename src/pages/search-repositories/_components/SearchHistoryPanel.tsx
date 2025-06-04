/**
 * SearchHistoryPanel component for the Search Repositories section.
 * Displays saved searches and tags for logged-in users.
 * Allows users to view, edit, and delete saved searches.
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Chip,
  Stack,
  Typography,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  ListItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import SearchIcon from '@mui/icons-material/Search';
import { useFilters } from '../../../components/FilterContext';
import { FilterOperator } from '../../../context/filterTypes';
import styles from './SearchHistoryPanel.module.css';
import TabPanel from './TabPanel';

interface SearchHistoryItem {
  id: string;
  filters: Record<string, string>;
  timestamp: number;
}

interface SavedSearchItem {
  id: string;
  name: string;
  timestamp: string;
  filters: Record<string, string>;
}

export const SearchHistoryPanel = () => {
  const { activeFilters, dispatch } = useFilters();
  const [searchHistoryState, setSearchHistoryState] = useState<
    SearchHistoryItem[]
  >([]);
  const [tabValue, setTabValue] = useState(0);
  const [savedSearches, setSavedSearches] = useState<SavedSearchItem[]>([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem('searchHistory');
    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory);
        if (Array.isArray(parsedHistory)) {
          setSearchHistoryState(parsedHistory);
        }
      } catch (error) {
        // Removed console.error
      }
    }
  }, []);

  useEffect(() => {
    if (searchHistoryState.length > 0) {
      localStorage.setItem('searchHistory', JSON.stringify(searchHistoryState));
    }
  }, [searchHistoryState]);

  useEffect(() => {
    if (activeFilters.length === 0) return;

    const filtersObj: Record<string, string> = {};
    activeFilters.forEach((filter) => {
      filtersObj[filter.field] = filter.value as string;
    });

    if (
      searchHistoryState.length > 0 &&
      JSON.stringify(searchHistoryState[0].filters) ===
        JSON.stringify(filtersObj)
    ) {
      return;
    }

    const newSearch: SearchHistoryItem = {
      id: `search-${Date.now()}`,
      filters: filtersObj,
      timestamp: Date.now(),
    };

    setSearchHistoryState((prevHistory) =>
      [newSearch, ...prevHistory].slice(0, 10)
    );
  }, [activeFilters, searchHistoryState]);

  const formatTime = (timestamp: number): string => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);

    if (diffMins < 1) {
      return 'just now';
    } else if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffMins < 1440) {
      const hours = Math.floor(diffMins / 60);
      return `${hours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getSearchLabel = (filters: Record<string, string>): string => {
    const keys = Object.keys(filters);
    if (keys.length === 0) {
      return 'All Items';
    }

    const labels = [];
    if (filters.variables) {
      const vars = Array.isArray(filters.variables)
        ? filters.variables.join(', ')
        : String(filters.variables);
      labels.push(vars);
    }
    if (filters.spatial_coverage) {
      const coverage = Array.isArray(filters.spatial_coverage)
        ? filters.spatial_coverage.join(', ')
        : String(filters.spatial_coverage);
      labels.push(coverage);
    }
    if (labels.length > 0) {
      return labels.join(' • ');
    }

    const firstKey = keys[0];
    const value = filters[firstKey];
    const displayValue = Array.isArray(value)
      ? value.join(', ')
      : String(value);
    return `${firstKey.replace(/_/g, ' ')}: ${displayValue}`;
  };

  const handleApplySearch = (filters: Record<string, string>) => {
    if (dispatch) {
      dispatch({
        type: 'SET_FILTER',
        payload: {
          field: 'search',
          value: '',
          operator: FilterOperator.EQUALS,
        },
      });
    }
    Object.entries(filters).forEach(([field, value]) => {
      dispatch({
        type: 'SET_FILTER',
        payload: {
          field,
          value,
          operator: FilterOperator.EQUALS,
        },
      });
    });
  };

  const handleRemoveSearch = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchHistoryState((prevHistory) =>
      prevHistory.filter((item) => item.id !== id)
    );
  };

  const handleClearHistory = () => {
    setSearchHistoryState([]);
    localStorage.removeItem('searchHistory');
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSaveSearch = (item: SearchHistoryItem) => {
    const isAlreadySaved = savedSearches.some((saved) => saved.id === item.id);

    if (!isAlreadySaved) {
      const newSavedSearch: SavedSearchItem = {
        id: `saved-${Date.now()}`,
        name: getSearchLabel(item.filters),
        timestamp: new Date(item.timestamp).toISOString(),
        filters: item.filters,
      };
      setSavedSearches([newSavedSearch, ...savedSearches]);
    }
  };

  const handleDeleteHistory = (id: string) => {
    setSearchHistoryState(searchHistoryState.filter((item) => item.id !== id));
  };

  const handleDeleteSaved = (id: string) => {
    setSavedSearches(savedSearches.filter((item) => item.id !== id));
  };

  if (searchHistoryState.length === 0) {
    return (
      <Paper elevation={0} className={styles.paper}>
        <Box className={styles.tabsContainer}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <Tab
              icon={<HistoryIcon />}
              label="HISTORY"
              id="search-history-tab-0"
            />
            <Tab
              icon={<BookmarkIcon />}
              label="SAVED"
              id="search-history-tab-1"
            />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'center', p: 3 }}
          >
            No search history yet
          </Typography>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'center', p: 3 }}
          >
            No saved searches yet
          </Typography>
        </TabPanel>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} className={styles.paper}>
      <Box className={styles.tabsContainer}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
          <Tab
            icon={<HistoryIcon />}
            label="HISTORY"
            id="search-history-tab-0"
          />
          <Tab
            icon={<BookmarkIcon />}
            label="SAVED"
            id="search-history-tab-1"
          />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {searchHistoryState.map((item) => (
            <Chip
              key={item.id}
              label={`${getSearchLabel(item.filters)} (${formatTime(item.timestamp)})`}
              onClick={() => handleApplySearch(item.filters)}
              onDelete={(e) => handleRemoveSearch(item.id, e)}
              variant="outlined"
              size="small"
              sx={{ mb: 1 }}
            />
          ))}
        </Stack>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          <Tooltip title="Clear all history">
            <IconButton size="small" onClick={handleClearHistory}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <List>
          {searchHistoryState.map((item) => (
            <ListItemButton key={item.id}>
              <ListItemText
                primary={
                  <Typography component="div" variant="body2">
                    {getSearchLabel(item.filters)}
                  </Typography>
                }
                secondary={
                  <Typography
                    component="div"
                    variant="caption"
                    color="text.secondary"
                  >
                    {new Date(item.timestamp).toLocaleDateString()} •{' '}
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </Typography>
                }
              />
              <Box>
                <Tooltip title="Apply Search">
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => handleApplySearch(item.filters)}
                  >
                    <SearchIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Save Search">
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => handleSaveSearch(item)}
                  >
                    <BookmarkBorderIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete from History">
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => handleDeleteHistory(item.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </ListItemButton>
          ))}
        </List>
        <Typography component="div" variant="body1" sx={{ mt: 3 }}>
          Saved Searches
        </Typography>

        {savedSearches.length === 0 ? (
          <Typography
            component="div"
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, textAlign: 'center' }}
          >
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
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => handleDeleteSaved(item.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  }
                >
                  <ListItemButton
                    dense
                    onClick={() => handleApplySearch(item.filters)}
                    sx={{ pr: 8 }}
                  >
                    <ListItemIcon sx={{ minWidth: '36px' }}>
                      <BookmarkIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.name}
                      secondary={
                        <Box
                          sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 1,
                            mt: 0.5,
                          }}
                        >
                          {Object.entries(item.filters).map(([key, value]) => (
                            <Typography
                              key={key}
                              variant="caption"
                              color="text.secondary"
                              sx={{ mr: 1 }}
                            >
                              {key.split('_').join(' ')}:{' '}
                              <strong>
                                {Array.isArray(value)
                                  ? value.join(', ')
                                  : String(value)}
                              </strong>
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
