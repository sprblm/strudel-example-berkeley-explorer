import React, { useState } from 'react';
import { Box, Divider, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Filters } from '../../../components/Filters';
import { taskflow } from '../_config/taskflow.config';
import { FilterField } from '../../../components/FilterField';
import { MapSelector } from './MapSelector';

interface FiltersPanelProps {
  onClose: () => any;
}

/**
 * Main filters panel in the search-data-repositories Task Flow.
 * Filters are generated based on the configurations in `taskflow.pages.index.cardFilters`.
 * The input values will filter data in the `<DataListPanel>`.
 */
export const FiltersPanel: React.FC<FiltersPanelProps> = (props) => {
  const [expandedMap, setExpandedMap] = useState(false);
  
  const toggleMapExpand = () => {
    setExpandedMap(!expandedMap);
  };
  
  // Group filters by category for better organization
  const filterCategories = {
    source: taskflow.pages.index.cardFilters.filter(f => f.field === 'source'),
    variables: taskflow.pages.index.cardFilters.filter(f => f.field === 'variables'),
    temporal: taskflow.pages.index.cardFilters.filter(f => 
      f.field === 'temporal_coverage' || 
      f.field === 'temporal_resolution' || 
      f.field === 'publication_date'
    ),
    spatial: taskflow.pages.index.cardFilters.filter(f => 
      f.field === 'spatial_resolution' ||
      f.field === 'spatial_coverage'
    ),
    type: taskflow.pages.index.cardFilters.filter(f => 
      f.field === 'type' || 
      f.field === 'quality'
    ),
    tags: taskflow.pages.index.cardFilters.filter(f => 
      f.field === 'category' || 
      f.field === 'tags'
    ),
  };
  
  // Content to render on the page for this component
  return (
    <Filters grouped={false} onClose={props.onClose} sx={{ border: 'none', overflowY: 'auto', maxHeight: '100vh' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Refine Your Search</Typography>
      
      {/* Map for geographic selection */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>Geographic Region</Typography>
        <MapSelector expanded={expandedMap} onToggleExpand={toggleMapExpand} />
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Data Sources Section */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="medium">Data Sources</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {filterCategories.source.map((f, i) => (
            <FilterField
              key={`${f.field}-${i}`}
              field={f.field}
              label={f.label}
              operator={f.operator}
              filterComponent={f.filterComponent}
              filterProps={f.filterProps}
            />
          ))}
        </AccordionDetails>
      </Accordion>
      
      {/* Climate Variables Section */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="medium">Climate Variables</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {filterCategories.variables.map((f, i) => (
            <FilterField
              key={`${f.field}-${i}`}
              field={f.field}
              label={f.label}
              operator={f.operator}
              filterComponent={f.filterComponent}
              filterProps={f.filterProps}
            />
          ))}
        </AccordionDetails>
      </Accordion>
      
      {/* Time Period Section */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="medium">Time Period</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {filterCategories.temporal.map((f, i) => (
            <FilterField
              key={`${f.field}-${i}`}
              field={f.field}
              label={f.label}
              operator={f.operator}
              filterComponent={f.filterComponent}
              filterProps={f.filterProps}
            />
          ))}
        </AccordionDetails>
      </Accordion>
      
      {/* Resolution Section */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="medium">Resolution</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {filterCategories.spatial.map((f, i) => (
            <FilterField
              key={`${f.field}-${i}`}
              field={f.field}
              label={f.label}
              operator={f.operator}
              filterComponent={f.filterComponent}
              filterProps={f.filterProps}
            />
          ))}
        </AccordionDetails>
      </Accordion>
      
      {/* Data Type & Quality Section */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="medium">Data Type & Quality</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {filterCategories.type.map((f, i) => (
            <FilterField
              key={`${f.field}-${i}`}
              field={f.field}
              label={f.label}
              operator={f.operator}
              filterComponent={f.filterComponent}
              filterProps={f.filterProps}
            />
          ))}
        </AccordionDetails>
      </Accordion>
      
      {/* Categories & Tags Section */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="medium">Categories & Tags</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {filterCategories.tags.map((f, i) => (
            <FilterField
              key={`${f.field}-${i}`}
              field={f.field}
              label={f.label}
              operator={f.operator}
              filterComponent={f.filterComponent}
              filterProps={f.filterProps}
            />
          ))}
        </AccordionDetails>
      </Accordion>
    </Filters>
  );
};
