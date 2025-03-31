import { useState, useRef, useEffect } from 'react';
import { InputBase, Box, Popper, Paper, List, ListItem, ClickAwayListener } from '@mui/material';
import { SearchIcon } from '../../../components/Icons';

interface SearchInputProps {
  onSearch: (searchText: string) => void;
  onInputChange: () => void;
  suggestions: string[];
}

export default function SearchInput({
  onSearch,
  onInputChange,
  suggestions,
}: SearchInputProps) {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  
  // Close suggestions when user clicks outside
  const handleClickAway = () => {
    setOpen(false);
  };

  // Filter suggestions based on input value
  const filteredSuggestions = suggestions.filter(suggestion => 
    suggestion.toLowerCase().includes(value.toLowerCase())
  );

  // Handle suggestion selection
  const handleSelect = (searchText: string) => {
    setValue(searchText);
    onSearch(searchText);
    setOpen(false);
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    setOpen(newValue.length > 0);
    onInputChange();
  };

  // Handle key press, particularly Enter to search
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch(value);
      setOpen(false);
    }
  };

  // Show suggestions when input is focused
  const handleFocus = () => {
    if (value && suggestions.length > 0) {
      setOpen(true);
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box 
        ref={anchorRef}
        sx={{ 
          position: 'relative',
          width: '100%'
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <SearchIcon 
            size={18} 
            style={{ 
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6B7280'
            }}
          />
          <InputBase
            value={value}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onFocus={handleFocus}
            placeholder="Search datasets..."
            fullWidth
            sx={{ 
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
            aria-label="Search input"
          />
        </Box>

        {/* Suggestions dropdown */}
        <Popper 
          open={open && filteredSuggestions.length > 0}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          style={{ 
            width: anchorRef.current?.clientWidth,
            zIndex: 1200
          }}
        >
          <Paper elevation={2} sx={{ mt: 0.5, maxHeight: 300, overflow: 'auto' }}>
            <List sx={{ py: 0.5 }}>
              {filteredSuggestions.map((suggestion, index) => (
                <ListItem 
                  key={index}
                  onClick={() => handleSelect(suggestion)}
                  sx={{ 
                    py: 0.75,
                    px: 2,
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    '&:hover': {
                      backgroundColor: 'rgba(59, 130, 246, 0.08)',
                    }
                  }}
                >
                  {suggestion}
                </ListItem>
              ))}
            </List>
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}
