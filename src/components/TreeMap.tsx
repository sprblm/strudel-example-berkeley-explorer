import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, FormControl, InputLabel, Select, MenuItem, Slider, FormGroup, FormControlLabel, Checkbox, CircularProgress } from '@mui/material';
import type { TreeObservation } from '../types/data.interfaces';
import 'leaflet/dist/leaflet.css';


// Colors for different health conditions
const HEALTH_COLORS = {
  'Excellent': '#2e7d32', // dark green
  'Good': '#4caf50',      // green
  'Fair': '#ff9800',      // orange
  'Poor': '#f44336',      // red
  'Unknown': '#9e9e9e'    // gray
};


interface TreeMapProps {
  trees?: TreeObservation[];
  loading?: boolean;
  height?: string | number;
  width?: string | number;
}

const TreeMap: React.FC<TreeMapProps> = ({ 
  trees = [], 
  loading = false,
  height = 600,
  width = '100%'
}) => {
  const [filteredTrees, setFilteredTrees] = useState<TreeObservation[]>([]);
  const [colorBy, setColorBy] = useState<'health' | 'species'>('health');
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);
  const [healthFilter, setHealthFilter] = useState<string[]>(['Excellent', 'Good', 'Fair', 'Poor', 'Unknown']);
  const [dbhRange, setDbhRange] = useState<[number, number]>([0, 100]);
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  
  // Get unique species for filter dropdown
  const uniqueSpecies = React.useMemo(() => {
    const species = new Set<string>();
    trees.forEach(tree => species.add(tree.species));
    return Array.from(species).sort();
  }, [trees]);

  // Get min/max DBH for slider
  const dbhBounds = React.useMemo(() => {
    if (trees.length === 0) return [0, 100];
    let min = Infinity;
    let max = -Infinity;
    trees.forEach(tree => {
      if (tree.dbh < min) min = tree.dbh;
      if (tree.dbh > max) max = tree.dbh;
    });
    return [Math.floor(min), Math.ceil(max)];
  }, [trees]);

  // Apply filters
  useEffect(() => {
    if (trees.length === 0) {
      setFilteredTrees([]);
      return;
    }

    const filtered = trees.filter(tree => {
      // Filter by species if any selected
      if (selectedSpecies.length > 0 && !selectedSpecies.includes(tree.species)) {
        return false;
      }
      
      // Filter by health condition
      if (!healthFilter.includes(tree.healthCondition)) {
        return false;
      }
      
      // Filter by DBH range
      if (tree.dbh < dbhRange[0] || tree.dbh > dbhRange[1]) {
        return false;
      }
      
      return true;
    });
    
    // Limit to 5000 trees for performance
    setFilteredTrees(filtered.slice(0, 5000));
  }, [trees, selectedSpecies, healthFilter, dbhRange]);

  // Initialize map when component mounts
  useEffect(() => {
    // We'll use a simple placeholder for now since the Leaflet integration is causing issues
    // In a real implementation, we would initialize the Leaflet map here
    setMapReady(true);
  }, []);


  if (loading) {
    return <Box>Loading tree data...</Box>;
  }

  return (
    <Box sx={{ width, height: 'auto' }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Berkeley Tree Inventory ({filteredTrees.length.toLocaleString()} trees shown)
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Color By</InputLabel>
            <Select
              value={colorBy}
              onChange={(e) => setColorBy(e.target.value as 'health' | 'species')}
              label="Color By"
            >
              <MenuItem value="health">Health Condition</MenuItem>
              <MenuItem value="species">Species</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Species</InputLabel>
            <Select
              multiple
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
              label="Filter by Species"
              renderValue={(selected) => `${selected.length} selected`}
            >
              {uniqueSpecies.map(species => (
                <MenuItem key={species} value={species}>
                  <Checkbox checked={selectedSpecies.indexOf(species) > -1} />
                  {species}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Box sx={{ minWidth: 200 }}>
            <Typography gutterBottom>Tree Diameter (DBH)</Typography>
            <Slider
              value={dbhRange}
              onChange={(_, newValue) => setDbhRange(newValue as [number, number])}
              valueLabelDisplay="auto"
              min={dbhBounds[0]}
              max={dbhBounds[1]}
            />
          </Box>
        </Box>
        
        <FormGroup row>
          <Typography sx={{ mr: 2 }}>Health Condition:</Typography>
          {Object.keys(HEALTH_COLORS).map(condition => (
            <FormControlLabel
              key={condition}
              control={
                <Checkbox
                  checked={healthFilter.includes(condition)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setHealthFilter([...healthFilter, condition]);
                    } else {
                      setHealthFilter(healthFilter.filter(h => h !== condition));
                    }
                  }}
                  sx={{
                    color: HEALTH_COLORS[condition as keyof typeof HEALTH_COLORS],
                    '&.Mui-checked': {
                      color: HEALTH_COLORS[condition as keyof typeof HEALTH_COLORS],
                    },
                  }}
                />
              }
              label={condition}
            />
          ))}
        </FormGroup>
      </Paper>
      
      <Box sx={{ height, width, position: 'relative', bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }} ref={mapRef}>
        {!mapReady ? (
          <CircularProgress />
        ) : (
          <Typography variant="h6" color="text.secondary" align="center">
            Map integration is currently being fixed. <br />
            {filteredTrees.length} trees are ready to be displayed.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default TreeMap;
