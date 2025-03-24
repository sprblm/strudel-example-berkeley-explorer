import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Chip, 
  Stack, 
  Typography, 
  IconButton,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import { useFilters } from '../../../components/FilterContext';

/**
 * Component that displays recent search history and allows users
 * to quickly reapply previous search filters
 */
export const SearchHistoryPanel: React.FC = () => {
  const { activeFilters, setFilters, clearFilters } = useFilters();
  const [searchHistory, setSearchHistory] = useState<Array<{id: string, filters: any, timestamp: number}>>([]);
  const [showHistory, setShowHistory] = useState(true);

  // Load search history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('searchHistory');
      if (savedHistory) {
        setSearchHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  }, []);

  // Save search history to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }, [searchHistory]);

  // Add current search to history when activeFilters change
  useEffect(() => {
    // Only save if there are active filters
    const hasActiveFilters = Object.keys(activeFilters).length > 0;
    if (hasActiveFilters) {
      // Generate unique ID for this search
      const id = `search_${Date.now()}`;
      
      // Add to history (avoid duplicates)
      const isDuplicate = searchHistory.some(
        item => JSON.stringify(item.filters) === JSON.stringify(activeFilters)
      );
      
      if (!isDuplicate) {
        setSearchHistory(prev => {
          // Keep only the last 10 searches
          const newHistory = [
            { id, filters: { ...activeFilters }, timestamp: Date.now() },
            ...prev
          ].slice(0, 10);
          
          return newHistory;
        });
      }
    }
  }, [activeFilters, searchHistory]);

  // Apply a saved search
  const handleApplySearch = (filters: any) => {
    setFilters(filters);
  };

  // Remove a search from history
  const handleRemoveSearch = (id: string, event: React.MouseEvent) => {
    // Stop propagation to prevent applying the search
    event.stopPropagation();
    
    setSearchHistory(prev => prev.filter(item => item.id !== id));
  };

  // Clear all search history
  const handleClearHistory = () => {
    setSearchHistory([]);
  };

  // Get a readable label for the search history item
  const getSearchLabel = (filters: any) => {
    const filterKeys = Object.keys(filters);
    if (filterKeys.length === 0) return 'Empty search';
    
    if (filterKeys.length === 1) {
      const key = filterKeys[0];
      return `${key}: ${filters[key]}`;
    }
    
    return `${filterKeys.length} filters applied`;
  };

  // Format timestamp to readable time
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  if (!showHistory || searchHistory.length === 0) {
    return null;
  }

  return (
    <Box>
      <Stack 
        direction="row" 
        spacing={1} 
        alignItems="center" 
        sx={{ mb: 1 }}
      >
        <HistoryIcon fontSize="small" color="action" />
        <Typography variant="subtitle2">Recent Searches</Typography>
        
        {searchHistory.length > 0 && (
          <Tooltip title="Clear all history">
            <IconButton 
              size="small" 
              onClick={handleClearHistory}
              sx={{ ml: 'auto' }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
      
      <Stack 
        direction="row" 
        spacing={1} 
        sx={{ flexWrap: 'wrap', gap: 1 }}
      >
        {searchHistory.map((item) => (
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
    </Box>
  );
};
