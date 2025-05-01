import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

const ContributeData: React.FC = () => {
  const [treeInventoryData, setTreeInventoryData] = useState('');
  const [airQualityData, setAirQualityData] = useState('');
  const [errors, setErrors] = useState({ treeInventory: '', airQuality: '' });

  const validateData = (data: string, type: 'treeInventory' | 'airQuality') => {
    if (!data.trim()) {
      setErrors(prev => ({ ...prev, [type]: 'This field is required' }));
      return false;
    }
    try {
      const parsedData = JSON.parse(data);
      if (type === 'treeInventory') {
        if (!parsedData.trees || !Array.isArray(parsedData.trees)) {
          setErrors(prev => ({ ...prev, [type]: 'Invalid tree inventory format' }));
          return false;
        }
        for (const tree of parsedData.trees) {
          if (!tree.species || typeof tree.species !== 'string' || !tree.count || typeof tree.count !== 'number') {
            setErrors(prev => ({ ...prev, [type]: 'Invalid tree inventory data' }));
            return false;
          }
        }
      }
      if (type === 'airQuality') {
        if (!parsedData.readings || !Array.isArray(parsedData.readings)) {
          setErrors(prev => ({ ...prev, [type]: 'Invalid air quality format' }));
          return false;
        }
        for (const reading of parsedData.readings) {
          if (!reading.pollutant || typeof reading.pollutant !== 'string' || !reading.value || typeof reading.value !== 'number') {
            setErrors(prev => ({ ...prev, [type]: 'Invalid air quality data' }));
            return false;
          }
        }
      }
      setErrors(prev => ({ ...prev, [type]: '' }));
      return true;
    } catch (e) {
      setErrors(prev => ({ ...prev, [type]: 'Invalid JSON format' }));
      return false;
    }
  };

  const handleTreeInventoryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTreeInventoryData(e.target.value);
    validateData(e.target.value, 'treeInventory');
  };

  const handleAirQualityChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAirQualityData(e.target.value);
    validateData(e.target.value, 'airQuality');
  };

  const handleSubmit = () => {
    const isTreeValid = validateData(treeInventoryData, 'treeInventory');
    const isAirQualityValid = validateData(airQualityData, 'airQuality');
    if (isTreeValid && isAirQualityValid) {
      if (window.confirm('Are you sure you want to submit the data?')) {
        // Submit the data
        console.log('Data submitted:', { treeInventoryData, airQualityData });
      }
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" component="h1" sx={{ fontWeight: 600, mb: 2, textAlign: 'center' }}>
        Contribute Environmental Data
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Please provide the following data in JSON format. Example for tree inventory: {'{ "trees": [{ "species": "Oak", "count": 10 }] }'}
      </Typography>
      <TextField
        label="Urban Tree Inventory Data (JSON)"
        multiline
        rows={6}
        value={treeInventoryData}
        onChange={handleTreeInventoryChange}
        error={!!errors.treeInventory}
        helperText={errors.treeInventory || 'Example: {"trees": [{"species": "Oak", "count": 10}]}'}
        sx={{ mb: 2, width: '100%', fontSize: { xs: '0.875rem', sm: '1rem' } }}
      />
      <Typography variant="body1" sx={{ mb: 2 }}>
        Please provide the following data in JSON format. Example for air quality: {'{ "readings": [{ "pollutant": "PM2.5", "value": 10 }] }'}
      </Typography>
      <TextField
        label="Air Quality Measurements (JSON)"
        multiline
        rows={6}
        value={airQualityData}
        onChange={handleAirQualityChange}
        error={!!errors.airQuality}
        helperText={errors.airQuality || 'Example: {"readings": [{"pollutant": "PM2.5", "value": 10}]}'}
        sx={{ mb: 2, width: '100%', fontSize: { xs: '0.875rem', sm: '1rem' } }}
      />
      <Button variant="contained" onClick={handleSubmit} sx={{ width: '100%', py: 1.5 }}>
        Submit Data
      </Button>
    </Box>
  );
};

export default ContributeData;

