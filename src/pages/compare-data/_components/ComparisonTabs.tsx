import React, { useState } from 'react';
import { Box, Button, ButtonGroup } from '@mui/material';
import { OverviewIcon, TreeIcon, AirQualityIcon } from '../../../components/Icons';

export type TabType = 'overview' | 'trees' | 'airQuality';

interface ComparisonTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

/**
 * Button group component for toggling between different comparison views
 */
const ComparisonTabs: React.FC<ComparisonTabsProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <ButtonGroup variant="outlined" size="small" aria-label="comparison view options">
        <Button 
          startIcon={<OverviewIcon size={16} />}
          onClick={() => onTabChange('overview')}
          variant={activeTab === 'overview' ? 'contained' : 'outlined'}
          sx={{ 
            textTransform: 'none',
            bgcolor: activeTab === 'overview' ? 'primary.main' : 'transparent',
            color: activeTab === 'overview' ? 'white' : 'text.primary',
            '&:hover': {
              bgcolor: activeTab === 'overview' ? 'primary.dark' : 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          Overview
        </Button>
        <Button 
          startIcon={<TreeIcon size={16} />}
          onClick={() => onTabChange('trees')}
          variant={activeTab === 'trees' ? 'contained' : 'outlined'}
          sx={{ 
            textTransform: 'none',
            bgcolor: activeTab === 'trees' ? 'primary.main' : 'transparent',
            color: activeTab === 'trees' ? 'white' : 'text.primary',
            '&:hover': {
              bgcolor: activeTab === 'trees' ? 'primary.dark' : 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          Trees
        </Button>
        <Button 
          startIcon={<AirQualityIcon size={16} />}
          onClick={() => onTabChange('airQuality')}
          variant={activeTab === 'airQuality' ? 'contained' : 'outlined'}
          sx={{ 
            textTransform: 'none',
            bgcolor: activeTab === 'airQuality' ? 'primary.main' : 'transparent',
            color: activeTab === 'airQuality' ? 'white' : 'text.primary',
            '&:hover': {
              bgcolor: activeTab === 'airQuality' ? 'primary.dark' : 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          Air Quality
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default ComparisonTabs;