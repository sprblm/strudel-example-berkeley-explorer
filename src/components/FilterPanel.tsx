import React, { ReactNode, useState } from 'react';
import {
  Box,
  Typography,
  Collapse,
  Paper,
  Divider,
  Badge,
  Stack,
} from '@mui/material';
import { useFilters } from './FilterContext';
import {
  FilterIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  RefreshIcon,
} from './Icons';
import { Button, IconButton } from './Button';

interface FilterSectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultExpanded?: boolean;
  filterCount?: number;
}

/**
 * Individual filter section with collapsible content
 */
export const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  icon,
  children,
  defaultExpanded = true,
  filterCount = 0,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <Box sx={{ mb: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          py: 1,
          px: 0.5,
          borderRadius: 1,
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
          },
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {icon}
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              ml: icon ? 1 : 0,
              color: 'grey.800',
            }}
          >
            {title}
          </Typography>
          {filterCount > 0 && (
            <Badge
              badgeContent={filterCount}
              color="primary"
              sx={{ ml: 1 }}
              size="small"
            />
          )}
        </Box>
        <Box>
          {expanded ? (
            <ChevronUpIcon size={18} />
          ) : (
            <ChevronDownIcon size={18} />
          )}
        </Box>
      </Box>
      <Collapse in={expanded} timeout="auto">
        <Box sx={{ pt: 1, pl: 0.5 }}>{children}</Box>
      </Collapse>
      <Divider sx={{ mt: 2 }} />
    </Box>
  );
};

/**
 * Modern filter panel with sections, clear buttons and filter indicators
 */
export const FilterPanel: React.FC<{
  title?: string;
  children: ReactNode;
  onClearAll?: () => void;
}> = ({ title = 'Filters', children, onClearAll }) => {
  const { activeFilters, clearFilters } = useFilters();
  const filterCount = activeFilters.length;

  const handleClearAll = () => {
    if (onClearAll) {
      onClearAll();
    } else {
      clearFilters();
    }
  };

  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{
        p: 2,
        borderColor: 'grey.200',
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FilterIcon size={18} />
          <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>
            {title}
          </Typography>
          {filterCount > 0 && (
            <Badge
              badgeContent={filterCount}
              color="primary"
              sx={{ ml: 1 }}
              size="small"
            />
          )}
        </Box>
        {filterCount > 0 && (
          <Button
            size="small"
            color="inherit"
            startIcon={<RefreshIcon size={14} />}
            onClick={handleClearAll}
            sx={{ fontSize: '0.75rem' }}
          >
            Clear All
          </Button>
        )}
      </Box>
      <Stack spacing={1}>{children}</Stack>
    </Paper>
  );
};
