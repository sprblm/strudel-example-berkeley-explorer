import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import TreeDetailsPopup from './TreeDetailsPopup';

describe('TreeDetailsPopup', () => {
  const mockTree = {
    id: 'tree-123',
    species: 'Coast Live Oak',
    healthCondition: 'Good',
    dbh: 24,
    height: 45,
    observationDate: '2023-01-15',
    lat: 37.8715,
    lng: -122.2730
  };
  
  const mockOnClose = vi.fn();
  const mockOnViewMore = vi.fn();
  
  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnViewMore.mockClear();
  });
  
  it('renders tree details correctly', () => {
    const { container } = render(<TreeDetailsPopup tree={mockTree} onClose={mockOnClose} />);
    
    // Check title and basic info
    expect(screen.getByText('Tree Details')).toBeInTheDocument();
    expect(screen.getByText('Coast Live Oak')).toBeInTheDocument();
    
    // Find the health condition chip
    const healthSection = screen.getByText('Health Condition').parentElement;
    expect(within(healthSection).getByText('Good')).toBeInTheDocument();
    
    // Find height and diameter sections
    const heightSection = screen.getByText('Height').parentElement;
    expect(within(heightSection).getByText('45 ft')).toBeInTheDocument();
    
    const diameterSection = screen.getByText('Diameter').parentElement;
    expect(within(diameterSection).getByText('24 in')).toBeInTheDocument();
    
    // Check location info
    expect(screen.getByText(/Lat: 37.871500/)).toBeInTheDocument();
    expect(screen.getByText(/Lng: -122.273000/)).toBeInTheDocument();
    
    // Check observation date section
    const dateSection = screen.getByText('Observation Date').parentElement;
    expect(within(dateSection).getByText('1/14/2023')).toBeInTheDocument();
  });
  
  it('handles unknown or missing data gracefully', () => {
    const incompleteTree = {
      id: 'tree-456',
      lat: 37.8715,
      lng: -122.2730
    };
    
    render(<TreeDetailsPopup tree={incompleteTree} onClose={mockOnClose} />);
    
    expect(screen.getByText('Unknown Species')).toBeInTheDocument();
    
    // Find the health condition chip
    const healthSection = screen.getByText('Health Condition').parentElement;
    expect(within(healthSection).getByText('Unknown')).toBeInTheDocument();
    
    // Find height and diameter sections
    const heightSection = screen.getByText('Height').parentElement;
    expect(within(heightSection).getByText('Unknown')).toBeInTheDocument();
    
    const diameterSection = screen.getByText('Diameter').parentElement;
    expect(within(diameterSection).getByText('Unknown')).toBeInTheDocument();
  });
  
  it('calls onClose when close button is clicked', () => {
    render(<TreeDetailsPopup tree={mockTree} onClose={mockOnClose} />);
    
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
  
  it('renders view more button when onViewMore is provided', () => {
    render(
      <TreeDetailsPopup 
        tree={mockTree} 
        onClose={mockOnClose} 
        onViewMore={mockOnViewMore} 
      />
    );
    
    const viewMoreButton = screen.getByText('View More Details');
    expect(viewMoreButton).toBeInTheDocument();
    
    fireEvent.click(viewMoreButton);
    expect(mockOnViewMore).toHaveBeenCalledTimes(1);
  });
  
  it('does not render view more button when onViewMore is not provided', () => {
    render(<TreeDetailsPopup tree={mockTree} onClose={mockOnClose} />);
    
    const viewMoreButton = screen.queryByText('View More Details');
    expect(viewMoreButton).not.toBeInTheDocument();
  });
});
