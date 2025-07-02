import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import MapContainer from './MapContainer';
import mapboxgl from 'mapbox-gl';
import { FeatureCollection } from 'geojson';

// Mock mapboxgl
vi.mock('mapbox-gl', () => {
  const addSourceMock = vi.fn();
  const addLayerMock = vi.fn();
  const onMock = vi.fn();
  const onceMock = vi.fn();
  const offMock = vi.fn();
  const removeLayerMock = vi.fn();
  const removeSourceMock = vi.fn();
  const getSourceMock = vi.fn();
  const getLayerMock = vi.fn();
  const setLayoutPropertyMock = vi.fn();
  const addControlMock = vi.fn();
  const setFeatureStateMock = vi.fn();
  const removeFeatureStateMock = vi.fn();
  const getStyleMock = vi.fn(() => ({ layers: [] }));
  const getCanvasMock = vi.fn(() => ({ style: {} }));
  const queryRenderedFeaturesMock = vi.fn(() => []);
  const removeMock = vi.fn();

  return {
    Map: vi.fn(() => ({
      addSource: addSourceMock,
      addLayer: addLayerMock,
      on: onMock,
      once: onceMock,
      off: offMock,
      removeLayer: removeLayerMock,
      removeSource: removeSourceMock,
      getSource: getSourceMock,
      getLayer: getLayerMock,
      setLayoutProperty: setLayoutPropertyMock,
      addControl: addControlMock,
      isStyleLoaded: vi.fn(() => true),
      setFeatureState: setFeatureStateMock,
      removeFeatureState: removeFeatureStateMock,
      getStyle: getStyleMock,
      getCanvas: getCanvasMock,
      queryRenderedFeatures: queryRenderedFeaturesMock,
      remove: removeMock,
    })),
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
    vi.clearAllMocks();
    mockOnClick = vi.fn();
    
    // Reset the mapboxgl instance
    (mapboxgl.Map as any).mockClear();
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY || '';
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
    const mapConstructorCall = (mapboxgl.Map as any).mock.calls[0][0];
    
    expect(mapConstructorCall.zoom).toBe(14);
    expect(mapConstructorCall.center).toEqual([-122.25948, 37.872]);
    expect(mapConstructorCall.container).toBeDefined();
  });

  it('adds tree layer with circle style and correct properties', async () => {
    const { rerender } = render(
      <MapContainer
        height={400}
        width="100%"
        onClick={mockOnClick}
        treeData={mockTreeData}
        treeVisibility={true}
      />
    );

    // Get the mapInstance mock
    mapInstance = (mapboxgl.Map as any).mock.instances[0];

    // Verify that a GeoJSON source was added for trees
    expect(mapInstance.addSource).toHaveBeenCalledWith(
      'trees',
      expect.objectContaining({
        type: 'geojson',
        data: mockTreeData,
        generateId: true, // This is a key property we added
      })
    );

    // Verify that a circle layer was added with correct green color
    expect(mapInstance.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'trees-layer',
        type: 'circle', // Verify it's a circle type, not symbol
        source: 'trees',
        paint: expect.objectContaining({
          'circle-radius': 6,
          'circle-color': '#4CAF50', // Green color
          'circle-opacity': 0.9,
          'circle-stroke-width': expect.anything(), // Expression for conditional styling
          'circle-stroke-color': '#000000', // Black border
        }),
      })
    );

    // Test updating visibility
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
    expect(mapInstance.setLayoutProperty).toHaveBeenCalledWith(
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

    // Get the mapInstance mock
    mapInstance = (mapboxgl.Map as any).mock.instances[0];

    // Verify that a GeoJSON source was added for air quality
    expect(mapInstance.addSource).toHaveBeenCalledWith(
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
    expect(mapInstance.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'air-quality-layer',
        type: 'circle', // Verify it's a circle type, not symbol
        source: 'air-quality',
        paint: expect.objectContaining({
          'circle-radius': 6,
          'circle-color': '#FFA500', // Amber color
          'circle-opacity': 0.9,
          'circle-stroke-width': expect.anything(), // Expression for conditional styling
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

    // Get the mapInstance mock
    mapInstance = (mapboxgl.Map as any).mock.instances[0];

    // Verify that click and hover events are set up for trees
    expect(mapInstance.once).toHaveBeenCalledWith(
      'click',
      'trees-layer',
      expect.any(Function)
    );
    expect(mapInstance.on).toHaveBeenCalledWith(
      'mouseenter',
      'trees-layer',
      expect.any(Function)
    );
    expect(mapInstance.on).toHaveBeenCalledWith(
      'mouseleave',
      'trees-layer',
      expect.any(Function)
    );

    // Verify that click and hover events are set up for air quality
    expect(mapInstance.once).toHaveBeenCalledWith(
      'click',
      'air-quality-layer',
      expect.any(Function)
    );
    expect(mapInstance.on).toHaveBeenCalledWith(
      'mouseenter',
      'air-quality-layer',
      expect.any(Function)
    );
    expect(mapInstance.on).toHaveBeenCalledWith(
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

    // Get the mapInstance mock
    mapInstance = (mapboxgl.Map as any).mock.instances[0];

    // Simulate a mouseenter event
    const mouseEnterHandler = findEventHandler(mapInstance.on.mock.calls, 'mouseenter', 'trees-layer');
    
    // Simulate mouseenter with a feature
    mouseEnterHandler({
      features: [{ id: 'tree-1' }],
      preventDefault: vi.fn(),
    });

    // Verify hover state is set
    expect(mapInstance.setFeatureState).toHaveBeenCalledWith(
      { source: 'trees', id: 'tree-1' },
      { hover: true }
    );

    // Simulate a mouseleave event
    const mouseLeaveHandler = findEventHandler(mapInstance.on.mock.calls, 'mouseleave', 'trees-layer');
    
    // Simulate mouseleave
    mouseLeaveHandler({
      preventDefault: vi.fn(),
    });

    // Verify hover state is removed
    expect(mapInstance.removeFeatureState).toHaveBeenCalled();

    // Simulate a click event
    const clickHandler = findEventHandler(mapInstance.once.mock.calls, 'click', 'trees-layer');
    
    // Simulate click with a feature
    clickHandler({
      features: [{ id: 'tree-1', properties: { id: 'tree-1' } }],
      lngLat: { lat: 37.87, lng: -122.26 },
      preventDefault: vi.fn(),
    });

    // Verify selection state is set
    expect(mapInstance.setFeatureState).toHaveBeenCalledWith(
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

    // Get the mapInstance mock
    mapInstance = (mapboxgl.Map as any).mock.instances[0];

    // Unmount the component
    unmount();

    // Verify that the map was removed
    expect(mapInstance.remove).toHaveBeenCalled();
  });
});

// Helper function to find event handlers in mock calls
function findEventHandler(calls: any[][], eventType: string, layerId: string): Function {
  const call = calls.find(call => call[0] === eventType && call[1] === layerId);
  return call ? call[2] : null;
}
