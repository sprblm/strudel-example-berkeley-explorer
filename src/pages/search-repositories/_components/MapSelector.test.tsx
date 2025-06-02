import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MapSelector } from './MapSelector';

// Mock the react-leaflet components
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  Rectangle: () => <div data-testid="rectangle" />,
  useMap: () => ({
    setView: vi.fn(),
  }),
}));

// Mock the leaflet library
vi.mock('leaflet', () => {
  const L = {
    Icon: {
      Default: {
        prototype: {
          _getIconUrl: {},
        },
        mergeOptions: vi.fn(),
      },
    },
  };
  return { default: L };
});

// Mock the MUI icons
vi.mock('@mui/icons-material/Fullscreen', () => ({
  default: () => <div data-testid="fullscreen-icon" />,
}));

vi.mock('@mui/icons-material/FullscreenExit', () => ({
  default: () => <div data-testid="fullscreen-exit-icon" />,
}));

vi.mock('@mui/icons-material/MyLocation', () => ({
  default: () => <div data-testid="my-location-icon" />,
}));

// Mock the FilterContext
vi.mock('../../../components/FilterContext', () => ({
  useFilters: () => ({
    setFilter: vi.fn(),
    filters: {},
  }),
}));

// Mock the taskflow config
vi.mock('../_config/taskflow.config', () => ({
  taskflow: {
    pages: {
      index: {
        mapSearch: {
          enabled: true,
          defaultCenter: [37.8715, -122.2730], // Berkeley coordinates
          defaultZoom: 13,
          maxBounds: [
            [37.85, -122.30], // Southwest
            [37.89, -122.25], // Northeast
          ],
        },
      },
    },
  },
}));

describe('MapSelector', () => {
  const mockOnToggleExpand = vi.fn();

  beforeEach(() => {
    mockOnToggleExpand.mockClear();
  });

  it('renders the map component', () => {
    render(<MapSelector />);
    
    // Check if the map container is rendered
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    
    // Check if the title is rendered
    expect(screen.getByText('Geographic Region Selection')).toBeInTheDocument();
    
    // Check if the fullscreen button is rendered
    expect(screen.getByTestId('fullscreen-icon')).toBeInTheDocument();
  });

  it('renders in default non-expanded state', () => {
    render(<MapSelector />);
    
    // In non-expanded state, the fullscreen icon should be visible (not fullscreen-exit)
    expect(screen.getByTestId('fullscreen-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('fullscreen-exit-icon')).not.toBeInTheDocument();
    
    // In non-expanded state, we just verify the fullscreen icon is present
    // We can't check the height style directly with our mocks
  });

  it('renders in expanded state when expanded prop is true', () => {
    render(<MapSelector expanded={true} onToggleExpand={mockOnToggleExpand} />);
    
    // In expanded state, the fullscreen-exit icon should be visible
    expect(screen.getByTestId('fullscreen-exit-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('fullscreen-icon')).not.toBeInTheDocument();
    
    // In expanded state, we just verify the fullscreen-exit icon is present
    // We can't check the height style directly with our mocks
  });

  it('toggles fullscreen mode when button is clicked', async () => {
    const user = userEvent.setup();
    render(<MapSelector onToggleExpand={mockOnToggleExpand} />);
    
    // Find and click the fullscreen button
    const fullscreenButton = screen.getByTestId('fullscreen-icon').closest('button');
    if (fullscreenButton) {
      await user.click(fullscreenButton);
      
      // Check if onToggleExpand callback was called
      expect(mockOnToggleExpand).toHaveBeenCalledTimes(1);
    }
  });

  it('renders predefined region buttons', () => {
    render(<MapSelector />);
    
    // Check if region buttons are rendered
    expect(screen.getByText('North America')).toBeInTheDocument();
    expect(screen.getByText('South America')).toBeInTheDocument();
    expect(screen.getByText('Europe')).toBeInTheDocument();
    expect(screen.getByText('Africa')).toBeInTheDocument();
    expect(screen.getByText('Asia')).toBeInTheDocument();
    expect(screen.getByText('Australia')).toBeInTheDocument();
    expect(screen.getByText('Arctic')).toBeInTheDocument();
    expect(screen.getByText('Antarctic')).toBeInTheDocument();
  });

  it('selects a region when region button is clicked', async () => {
    const user = userEvent.setup();
    render(<MapSelector />);
    
    // Find and click a region button
    const europeButton = screen.getByText('Europe');
    await user.click(europeButton);
    
    // After clicking, the Rectangle component should be rendered to show the selected region
    // Since we're using mocks, we can't directly test the bounds, but we can check if the component is used
    expect(screen.getByTestId('rectangle')).toBeInTheDocument();
  });

  it('renders the reset view control', () => {
    render(<MapSelector />);
    
    // Check if the reset view control is rendered
    expect(screen.getByTestId('my-location-icon')).toBeInTheDocument();
  });
});
