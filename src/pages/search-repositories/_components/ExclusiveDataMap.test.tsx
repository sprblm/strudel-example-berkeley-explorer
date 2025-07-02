/**
 * Unit tests for the ExclusiveDataMap component.
 * Verifies exclusive layer selection behavior.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ExclusiveDataMap from './ExclusiveDataMap';

// Mock the BerkeleyDataMap component to avoid rendering actual map
vi.mock('../../../components/BerkeleyDataMap', () => ({
  default: ({ activeLayers }) => (
    <div data-testid="berkeley-data-map">
      <div data-testid="active-layers">{JSON.stringify(activeLayers)}</div>
    </div>
  ),
}));

describe('ExclusiveDataMap', () => {
  it('renders with no active layers when none provided', () => {
    render(<ExclusiveDataMap />);
    
    const activeLayers = JSON.parse(screen.getByTestId('active-layers').textContent || '[]');
    expect(activeLayers).toEqual([]);
  });

  it('enforces exclusive layer selection by taking only first layer', () => {
    render(<ExclusiveDataMap activeLayers={['trees', 'air', 'locations']} />);
    
    const activeLayers = JSON.parse(screen.getByTestId('active-layers').textContent || '[]');
    expect(activeLayers).toEqual(['trees']);
    expect(activeLayers).not.toContain('air');
    expect(activeLayers).not.toContain('locations');
  });

  it('updates layer when activeLayers prop changes', () => {
    const { rerender } = render(<ExclusiveDataMap activeLayers={['trees']} />);
    
    let activeLayers = JSON.parse(screen.getByTestId('active-layers').textContent || '[]');
    expect(activeLayers).toEqual(['trees']);
    
    // Update prop to different layer
    rerender(<ExclusiveDataMap activeLayers={['air']} />);
    
    activeLayers = JSON.parse(screen.getByTestId('active-layers').textContent || '[]');
    expect(activeLayers).toEqual(['air']);
    
    // Multiple layers should still only use the first
    rerender(<ExclusiveDataMap activeLayers={['locations', 'trees']} />);
    
    activeLayers = JSON.parse(screen.getByTestId('active-layers').textContent || '[]');
    expect(activeLayers).toEqual(['locations']);
  });
});
