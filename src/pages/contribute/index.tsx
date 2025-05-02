import React, { useState } from 'react';
import { Box, Typography, TextField, Button, MenuItem, Select } from '@mui/material';

const ContributeData: React.FC = () => {
  const [location, setLocation] = useState('');
  const [species, setSpecies] = useState('');
  const [dbh, setDbh] = useState('');
  const [healthCondition, setHealthCondition] = useState('');
  const [observationDate, setObservationDate] = useState('');
  const [photos, setPhotos] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  const validateData = () => {
    const newErrors = {};
    if (!location) newErrors.location = 'Location is required';
    if (!species) newErrors.species = 'Species is required';
    if (!dbh) newErrors.dbh = 'DBH is required';
    if (!healthCondition) newErrors.healthCondition = 'Health Condition is required';
    if (!observationDate) newErrors.observationDate = 'Observation Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateData()) {
      // Submit the data
      console.log('Data submitted:', { location, species, dbh, healthCondition, observationDate, photos, notes });
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" component="h1" sx={{ fontWeight: 600, mb: 2, textAlign: 'center' }}>
        Contribute Tree Observation
      </Typography>
      <TextField
        label="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        error={!!errors.location}
        helperText={errors.location}
        sx={{ mb: 2, width: '100%' }}
      />
      <TextField
        label="Species"
        value={species}
        onChange={(e) => setSpecies(e.target.value)}
        error={!!errors.species}
        helperText={errors.species}
        sx={{ mb: 2, width: '100%' }}
      />
      <TextField
        label="DBH (cm)"
        value={dbh}
        onChange={(e) => setDbh(e.target.value)}
        error={!!errors.dbh}
        helperText={errors.dbh}
        sx={{ mb: 2, width: '100%' }}
      />
      <Select
        label="Health Condition"
        value={healthCondition}
        onChange={(e) => setHealthCondition(e.target.value)}
        error={!!errors.healthCondition}
        sx={{ mb: 2, width: '100%' }}
      >
        <MenuItem value="Good">Good</MenuItem>
        <MenuItem value="Fair">Fair</MenuItem>
        <MenuItem value="Poor">Poor</MenuItem>
      </Select>
      <TextField
        label="Observation Date"
        type="date"
        value={observationDate}
        onChange={(e) => setObservationDate(e.target.value)}
        error={!!errors.observationDate}
        helperText={errors.observationDate}
        sx={{ mb: 2, width: '100%' }}
      />
      <TextField
        label="Photos (URL)"
        value={photos}
        onChange={(e) => setPhotos(e.target.value)}
        sx={{ mb: 2, width: '100%' }}
      />
      <TextField
        label="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        sx={{ mb: 2, width: '100%' }}
      />
      <Button variant="contained" onClick={handleSubmit} sx={{ width: '100%', py: 1.5 }}>
        Submit Data
      </Button>
    </Box>
  );
};

export default ContributeData;
