import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BerkeleyDataMap from './BerkeleyDataMap';

// Mock the lazy-loaded MapContainer component
const mockMapContainerActual = vi.fn();
vi.mock('./BerkeleyDataMap/MapContainer', () => ({
  default: (props: any) => {
    mockMapContainerActual(props);
    return <div data-testid="mock-map-container">Mock Map Container</div>;
  },
}));

// Mock DataLayersToggle to check props and simulate interactions
const mockDataLayersToggleActual = vi.fn();
vi.mock('./DataLayersToggle', () => ({
  default: (props: any) => {
    mockDataLayersToggleActual(props);
    return (
      <div data-testid="mock-data-layers-toggle">
        <button onClick={() => props.onToggle('tree')}>Toggle Tree</button>
        <button onClick={() => props.onToggle('air')}>Toggle Air</button>
        <button onClick={() => props.onToggle('locations')}>Toggle Locations</button>
      </div>
    );
  },
}));

// Mock global fetch
global.fetch = vi.fn();

const mockTreeData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-122.259, 37.871] },
      properties: { id: 'tree1', species: 'Oak' },
    },
  ],
};

describe('BerkeleyDataMap', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockTreeData,
    } as Response);
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
  });

  it('passes correct initial props to DataLayersToggle and MapContainer', async () => {
    render(<BerkeleyDataMap />);

    // DataLayersToggle is rendered synchronously
    expect(mockDataLayersToggleActual).toHaveBeenCalled();
    const dataLayersToggleProps = mockDataLayersToggleActual.mock.lastCall[0];
    console.log('[Test Log] DataLayersToggle received props:', dataLayersToggleProps);
    console.log('[Test Log] Value of onToggle:', dataLayersToggleProps.onToggle);
    console.log('[Test Log] Type of onToggle:', typeof dataLayersToggleProps.onToggle);
    expect(dataLayersToggleProps.visibleLayers).toEqual(['tree', 'air', 'locations']);
    expect(typeof dataLayersToggleProps.onToggle).toBe('function');

    // MapContainer is lazy-loaded, wait for it
    await waitFor(() => {
      expect(mockMapContainerActual).toHaveBeenCalled();
    });
    const mapContainerProps = mockMapContainerActual.mock.lastCall[0];
    expect(mapContainerProps.visibleLayers).toEqual(['tree', 'air', 'locations']);
    expect(mapContainerProps.layerData.trees).toEqual(mockTreeData);
    expect(mapContainerProps.layerData.airQuality).toEqual(expect.any(Array)); // Default mock air quality
    expect(typeof mapContainerProps.onMapClick).toBe('function');
  });

  it('toggles layer visibility correctly', async () => {
    render(<BerkeleyDataMap />);
    await waitFor(() => screen.getByTestId('mock-data-layers-toggle'));

    // Simulate toggling the 'tree' layer off
    await act(async () => {
      const toggleTreeButton = screen.getByRole('button', { name: /toggle tree/i });
      await userEvent.click(toggleTreeButton);
    });

    // Wait for re-render and prop update
    await waitFor(() => {
      expect(mockMapContainerActual).toHaveBeenLastCalledWith(expect.objectContaining({
        visibleLayers: ['air', 'locations'], // 'tree' should be removed
      }));
      expect(mockDataLayersToggleActual).toHaveBeenLastCalledWith(expect.objectContaining({
        visibleLayers: ['air', 'locations'],
        onToggle: expect.any(Function) // Ensure onToggle is still passed
      }));
    });

    // Simulate toggling the 'tree' layer back on
    await act(async () => {
      const toggleTreeButton = screen.getByRole('button', { name: /toggle tree/i });
      await userEvent.click(toggleTreeButton);
    });

    await waitFor(() => {
      expect(mockMapContainerActual).toHaveBeenLastCalledWith(expect.objectContaining({
        visibleLayers: ['air', 'locations', 'tree'], // 'tree' should be added back
      }));
    });
  });

  it('calls onPointClick with correct data when map is clicked', async () => {
    const handlePointClick = vi.fn();
    render(<BerkeleyDataMap onPointClick={handlePointClick} />); 
    await waitFor(() => screen.getByTestId('mock-map-container'));

    // Simulate a click event from the MapContainer mock
    // The MapContainer mock needs to be able to call its onMapClick prop
    // Let's refine the MapContainer mock to capture and allow invocation of onMapClick

    // Find the onMapClick prop passed to the mocked MapContainer
    const mapContainerProps = mockMapContainerActual.mock.calls[mockMapContainerActual.mock.calls.length - 1][0];
    const onMapClickHandler = mapContainerProps.onMapClick;

    expect(onMapClickHandler).toBeDefined();

    const mockClickInfo = {
      object: {
        properties: { id: 'tree123', species: 'Redwood', health: 'Good' },
        coordinates: { lat: 37.875, lng: -122.260 }, // Example coordinates
      },
    };

    await act(async () => {
      onMapClickHandler(mockClickInfo);
    });

    expect(handlePointClick).toHaveBeenCalledTimes(1);
    expect(handlePointClick).toHaveBeenCalledWith({
      id: 'tree123',
      type: 'tree',
      lat: 37.875,
      lng: -122.260,
      title: 'Tree',
      category: 'Redwood',
      health: 'Good',
      details: mockClickInfo.object.properties,
    });
  });

  // More tests will go here for interactions, error handling, etc.

});
