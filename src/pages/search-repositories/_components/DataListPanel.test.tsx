import React from 'react';
import '@testing-library/jest-dom/vitest';
import { expect, test, describe, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataListPanel } from './DataListPanel';
import { FilterContextProvider } from '../../../components/FilterContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useListQuery } from '../../../utils/useListQuery';

const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
};

interface MockDataItem {
  id: string;
  name: string;
  date: string;
  description: string;
}

const mockData: MockDataItem[] = [
  {
    id: '1',
    name: 'Dataset A',
    date: '2023-01-01',
    description: 'Test dataset A'
  },
  {
    id: '2', 
    name: 'Dataset B',
    date: '2023-02-01',
    description: 'Test dataset B'
  }
];

vi.mock('../../../utils/useListQuery', () => ({
  useListQuery: vi.fn(() => ({
    data: { 
      data: mockData,
      total: mockData.length
    },
    isPending: false,
    isError: false,
    error: null
  }))
}));

describe('DataListPanel', () => {
  test('renders loading state', async () => {
    (useListQuery as vi.Mock).mockReturnValue({
      data: null,
      isPending: true,
      isError: false,
      error: null
    });

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <FilterContextProvider>
          <DataListPanel
            onToggleFiltersPanel={vi.fn()}
            previewItem={null}
            setPreviewItem={vi.fn()}
          />
        </FilterContextProvider>
      </QueryClientProvider>
    );
    
    const spinner = await screen.findByRole('progressbar');
    expect(spinner).toBeInTheDocument();
  });

  test('sorts by name ascending', async () => {
    (useListQuery as vi.Mock).mockReturnValue({
      data: mockData,
      isPending: false,
      isError: false,
      error: null
    });

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <FilterContextProvider>
          <DataListPanel
            onToggleFiltersPanel={vi.fn()}
            previewItem={null}
            setPreviewItem={vi.fn()}
          />
        </FilterContextProvider>
      </QueryClientProvider>
    );
    
    // Find sort button by its full accessible name
    const sortButton = await screen.findByRole('button', { name: /sort by date/i });
    fireEvent.click(sortButton);
    
    // Verify sorted data
    const items = await screen.findAllByRole('listitem');
    expect(items[0]).toHaveTextContent('Dataset A');
  });

  test('sorts by date descending', async () => {
    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <FilterContextProvider>
          <DataListPanel
            onToggleFiltersPanel={vi.fn()}
            previewItem={null}
            setPreviewItem={vi.fn()}
          />
        </FilterContextProvider>
      </QueryClientProvider>
    );

    // Open sort dropdown
    fireEvent.click(screen.getByText('Sort'));

    // Select date sort
    fireEvent.click(screen.getByText('Date'));

    // Toggle to descending
    fireEvent.click(screen.getByText('Date'));

    // Verify sorted order
    const items = await screen.findAllByTestId('data-list-card');
    expect(items[0]).toHaveTextContent('Dataset B');
    expect(items[1]).toHaveTextContent('Dataset A');
  });

  test('handles pagination correctly', async () => {
    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <FilterContextProvider>
          <DataListPanel
            onToggleFiltersPanel={vi.fn()}
            previewItem={null}
            setPreviewItem={vi.fn()}
          />
        </FilterContextProvider>
      </QueryClientProvider>
    );

    // Verify initial page
    let items = await screen.findAllByTestId('data-list-card');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('Dataset A');

    // Go to next page
    fireEvent.click(screen.getByLabelText('Go to page 2'));
    items = await screen.findAllByTestId('data-list-card');
    expect(items).toHaveLength(0);
  });

  test('filters data based on search term', async () => {
    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <FilterContextProvider>
          <DataListPanel
            onToggleFiltersPanel={vi.fn()}
            previewItem={null}
            setPreviewItem={vi.fn()}
          />
        </FilterContextProvider>
      </QueryClientProvider>
    );

    // Enter search term
    const searchInput = screen.getByLabelText('Search');
    fireEvent.change(searchInput, { target: { value: 'Dataset B' } });

    // Verify filtered results
    const items = await screen.findAllByTestId('data-list-card');
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveTextContent('Dataset B');
  });

  test('displays error message when data fetching fails', async () => {
    // Mock error state
    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <FilterContextProvider>
          <DataListPanel
            onToggleFiltersPanel={vi.fn()}
            previewItem={null}
            setPreviewItem={vi.fn()}
          />
        </FilterContextProvider>
      </QueryClientProvider>
    );

    const errorMessage = await screen.findByText(/error fetching data/i);
    expect(errorMessage).toBeInTheDocument();
  });

  test('interacts with FilterContext correctly', async () => {
    const mockSetFilter = vi.fn();

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <FilterContextProvider>
          <DataListPanel
            onToggleFiltersPanel={vi.fn()}
            previewItem={null}
            setPreviewItem={mockSetFilter}
          />
        </FilterContextProvider>
      </QueryClientProvider>
    );

    // Verify filter interaction
    const firstItem = await screen.findByText('Dataset A');
    fireEvent.click(firstItem);
    expect(mockSetFilter).toHaveBeenCalled();
  });
});
