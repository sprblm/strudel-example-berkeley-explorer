import React from 'react';
import { Box, Typography, Link, List, ListItem } from '@mui/material';

const UrbanEnvironmentalHealth: React.FC = () => {
  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 2, textAlign: 'center' }}>
        Urban Environmental Health
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Urban environmental health focuses on the impact of environmental factors on human health in urban areas. Key aspects include:
      </Typography>
      <List sx={{ mb: 2 }}>
        <ListItem>1. Air Quality: Urban areas often suffer from poor air quality due to pollution from vehicles, industrial activities, and other sources.</ListItem>
        <ListItem>2. Green Spaces: Urban trees and green spaces play a crucial role in improving air quality, mitigating the urban heat island effect, and providing recreational areas for residents.</ListItem>
        <ListItem>3. Water Quality: Urban water management is critical to prevent flooding and ensure clean water for residents.</ListItem>
      </List>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Importance of Urban Trees
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Urban trees are vital for improving air quality by absorbing pollutants and producing oxygen. They also help in reducing the urban heat island effect by providing shade and cooling the air through evapotranspiration.
      </Typography>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Air Quality Measurements
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Monitoring air quality is essential to understand the levels of pollutants in urban areas. This data can be used to implement policies to reduce pollution and improve public health.
      </Typography>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Educational Resources
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        For more information on urban environmental health, you can refer to the following resources:
      </Typography>
      <List>
        <ListItem>
          <Link href="https://www.epa.gov/" target="_blank" rel="noopener noreferrer">
            EPA Urban Environmental Health
          </Link>
        </ListItem>
        <ListItem>
          <Link href="https://www.who.int/" target="_blank" rel="noopener noreferrer">
            WHO Urban Health
          </Link>
        </ListItem>
      </List>
    </Box>
  );
};

export default UrbanEnvironmentalHealth;