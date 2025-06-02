import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import BerkeleyDataMap from './BerkeleyDataMap';

// Mock the lazy-loaded MapContainer component
const mockMapContainerActual = vi.fn((props: any) => {
  // Store the props for later inspection in tests
  return (
    <div data-testid="mock-map-container">
      <div data-testid="tree-visibility">{props.treeVisibility ? 'visible' : 'hidden'}</div>
      <div data-testid="air-visibility">{props.airQualityVisibility ? 'visible' : 'hidden'}</div>
      <div data-testid="building-visibility">{props.buildingVisibility ? 'visible' : 'hidden'}</div>
      <button 
        onClick={() => props.onClick({ 
          object: { 
            properties: { 
              id: 'test-tree', 
              species: 'Test Tree', 
              healthCondition: 'Good',
              dbh: 24,
              height: 45,
              observationDate: '2023-01-15'
            }, 
            coordinates: { lat: 37.871, lng: -122.259 }
          } 
        })}
        data-testid="simulate-map-click"
      >
        Simulate Map Click
      </button>
    </div>
  );
});

vi.mock('./BerkeleyDataMap/MapContainer', () => ({
  default: (props: any) => mockMapContainerActual(props),
}));

// Mock DataLayersToggle to check props and simulate interactions
const mockDataLayersToggleActual = vi.fn();
vi.mock('./DataLayersToggle', () => ({
  default: (props: any) => {
    mockDataLayersToggleActual(props);
    return (
      <div data-testid="mock-data-layers-toggle">
        <button onClick={() => props.onToggle('tree')} data-testid="toggle-tree">
          {props.visibleLayers.includes('tree') ? 'Hide Trees' : 'Show Trees'}
        </button>
        <button onClick={() => props.onToggle('air')} data-testid="toggle-air">
          {props.visibleLayers.includes('air') ? 'Hide Air Quality' : 'Show Air Quality'}
        </button>
        <button onClick={() => props.onToggle('locations')} data-testid="toggle-locations">
          {props.visibleLayers.includes('locations') ? 'Hide Buildings' : 'Show Buildings'}
        </button>
      </div>
    );
  },
}));

// Mock TreeDetailsPopup
vi.mock('./TreeDetailsPopup', () => ({
  default: ({ tree, onClose }: any) => (
    <div data-testid="tree-details-popup">
      <div data-testid="tree-species">{tree.species}</div>
      <div data-testid="tree-health">{tree.healthCondition}</div>
      <div data-testid="tree-height">{tree.height ? `${tree.height} ft` : 'Unknown'}</div>
      <div data-testid="tree-dbh">{tree.dbh ? `${tree.dbh} in` : 'Unknown'}</div>
      <button onClick={onClose} data-testid="close-popup">Close</button>
    </div>
  ),
}));

// Mock global fetch
global.fetch = vi.fn();

const mockTreeData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-122.259, 37.871] },
      properties: { id: 'tree1', species: 'Oak', health: 'Good' },
    },
  ],
};

const mockBuildingData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-122.260, 37.870],
          [-122.255, 37.870],
          [-122.255, 37.875],
          [-122.260, 37.875],
          [-122.260, 37.870]
        ]]
      },
      properties: {
        id: 'bldg1',
        name: 'Test Building'
      }
    }
  ]
};

describe('BerkeleyDataMap', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock fetch for different endpoints
    (global.fetch as any).mockImplementation((url: string) => {
      if (url.includes('berkeley_trees_processed.json')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockTreeData,
        });
      }
      if (url.includes('berkeley-bldgs.geojson')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockBuildingData,
        });
      }
      if (url.includes('berkeley_air_quality.json') || url.includes('air_quality_data.json')) {
        return Promise.resolve({
          ok: false, // Simulate that air quality data is not available
          status: 404,
        });
      }
      return Promise.reject(new Error(`Unexpected URL: ${url}`));
    });
  });

  it('renders loading state initially', () => {
    render(<BerkeleyDataMap />);
    expect(screen.getByText('Loading Map...')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders DataLayersToggle and MapContainer after data load', async () => {
    render(<BerkeleyDataMap />);
    
    // Wait for Suspense to resolve and data to be fetched
    await waitFor(() => {
      expect(screen.getByTestId('mock-map-container')).toBeInTheDocument();
    });
    
    expect(screen.getByTestId('mock-data-layers-toggle')).toBeInTheDocument();
    
    // Verify all three toggle buttons are rendered
    expect(screen.getByTestId('toggle-tree')).toHaveTextContent('Hide Trees');
    expect(screen.getByTestId('toggle-air')).toHaveTextContent('Hide Air Quality');
    expect(screen.getByTestId('toggle-locations')).toHaveTextContent('Hide Buildings');
    
    // Verify initial visibility states
    expect(screen.getByTestId('tree-visibility')).toHaveTextContent('visible');
    expect(screen.getByTestId('air-visibility')).toHaveTextContent('visible');
    expect(screen.getByTestId('building-visibility')).toHaveTextContent('visible');
  });

  it('shows tree details popup when a tree marker is clicked', async () => {
    render(<BerkeleyDataMap />);
    
    // Wait for data loading and component mount
    await waitFor(() => {
      expect(screen.getByTestId('mock-map-container')).toBeInTheDocument();
    });
    
    // Initially, the popup should not be visible
    expect(screen.queryByTestId('tree-details-popup')).not.toBeInTheDocument();
    
    // Simulate a click on a tree marker
    const mapClickButton = screen.getByTestId('simulate-map-click');
    await userEvent.click(mapClickButton);
    
    // Verify the tree details popup is shown with correct data
    expect(screen.getByTestId('tree-details-popup')).toBeInTheDocument();
    expect(screen.getByTestId('tree-species')).toHaveTextContent('Test Tree');
    expect(screen.getByTestId('tree-health')).toHaveTextContent('Good');
    expect(screen.getByTestId('tree-height')).toHaveTextContent('45 ft');
    expect(screen.getByTestId('tree-dbh')).toHaveTextContent('24 in');
  });
  
  it('closes tree details popup when close button is clicked', async () => {
    render(<BerkeleyDataMap />);
    
    // Wait for data loading and component mount
    await waitFor(() => {
      expect(screen.getByTestId('mock-map-container')).toBeInTheDocument();
    });
    
    // Simulate a click on a tree marker to show the popup
    const mapClickButton = screen.getByTestId('simulate-map-click');
    await userEvent.click(mapClickButton);
    
    // Verify the popup is shown
    expect(screen.getByTestId('tree-details-popup')).toBeInTheDocument();
    
    // Click the close button
    const closeButton = screen.getByTestId('close-popup');
    await userEvent.click(closeButton);
    
    // Verify the popup is closed
    await waitFor(() => {
      expect(screen.queryByTestId('tree-details-popup')).not.toBeInTheDocument();
    });
  });

  it('calls onPointClick with correct data when map is clicked', async () => {
    const handlePointClick = vi.fn();
    render(<BerkeleyDataMap onPointClick={handlePointClick} />); 
    
    // Wait for data loading
    await waitFor(() => {
      expect(screen.getByTestId('mock-map-container')).toBeInTheDocument();
    });
    
    // Simulate a click on the map
    const mapClickButton = screen.getByTestId('simulate-map-click');
    await userEvent.click(mapClickButton);
    
    // Check that onPointClick was called with the correct data
    expect(handlePointClick).toHaveBeenCalledTimes(1);
    expect(handlePointClick).toHaveBeenCalledWith(expect.objectContaining({
      id: 'test-tree',
      type: 'tree',
      category: 'Test Tree',
      lat: 37.871,
      lng: -122.259
    }));
  });
});
