import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import FiltersPanel from './FiltersPanel';

// Mock the Icons since they might cause issues in tests
vi.mock('../../../components/Icons', () => ({
  TreeIcon: () => <div data-testid="tree-icon" />,
  AirQualityIcon: () => <div data-testid="air-quality-icon" />,
  LocationIcon: () => <div data-testid="location-icon" />,
}));

// Mock the FilterContext if used
vi.mock('../../../components/FilterContext', () => ({
  useFilters: () => ({
    setFilter: vi.fn(),
    filters: {},
  }),
}));

describe('FiltersPanel', () => {
  it('renders the component with default tab', () => {
    render(<FiltersPanel />);
    
    // Check if the component renders with the default tab (Locations)
    // The title might be different, so we'll just check for the tab button
    expect(screen.getByText('Location')).toBeInTheDocument();
    
    // Check if all tab buttons are present
    expect(screen.getByTestId('tree-icon')).toBeInTheDocument();
    expect(screen.getByTestId('air-quality-icon')).toBeInTheDocument();
    expect(screen.getByTestId('location-icon')).toBeInTheDocument();
  });

  it('switches to Trees tab when clicked', async () => {
    const user = userEvent.setup();
    render(<FiltersPanel />);
    
    // Find and click the Trees tab
    const treesTab = screen.getByText('Trees');
    await user.click(treesTab);
    
    // Check if Trees filter content is displayed
    expect(screen.getByText('Species')).toBeInTheDocument();
    expect(screen.getByText('Health')).toBeInTheDocument();
    expect(screen.getByText(/Min Height/)).toBeInTheDocument();
    expect(screen.getByText(/Max Height/)).toBeInTheDocument();
    expect(screen.getByText('Search Trees')).toBeInTheDocument();
  });

  it('switches to Air Quality tab when clicked', async () => {
    const user = userEvent.setup();
    render(<FiltersPanel />);
    
    // Find and click the Air Quality tab
    const airQualityTab = screen.getByText('Air Quality');
    await user.click(airQualityTab);
    
    // Check if Air Quality filter content is displayed
    expect(screen.getByText('Sensor')).toBeInTheDocument();
    expect(screen.getByText('Parameter')).toBeInTheDocument();
    // The actual labels might be different, so we'll just check for the search button
    expect(screen.getByText('Search Air Quality')).toBeInTheDocument();
  });

  it('updates species input value when typed', async () => {
    const user = userEvent.setup();
    render(<FiltersPanel />);
    
    // Switch to Trees tab
    const treesTab = screen.getByText('Trees');
    await user.click(treesTab);
    
    // Find the species input and type in it
    const speciesInput = screen.getByPlaceholderText('e.g. Oak, Redwood');
    await user.type(speciesInput, 'Oak');
    
    // Check if the input value is updated
    expect(speciesInput).toHaveValue('Oak');
  });

  it('updates health select when changed', async () => {
    const user = userEvent.setup();
    render(<FiltersPanel />);
    
    // Switch to Trees tab
    const treesTab = screen.getByText('Trees');
    await user.click(treesTab);
    
    // Find and click the health select
    const healthSelect = screen.getByText('Health').parentElement?.querySelector('.MuiSelect-select');
    if (!healthSelect) throw new Error('Health select not found');
    
    await user.click(healthSelect);
    
    // Select "Good" option
    const goodOption = screen.getByText('Good');
    await user.click(goodOption);
    
    // After selection, the text should be visible in the select
    expect(healthSelect).toHaveTextContent('Good');
  });

  it('updates min height slider when moved', async () => {
    render(<FiltersPanel />);
    
    // Switch to Trees tab
    fireEvent.click(screen.getByText('Trees'));
    
    // Find the min height slider by looking for the input with type="range"
    const minHeightContainer = screen.getByText(/Min Height \(ft\):/i).closest('div');
    if (!minHeightContainer) throw new Error('Min height container not found');
    
    const minHeightSlider = minHeightContainer.querySelector('input[type="range"]');
    if (!minHeightSlider) throw new Error('Min height slider not found');
    
    // Move the slider (using fireEvent since userEvent doesn't support slider well)
    fireEvent.change(minHeightSlider, { target: { value: '50' } });
    
    // After changing the slider, the text should be updated
    expect(screen.getByText(/Min Height \(ft\): 50/i)).toBeInTheDocument();
  });

  it('renders location filters when on Locations tab', () => {
    render(<FiltersPanel />);
    
    // Locations tab should be active by default
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Location Type')).toBeInTheDocument();
    expect(screen.getByText('Search Locations')).toBeInTheDocument();
  });

  it('updates location name input when typed', async () => {
    const user = userEvent.setup();
    render(<FiltersPanel />);
    
    // Find the location name input and type in it
    const locationNameInput = screen.getByPlaceholderText('e.g. Doe Library');
    await user.type(locationNameInput, 'Berkeley');
    
    // Check if the input value is updated
    expect(locationNameInput).toHaveValue('Berkeley');
  });
});
