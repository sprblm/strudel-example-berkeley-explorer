import { Box, Typography, Paper, Grid } from '@mui/material';
import React, { useState } from 'react';
import { MapIcon, LocationIcon } from '../../components/Icons';
import ComparisonSettings, { ComparisonType, DataSource, Location } from './_components/ComparisonSettings';
import ComparisonTabs, { TabType } from './_components/ComparisonTabs';
import OverviewContent from './_components/OverviewContent';
import TreesContent from './_components/TreesContent';
import AirQualityContent from './_components/AirQualityContent';

/**
 * Compare Datasets page
 * Shows side-by-side comparison of climate datasets with interactive charts
 */
const CompareDatasets: React.FC = () => {
  // State for comparison settings
  const [comparisonType, setComparisonType] = useState<ComparisonType>('locations');
  const [dataSourceA, setDataSourceA] = useState<DataSource>('Official Sensors');
  const [dataSourceB, setDataSourceB] = useState<DataSource>('Student Contributions');
  const [locationA, setLocationA] = useState<Location>('Memorial Glade');
  const [locationB, setLocationB] = useState<Location>('Hearst Greek Theatre');
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Handle comparison settings changes
  const handleComparisonTypeChange = (type: ComparisonType) => {
    setComparisonType(type);
  };

  const handleDataSourceAChange = (source: DataSource) => {
    setDataSourceA(source);
  };

  const handleDataSourceBChange = (source: DataSource) => {
    setDataSourceB(source);
  };

  const handleLocationAChange = (location: Location) => {
    setLocationA(location);
  };

  const handleLocationBChange = (location: Location) => {
    setLocationB(location);
  };
  
  // Handle tab change
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  // Location card component
  const LocationCard = ({ location, description }: { location: Location, description: string }) => (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2, 
        borderRadius: 2, 
        border: '1px solid',
        borderColor: 'grey.200',
        height: '100%'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <LocationIcon size={16} color="#3B82F6" />
        <Typography variant="subtitle1" fontWeight={500} sx={{ ml: 1 }}>
          {location}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
      
      {/* Map placeholder */}
      <Box 
        sx={{ 
          mt: 2,
          height: 150,
          bgcolor: '#f5f8fa',
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <MapIcon size={24} color="#3B82F6" />
        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
          UC Berkeley Campus Map
        </Typography>
      </Box>
    </Paper>
  );

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewContent locationA={locationA} locationB={locationB} />;
      case 'trees':
        return <TreesContent locationA={locationA} locationB={locationB} />;
      case 'airQuality':
        return <AirQualityContent locationA={locationA} locationB={locationB} />;
      default:
        return <OverviewContent locationA={locationA} locationB={locationB} />;
    }
  };

  // --- Render Component ---
  return (
    <Box sx={{ p: 3, bgcolor: '#fafafa' }}>
      {/* Comparison Settings */}
      <ComparisonSettings 
        onComparisonTypeChange={handleComparisonTypeChange}
        onDataSourceAChange={handleDataSourceAChange}
        onDataSourceBChange={handleDataSourceBChange}
        onLocationAChange={handleLocationAChange}
        onLocationBChange={handleLocationBChange}
      />
      
      {/* Location Cards - always shown regardless of comparison type */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <LocationCard 
            location={locationA} 
            description="Open grassy space at the center of campus"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LocationCard 
            location={locationB} 
            description="Historic outdoor amphitheatre"
          />
        </Grid>
      </Grid>
      
      {/* Comparison Tabs */}
      <ComparisonTabs activeTab={activeTab} onTabChange={handleTabChange} />
      
      {/* Tab Content */}
      {renderTabContent()}
    </Box>
  );
};

export default CompareDatasets;
