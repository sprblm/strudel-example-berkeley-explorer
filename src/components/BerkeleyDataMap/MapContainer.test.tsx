import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import MapContainer from './MapContainer';
import mapboxgl from 'mapbox-gl';
import { FeatureCollection } from 'geojson';

// Create mock functions that we can reference in our tests
const mockMapFunctions = {
  addSource: vi.fn(),
  addLayer: vi.fn(),
  on: vi.fn(),
  once: vi.fn(),
  off: vi.fn(),
  removeLayer: vi.fn(),
  removeSource: vi.fn(),
  getSource: vi.fn(),
  getLayer: vi.fn().mockReturnValue(true),
  setLayoutProperty: vi.fn(),
  addControl: vi.fn(),
  isStyleLoaded: vi.fn().mockReturnValue(true),
  setFeatureState: vi.fn(),
  removeFeatureState: vi.fn(),
  getStyle: vi.fn().mockReturnValue({ layers: [] }),
  getCanvas: vi.fn().mockReturnValue({ style: {} }),
  queryRenderedFeatures: vi.fn().mockReturnValue([]),
  remove: vi.fn(),
};

// Mock mapboxgl
vi.mock('mapbox-gl', () => {
  // MockMap constructor stores a reference to the last created map instance
  class MockMap {
    constructor() {
      // Copy all mock functions to this instance
      Object.assign(this, mockMapFunctions);
      // Store this instance as the last created map
      MockMap.lastInstance = this;
    }
    
    static lastInstance = null;
  }
  
  return {
    __esModule: true,
    default: {
      Map: MockMap,
      NavigationControl: vi.fn(),
      accessToken: '',
    },
    Map: MockMap,
    NavigationControl: vi.fn(),
    accessToken: '',
  };
});

// Mock GeoJSON data
const mockTreeData: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'tree-1',
        species: 'Oak',
        healthCondition: 'Good',
        dbh: 24,
      },
      geometry: {
        type: 'Point',
        coordinates: [-122.26, 37.87],
      },
    },
  ],
};

const mockAirQualityData = [
  {
    id: 'air-1',
    lat: 37.87,
    lng: -122.26,
    value: 35,
    category: 'Good',
  },
];

const mockBuildingData: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'building-1',
        name: 'Test Building',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-122.26, 37.87],
            [-122.255, 37.87],
            [-122.255, 37.875],
            [-122.26, 37.875],
            [-122.26, 37.87],
          ],
        ],
      },
    },
  ],
};

describe('MapContainer', () => {
  let mockOnClick: jest.Mock;
  let mapInstance: any;

  beforeEach(() => {
    mockOnClick = vi.fn();
    // Reset the mock functions
    Object.keys(mockMapFunctions).forEach(key => {
      mockMapFunctions[key].mockReset();
    });
    // Reset static lastInstance property
    (mapboxgl.Map as any).lastInstance = null;
  });

  it('initializes the map with correct settings', () => {
    render(
      <MapContainer
        height={400}
        width="100%"
        onClick={mockOnClick}
      />
    );

    expect(mapboxgl.Map).toHaveBeenCalledTimes(1);
    // The Map constructor is now a class, so we check it was called
    expect(mockMapFunctions.addControl).toHaveBeenCalled();
  });

  it('adds tree layer with circle style and correct properties', async () => {
    // Render with tree data
    render(
      <MapContainer
        height={400}
        width="100%"
        onClick={mockOnClick}
        treeData={mockTreeData}
        treeVisibility={true}
      />
    );

    // Use our exported mockMapFunctions directly
    // Verify that a GeoJSON source was added for trees
    expect(mockMapFunctions.addSource).toHaveBeenCalledWith(
      'trees',
      expect.objectContaining({
        type: 'geojson',
        data: mockTreeData,
        generateId: true, // This is a key property we added
      })
    );

    // Verify that a circle layer was added with correct green color
    expect(mockMapFunctions.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'trees-layer',
        type: 'circle', // Verify it's a circle type, not symbol
        source: 'trees',
        paint: expect.objectContaining({
          'circle-radius': 6,
          'circle-color': '#4CAF50', // Green color for trees
          'circle-opacity': 0.9,
          'circle-stroke-width': expect.any(Array), // Ensures we use feature state for stroke
          'circle-stroke-color': '#000000', // Black border on hover/selection
        }),
      })
    );

    // Test updating visibility with a new render
    const { rerender } = render(
      <MapContainer
        height={400}
        width="100%"
        onClick={mockOnClick}
        treeData={mockTreeData}
        treeVisibility={true}
      />
    );
    
    // Now rerender with visibility false
    rerender(
      <MapContainer
        height={400}
        width="100%"
        onClick={mockOnClick}
        treeData={mockTreeData}
        treeVisibility={false}
      />
    );

    // Should update the visibility property
    expect(mockMapFunctions.setLayoutProperty).toHaveBeenCalledWith(
      'trees-layer',
      'visibility',
      'none'
    );
  });

  it('adds air quality layer with circle style and amber color', async () => {
    render(
      <MapContainer
        height={400}
        width="100%"
        onClick={mockOnClick}
        airQualityData={mockAirQualityData}
        airQualityVisibility={true}
      />
    );

    // Verify that a GeoJSON source was added for air quality
    expect(mockMapFunctions.addSource).toHaveBeenCalledWith(
      'air-quality',
      expect.objectContaining({
        type: 'geojson',
        data: expect.objectContaining({
          type: 'FeatureCollection',
          features: expect.arrayContaining([
            expect.objectContaining({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: expect.arrayContaining([-122.26, 37.87]),
              },
            }),
          ]),
        }),
      })
    );

    // Verify that a circle layer was added with correct amber color
    expect(mockMapFunctions.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'air-quality-layer',
        type: 'circle', // Verify it's a circle type, not symbol
        source: 'air-quality',
        paint: expect.objectContaining({
          'circle-radius': 6,
          'circle-color': '#FFA500', // Amber color for air quality
          'circle-opacity': 0.9,
          'circle-stroke-width': expect.any(Array), // Expression for conditional styling
          'circle-stroke-color': '#000000', // Black border
        }),
      })
    );
  });

  it('sets up event listeners for interactivity', () => {
    render(
      <MapContainer
        height={400}
        width="100%"
        onClick={mockOnClick}
        treeData={mockTreeData}
        treeVisibility={true}
        airQualityData={mockAirQualityData}
        airQualityVisibility={true}
      />
    );

    // Verify that click and hover events are set up for trees
    expect(mockMapFunctions.once).toHaveBeenCalledWith(
      'click',
      'trees-layer',
      expect.any(Function)
    );
    expect(mockMapFunctions.on).toHaveBeenCalledWith(
      'mouseenter',
      'trees-layer',
      expect.any(Function)
    );
    expect(mockMapFunctions.on).toHaveBeenCalledWith(
      'mouseleave',
      'trees-layer',
      expect.any(Function)
    );

    // Verify that click and hover events are set up for air quality
    expect(mockMapFunctions.once).toHaveBeenCalledWith(
      'click',
      'air-quality-layer',
      expect.any(Function)
    );
    expect(mockMapFunctions.on).toHaveBeenCalledWith(
      'mouseenter',
      'air-quality-layer',
      expect.any(Function)
    );
    expect(mockMapFunctions.on).toHaveBeenCalledWith(
      'mouseleave',
      'air-quality-layer',
      expect.any(Function)
    );
  });

  it('manages feature states for hover and selection', async () => {
    render(
      <MapContainer
        height={400}
        width="100%"
        onClick={mockOnClick}
        treeData={mockTreeData}
        treeVisibility={true}
      />
    );

    // Helper function to find event handlers in mock calls
    const findEventHandler = (mockFn: any, eventType: string, layerId: string): Function => {
      // Find the call that matches the event type and layer ID
      const calls = mockFn.mock.calls;
      const call = calls.find((call: any[]) => call[0] === eventType && call[1] === layerId);
      return call ? call[2] : null;
    };

    // Simulate a mouseenter event
    const mouseEnterHandler = findEventHandler(mockMapFunctions.on, 'mouseenter', 'trees-layer');
    
    // Simulate mouseenter with a feature
    mouseEnterHandler({
      features: [{ id: 'tree-1' }],
      preventDefault: vi.fn(),
    });

    // Verify hover state is set
    expect(mockMapFunctions.setFeatureState).toHaveBeenCalledWith(
      { source: 'trees', id: 'tree-1' },
      { hover: true }
    );

    // Simulate a mouseleave event
    const mouseLeaveHandler = findEventHandler(mockMapFunctions.on, 'mouseleave', 'trees-layer');
    
    // Simulate mouseleave
    mouseLeaveHandler({
      preventDefault: vi.fn(),
    });

    // Verify hover state is removed
    expect(mockMapFunctions.removeFeatureState).toHaveBeenCalled();

    // Simulate a click event
    const clickHandler = findEventHandler(mockMapFunctions.once, 'click', 'trees-layer');
    
    // Simulate click with a feature
    clickHandler({
      features: [{ id: 'tree-1', properties: { id: 'tree-1' } }],
      lngLat: { lat: 37.87, lng: -122.26 },
      preventDefault: vi.fn(),
    });

    // Verify selection state is set
    expect(mockMapFunctions.setFeatureState).toHaveBeenCalledWith(
      { source: 'trees', id: 'tree-1' },
      { selected: true }
    );

    // Verify onClick callback is called with correct data
    expect(mockOnClick).toHaveBeenCalledWith(
      expect.objectContaining({
        object: expect.objectContaining({
          properties: expect.objectContaining({ id: 'tree-1' }),
          coordinates: expect.objectContaining({ lat: 37.87, lng: -122.26 }),
        }),
      })
    );
  });

  it('cleans up resources when unmounted', () => {
    const { unmount } = render(
      <MapContainer
        height={400}
        width="100%"
        onClick={mockOnClick}
        treeData={mockTreeData}
        treeVisibility={true}
        airQualityData={mockAirQualityData}
        airQualityVisibility={true}
      />
    );

    // Unmount the component
    unmount();

    // Verify that the map was removed
    expect(mockMapFunctions.remove).toHaveBeenCalled();
  });
});
