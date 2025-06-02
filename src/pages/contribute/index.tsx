/**
 * Contribute Data Page
 * 
 * Enables users to submit environmental data including tree measurements and air quality readings.
 * Features a multi-step form with validation, file uploads, and location mapping.
 * Integrates with the platform's data collection system for community contributions.
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  MenuItem, 
  Select, 
  Container, 
  Grid, 
  Paper, 
  FormControl,
  InputLabel,
  FormHelperText,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  RadioGroup,
  Radio,
  FormControlLabel,
  Stack,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ButtonGroup,
  CircularProgress
} from '@mui/material';
import { 
  UploadIcon, 
  MapIcon, 
  TreeIcon, 
  AirQualityIcon, 
  InfoCircleIcon, 
  CheckCircleIcon, 
  LocationIcon 
} from '../../components/Icons';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SchoolIcon from '@mui/icons-material/School';
import ScienceIcon from '@mui/icons-material/Science';
import ParkIcon from '@mui/icons-material/Park';
import AirIcon from '@mui/icons-material/Air';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import type { AirQualityObservation } from '../../types/air-quality.interfaces';

/**
 * Contribute page component
 * Allows users to submit tree and air quality measurements
 */
const ContributeData: React.FC = () => {
  // State for form values
  const [dataType, setDataType] = useState<'tree' | 'air'>('tree');
  const [location, setLocation] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null);
  const [species, setSpecies] = useState('');
  const [height, setHeight] = useState<number>(0);
  const [dbh, setDbh] = useState<number>(0);
  const [healthCondition, setHealthCondition] = useState('good');
  const [notes, setNotes] = useState('');
  
  // Air quality specific state
  const [pm25, setPm25] = useState<string>('');
  const [pm10, setPm10] = useState<string>('');
  const [temperature, setTemperature] = useState<number>(20);
  const [humidity, setHumidity] = useState<number>(65);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  
  // Map refs
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<any>(null);
  const layersRef = useRef<any>(null);

  // State for real data
  const [treeData, setTreeData] = useState<any>(null);
  const [airQualityData, setAirQualityData] = useState<AirQualityObservation[]>([]);
  const [treeSpeciesList, setTreeSpeciesList] = useState<string[]>([]);

  // Load real environmental data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load tree data
        const treeResponse = await fetch('/data/processed/berkeley_trees_processed.json');
        if (!treeResponse.ok) throw new Error('Failed to fetch tree data');
        const treeData = await treeResponse.json();
        setTreeData(treeData);
        
        // Extract unique tree species for dropdown
        const species = new Set<string>();
        if (Array.isArray(treeData)) {
          treeData.forEach((tree: any) => {
            if (tree.species) {
              species.add(tree.species);
            }
          });
        }
        setTreeSpeciesList(Array.from(species).sort());
        
        // Load air quality data
        const airResponse = await fetch('/data/airnow/airnow_94720_400days.json');
        if (!airResponse.ok) throw new Error('Failed to fetch air quality data');
        const airData: AirQualityObservation[] = await airResponse.json();
        setAirQualityData(airData);
      } catch (error) {
        console.error('Error loading environmental data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Function to get AQI color based on value
  const getAqiColor = (aqi: number): string => {
    if (aqi <= 50) return '#00E400'; // Good
    if (aqi <= 100) return '#FFFF00'; // Moderate
    if (aqi <= 150) return '#FF7E00'; // Unhealthy for Sensitive Groups
    if (aqi <= 200) return '#FF0000'; // Unhealthy
    if (aqi <= 300) return '#99004C'; // Very Unhealthy
    return '#7E0023'; // Hazardous
  };

  // Function to get color based on tree condition
  const getTreeColor = (condition: string): string => {
    switch (condition?.toLowerCase()) {
      case 'good': return '#4CAF50';
      case 'fair': return '#FFC107';
      case 'poor': return '#FF9800';
      case 'dead': return '#795548';
      case 'critical': return '#F44336';
      default: return '#4CAF50';
    }
  };

  // Initialize map when component mounts and data is loaded
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current && !loading && treeData && airQualityData.length > 0) {
      // Initialize map centered on UC Berkeley
      const map = L.map(mapContainerRef.current).setView([37.8715, -122.2680], 15);
      
      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      // Create layer groups for existing data
      const treeLayer = L.layerGroup();
      const sensorLayer = L.layerGroup();
      
      // Add tree markers - limit to 100 for performance
      const treesToShow = treeData.features.slice(0, 100);
      treesToShow.forEach((tree: any) => {
        const lat = tree.geometry.coordinates[1];
        const lng = tree.geometry.coordinates[0];
        const species = tree.properties.SPECIES || 'Unknown Species';
        const condition = tree.properties.CONDITION || 'Unknown';
        const treeColor = getTreeColor(condition);
        
        const marker = L.marker([lat, lng], {
          icon: L.divIcon({
            html: `<div style="background-color: ${treeColor}; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white;">🌳</div>`,
            className: '',
            iconSize: [24, 24]
          })
        });
        
        marker.bindPopup(`
          <div style="max-width: 200px;">
            <h3>${species}</h3>
            <p>Condition: ${condition}</p>
            ${tree.properties.DBHMAX ? `<p>Diameter: ${tree.properties.DBHMAX} inches</p>` : ''}
            ${tree.properties.HEIGHT ? `<p>Height: ${tree.properties.HEIGHT} feet</p>` : ''}
          </div>
        `);
        
        marker.addTo(treeLayer);
      });
      
      // Add air quality sensor markers - use most recent readings
      const latestAirData = airQualityData
        .sort((a, b) => new Date(b.DateObserved).getTime() - new Date(a.DateObserved).getTime())
        .slice(0, 10);
      
      // Create air quality markers with slight position offsets for visualization
      latestAirData.forEach((reading, index) => {
        // Use Berkeley coordinates with slight offsets
        const lat = 37.8715 + (Math.random() * 0.01 - 0.005);
        const lng = -122.2680 + (Math.random() * 0.01 - 0.005);
        const markerColor = getAqiColor(reading.AQI);
        
        const customIcon = L.divIcon({
          html: `<div style="background-color: ${markerColor}; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white;">📊</div>`,
          className: '',
          iconSize: [24, 24]
        });
        
        const marker = L.marker([lat, lng], { icon: customIcon })
          .bindPopup(`
            <div style="max-width: 200px;">
              <h3>${reading.ParameterName} Sensor</h3>
              <p>AQI: ${reading.AQI} (${reading.Category.Name})</p>
              <p>Date: ${reading.DateObserved}</p>
              <p>Status: Official AirNow Reading</p>
            </div>
          `);
        
        marker.addTo(sensorLayer);
      });
      
      // Add click handler to map for location selection
      map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        
        // Remove existing marker if any
        if (markerRef.current) {
          markerRef.current.remove();
        }
        
        // Create new marker with appropriate icon based on data type
        const icon = L.divIcon({
          html: `<div style="background-color: ${dataType === 'tree' ? '#4CAF50' : '#2196F3'}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);">${dataType === 'tree' ? '🌳' : '📊'}</div>`,
          className: '',
          iconSize: [32, 32]
        });
        
        // Create and add the new marker
        const newMarker = L.marker([lat, lng], { icon }).addTo(map);
        newMarker.bindPopup(`
          <div>
            <h3>New ${dataType === 'tree' ? 'Tree' : 'Air Quality'} Measurement</h3>
            <p>Latitude: ${lat.toFixed(6)}</p>
            <p>Longitude: ${lng.toFixed(6)}</p>
          </div>
        `).openPopup();
        
        // Store marker reference and update location state
        markerRef.current = newMarker;
        setSelectedLocation({ lat, lng });
        setLocation(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      });
      
      // Store references
      mapRef.current = map;
      layersRef.current = {
        trees: treeLayer,
        airQuality: sensorLayer
      };
      
      // Initialize with both layers visible
      treeLayer.addTo(map);
      sensorLayer.addTo(map);
    }
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);
  
  // Update marker icon when data type changes
  useEffect(() => {
    if (markerRef.current && selectedLocation) {
      // Remove existing marker
      markerRef.current.remove();
      
      // Create new marker with updated icon
      const icon = L.divIcon({
        html: `<div style="background-color: ${dataType === 'tree' ? '#4CAF50' : '#2196F3'}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);">${dataType === 'tree' ? '🌳' : '📊'}</div>`,
        className: '',
        iconSize: [32, 32]
      });
      
      // Create and add the new marker
      const newMarker = L.marker([selectedLocation.lat, selectedLocation.lng], { icon }).addTo(mapRef.current);
      newMarker.bindPopup(`
        <div>
          <h3>New ${dataType === 'tree' ? 'Tree' : 'Air Quality'} Measurement</h3>
          <p>Latitude: ${selectedLocation.lat.toFixed(6)}</p>
          <p>Longitude: ${selectedLocation.lng.toFixed(6)}</p>
        </div>
      `);
      
      // Update marker reference
      markerRef.current = newMarker;
    }
  }, [dataType, selectedLocation]);

  // Handle form submission
  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate form fields
    if (!selectedLocation) newErrors.location = 'Please select a location on the map';
    
    if (dataType === 'tree') {
      if (!species) newErrors.species = 'Please enter tree species';
      if (height <= 0) newErrors.height = 'Please enter a valid height';
      if (dbh <= 0) newErrors.dbh = 'Please enter a valid diameter';
    } else if (dataType === 'air') {
      if (!pm25) newErrors.pm25 = 'Please enter PM2.5 reading';
      if (!pm10) newErrors.pm10 = 'Please enter PM10 reading';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      // Submit form data
      if (dataType === 'tree') {
        console.log('Tree data submitted:', { 
          dataType, 
          location: selectedLocation, 
          species, 
          height, 
          dbh, 
          healthCondition, 
          notes 
        });
      } else {
        console.log('Air quality data submitted:', {
          dataType,
          location: selectedLocation,
          pm25,
          pm10,
          temperature,
          humidity,
          notes
        });
      }
      
      // Reset form
      setSelectedLocation(null);
      setLocation('');
      setSpecies('');
      setHeight(0);
      setDbh(0);
      setHealthCondition('good');
      setPm25('');
      setPm10('');
      setTemperature(20);
      setHumidity(65);
      setNotes('');
      
      // Remove marker
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    }
  };

  return (
    <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Page Header */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'grey.200'
          }}
        >
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Contribute to Campus Environmental Data
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Help monitor and track Berkeley's environment by submitting tree measurements or air quality readings you collect during fieldwork.
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <Box sx={{ 
                  bgcolor: 'rgba(25, 118, 210, 0.1)', 
                  borderRadius: '50%', 
                  p: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <LocationIcon size={20} color="#1976d2" />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={500}>Accuracy Matters</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Use exact GPS measurements and report the average for more reliable data.
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <Box sx={{ 
                  bgcolor: 'rgba(25, 118, 210, 0.1)', 
                  borderRadius: '50%', 
                  p: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <MapIcon size={20} color="#1976d2" />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={500}>Location</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Use your device's GPS or select a point on the map for precise location.
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <Box sx={{ 
                  bgcolor: 'rgba(25, 118, 210, 0.1)', 
                  borderRadius: '50%', 
                  p: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <InfoCircleIcon size={20} color="#1976d2" />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={500}>Quality Assurance</Typography>
                  <Typography variant="body2" color="text.secondary">
                    All data is peer-reviewed by experts for enhanced data transparency.
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        <Grid container spacing={3}>
          {/* Left Column - Map and Form */}
          <Grid item xs={12} md={8}>
            {/* Interactive Map */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 0, 
                mb: 3, 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'grey.200',
                overflow: 'hidden',
                position: 'relative',
                height: 400
              }}
            >
              {/* Map container */}
              <Box 
                ref={mapContainerRef} 
                sx={{ 
                  height: '100%', 
                  width: '100%',
                  position: 'relative',
                }}
              />
              
              {/* Map overlay with instructions */}
              <Box sx={{ 
                position: 'absolute', 
                top: 16, 
                right: 16, 
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                p: 1.5,
                borderRadius: 1,
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                maxWidth: 250
              }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  {selectedLocation ? 'Location Selected' : 'Select Location'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedLocation 
                    ? `Lat: ${selectedLocation.lat.toFixed(6)}, Lng: ${selectedLocation.lng.toFixed(6)}` 
                    : 'Click on the map to select the exact location of your measurement'}
                </Typography>
              </Box>
            </Paper>
            
            {/* Data Entry Form */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'grey.200'
              }}
            >
              {/* Data Type Selection */}
              <Box sx={{ mb: 3 }}>
                <ButtonGroup variant="outlined" fullWidth>
                  <Button 
                    startIcon={<TreeIcon size={16} />}
                    onClick={() => setDataType('tree')}
                    variant={dataType === 'tree' ? 'contained' : 'outlined'}
                    sx={{ 
                      py: 1,
                      bgcolor: dataType === 'tree' ? '#4caf50' : 'transparent',
                      color: dataType === 'tree' ? 'white' : 'text.primary',
                      '&:hover': {
                        bgcolor: dataType === 'tree' ? '#388e3c' : 'rgba(0, 0, 0, 0.04)'
                      }
                    }}
                  >
                    Tree Data
                  </Button>
                  <Button 
                    startIcon={<AirQualityIcon size={16} />}
                    onClick={() => setDataType('air')}
                    variant={dataType === 'air' ? 'contained' : 'outlined'}
                    sx={{ 
                      py: 1,
                      bgcolor: dataType === 'air' ? '#2196f3' : 'transparent',
                      color: dataType === 'air' ? 'white' : 'text.primary',
                      '&:hover': {
                        bgcolor: dataType === 'air' ? '#1976d2' : 'rgba(0, 0, 0, 0.04)'
                      }
                    }}
                  >
                    Air Quality Data
                  </Button>
                </ButtonGroup>
              </Box>
              
              {/* Tree Species */}
              {dataType === 'tree' && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                    Tree Species
                  </Typography>
                  <FormControl fullWidth error={!!errors.species} size="small">
                    <Select
                      value={species}
                      onChange={(e) => setSpecies(e.target.value)}
                      displayEmpty
                      renderValue={(selected) => selected ? selected : 'Select a tree species'}
                    >
                      {loading ? (
                        <MenuItem disabled>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CircularProgress size={20} sx={{ mr: 1 }} />
                            <Typography>Loading species...</Typography>
                          </Box>
                        </MenuItem>
                      ) : (
                        <>
                          {treeSpeciesList.map((speciesName) => (
                            <MenuItem key={speciesName} value={speciesName}>{speciesName}</MenuItem>
                          ))}
                          <MenuItem value="Other">Other (specify in notes)</MenuItem>
                        </>
                      )}
                    </Select>
                    <FormHelperText>{errors.species || "Select from Berkeley's tree inventory"}</FormHelperText>
                  </FormControl>
                </Box>
              )}
              
              {/* Air Quality - PM2.5 */}
              {dataType === 'air' && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                    PM2.5 (μg/m³)
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="8"
                    value={pm25}
                    onChange={(e) => setPm25(e.target.value)}
                    error={!!errors.pm25}
                    helperText={errors.pm25 || "Fine particulate matter reading"}
                    size="small"
                    type="number"
                    inputProps={{ min: 0 }}
                  />
                </Box>
              )}
              
              {/* Air Quality - PM10 */}
              {dataType === 'air' && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                    PM10 (μg/m³)
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="15"
                    value={pm10}
                    onChange={(e) => setPm10(e.target.value)}
                    error={!!errors.pm10}
                    helperText={errors.pm10 || "Coarse particulate matter reading"}
                    size="small"
                    type="number"
                    inputProps={{ min: 0 }}
                  />
                </Box>
              )}
              
              {/* Air Quality - Temperature */}
              {dataType === 'air' && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                    Temperature (°C): {temperature}
                  </Typography>
                  <Slider
                    value={temperature}
                    onChange={(_, newValue) => setTemperature(newValue as number)}
                    min={-20}
                    max={50}
                    step={1}
                    sx={{ color: '#2196f3' }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Current ambient temperature
                  </Typography>
                </Box>
              )}
              
              {/* Air Quality - Humidity */}
              {dataType === 'air' && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                    Relative Humidity (%): {humidity}
                  </Typography>
                  <Slider
                    value={humidity}
                    onChange={(_, newValue) => setHumidity(newValue as number)}
                    min={0}
                    max={100}
                    step={1}
                    sx={{ color: '#2196f3' }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Current relative humidity
                  </Typography>
                </Box>
              )}
              
              {/* Tree Height */}
              {dataType === 'tree' && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                    Tree Height (feet)
                  </Typography>
                  <Box sx={{ px: 1 }}>
                    <Slider
                      value={height}
                      onChange={(_, newValue) => setHeight(newValue as number)}
                      min={0}
                      max={150}
                      step={1}
                      marks={[
                        { value: 0, label: '0 ft' },
                        { value: 50, label: '50 ft' },
                        { value: 100, label: '100 ft' },
                        { value: 150, label: '150 ft' },
                      ]}
                      valueLabelDisplay="auto"
                      sx={{ 
                        color: '#4caf50',
                        '& .MuiSlider-thumb': {
                          height: 24,
                          width: 24,
                        }
                      }}
                    />
                  </Box>
                  {errors.height && (
                    <FormHelperText error>{errors.height}</FormHelperText>
                  )}
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Estimate or actual height in feet (0-150 ft above ground)
                  </Typography>
                </Box>
              )}
              
              {/* Tree DBH */}
              {dataType === 'tree' && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                    DBH (inches)
                  </Typography>
                  <Box sx={{ px: 1 }}>
                    <Slider
                      value={dbh}
                      onChange={(_, newValue) => setDbh(newValue as number)}
                      min={0}
                      max={60}
                      step={1}
                      marks={[
                        { value: 0, label: '0"' },
                        { value: 20, label: '20"' },
                        { value: 40, label: '40"' },
                        { value: 60, label: '60"' },
                      ]}
                      valueLabelDisplay="auto"
                      sx={{ color: '#4caf50' }}
                    />
                  </Box>
                  {errors.dbh && (
                    <FormHelperText error>{errors.dbh}</FormHelperText>
                  )}
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Diameter at breast height (4.5 ft above ground)
                  </Typography>
                </Box>
              )}
              
              {/* Tree Health */}
              {dataType === 'tree' && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                    Health
                  </Typography>
                  <RadioGroup
                    value={healthCondition}
                    onChange={(e) => setHealthCondition(e.target.value)}
                    row
                  >
                    <FormControlLabel 
                      value="good" 
                      control={<Radio sx={{ color: '#4caf50', '&.Mui-checked': { color: '#4caf50' } }} />} 
                      label="Good" 
                    />
                    <FormControlLabel 
                      value="fair" 
                      control={<Radio sx={{ color: '#ff9800', '&.Mui-checked': { color: '#ff9800' } }} />} 
                      label="Fair" 
                    />
                    <FormControlLabel 
                      value="poor" 
                      control={<Radio sx={{ color: '#f44336', '&.Mui-checked': { color: '#f44336' } }} />} 
                      label="Poor" 
                    />
                  </RadioGroup>
                </Box>
              )}
              
              {/* Additional Notes */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                  Additional Notes
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder={dataType === 'air' ? "Weather conditions, nearby activities..." : "Any relevant observations..."}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {dataType === 'air' 
                    ? "Optional: add context that might affect air quality" 
                    : "Optional: add any noteworthy details about the tree"}
                </Typography>
              </Box>
              
              {/* Submit Button */}
              <Button 
                variant="contained" 
                fullWidth 
                size="large"
                onClick={handleSubmit}
                sx={{ 
                  mt: 2, 
                  bgcolor: dataType === 'tree' ? '#4caf50' : '#2196f3',
                  '&:hover': {
                    bgcolor: dataType === 'tree' ? '#388e3c' : '#1976d2'
                  }
                }}
              >
                {dataType === 'tree' ? 'Submit Tree Data' : 'Submit Air Quality Data'}
              </Button>
            </Paper>
          </Grid>
          
          {/* Right Column - Information Cards */}
          <Grid item xs={12} md={4}>
            {/* Why Contribute Card */}
            <Card 
              elevation={0} 
              sx={{ 
                mb: 3, 
                border: '1px solid',
                borderColor: 'grey.200',
                borderRadius: 2
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <InfoCircleIcon size={20} color="#1976d2" />
                  <Typography variant="h6" fontWeight={600} sx={{ ml: 1 }}>
                    Why Contribute?
                  </Typography>
                </Box>
                
                <List disablePadding>
                  <ListItem disableGutters sx={{ pb: 1 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <SchoolIcon fontSize="small" sx={{ color: '#4caf50' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Citizen Science" 
                      secondary="Your contributions help create a comprehensive dataset for urban ecology studies"
                    />
                  </ListItem>
                  
                  <ListItem disableGutters sx={{ pb: 1 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <ScienceIcon fontSize="small" sx={{ color: '#4caf50' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Educational Value" 
                      secondary="Collect and analyze real environmental data as part of your coursework, gaining practical field experience"
                    />
                  </ListItem>
                  
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <ParkIcon fontSize="small" sx={{ color: '#4caf50' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Campus" 
                      secondary="Contribution data helps inform campus planning for tree planting, air quality improvements, and other environmental initiatives"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
            
            {/* Tree Measurement Guide Card */}
            <Card 
              elevation={0} 
              sx={{ 
                mb: 3, 
                border: '1px solid',
                borderColor: 'grey.200',
                borderRadius: 2
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TreeIcon size={20} color="#4caf50" />
                  <Typography variant="h6" fontWeight={600} sx={{ ml: 1 }}>
                    Tree Measurement Guide
                  </Typography>
                </Box>
                
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Measuring Height
                </Typography>
                <Typography variant="body2" paragraph>
                  Use the "stick method" - hold a stick at arm's length, align the top with the tree top and bottom with the base. The distance from you to the tree equals the tree height.
                </Typography>
                
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Measuring DBH
                </Typography>
                <Typography variant="body2" paragraph>
                  Measure the diameter at breast height (DBH) at 4.5 feet (1.37m) above ground using a measuring tape around the trunk. Divide by π (3.14) to get diameter.
                </Typography>
                
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Assessing Health
                </Typography>
                <Typography variant="body2" component="div">
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    <li>Excellent: Full canopy, no dead branches</li>
                    <li>Good: Minor issues, 80%+ healthy canopy</li>
                    <li>Fair: Moderate problems, 50-80% healthy</li>
                    <li>Poor: Major problems, less than 50% healthy canopy</li>
                  </Box>
                </Typography>
              </CardContent>
            </Card>
            
            {/* Air Quality Tips Card */}
            <Card 
              elevation={0} 
              sx={{ 
                border: '1px solid',
                borderColor: 'grey.200',
                borderRadius: 2
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AirIcon fontSize="small" sx={{ color: '#2196f3' }} />
                  <Typography variant="h6" fontWeight={600} sx={{ ml: 1 }}>
                    Air Quality Tips
                  </Typography>
                </Box>
                
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Measurement Timing
                </Typography>
                <Typography variant="body2" paragraph>
                  Take readings at different times of day for more comprehensive data. Morning, midday, and late afternoon readings are particularly valuable.
                </Typography>
                
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Sensor Placement
                </Typography>
                <Typography variant="body2" paragraph>
                  Place sensors at breathing height (about 5 feet) away from direct pollution sources and clear of obstructions.
                </Typography>
                
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Quality Readings
                </Typography>
                <Typography variant="body2">
                  For consumer-grade sensors, take multiple readings over 5-10 minutes and report the average for more reliable data.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ContributeData;
