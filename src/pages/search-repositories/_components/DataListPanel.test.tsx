// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import '@testing-library/jest-dom/vitest';
import { expect, test, describe, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataListPanel } from './DataListPanel';
import { FilterContextProvider } from '../../../components/FilterContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
};

describe('DataListPanel', () => {
  test('renders loading state', () => {
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
    expect(screen.getAllByTestId('skeleton-loader')).toHaveLength(10);
  });

  test('sorts by name ascending', async () => {
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

    // Select name sort
    fireEvent.click(screen.getByText('Name'));

    // Verify sorted order
    const items = await screen.findAllByTestId('data-list-card');
    expect(items[0]).toHaveTextContent('Dataset A');
    expect(items[1]).toHaveTextContent('Dataset B');
    expect(items[2]).toHaveTextContent('Dataset C');
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
    expect(items[0]).toHaveTextContent('Dataset A');
    expect(items[1]).toHaveTextContent('Dataset B');
    expect(items[2]).toHaveTextContent('Dataset C');
  });

  test('handles pagination correctly', async () => {
    const mockData = Array.from({ length: 50 }, (_, i) => ({
      id: i.toString(),
      name: `Dataset ${i}`,
      date: '2025-01-01',
    }));

    // Mock the API response
    vi.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockData),
        ok: true,
        status: 200,
        headers: new Headers(),
        redirected: false,
        statusText: 'OK',
        type: 'basic',
        url: '',
        clone: () => ({}) as Response,
        body: null,
        bodyUsed: false,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        blob: () => Promise.resolve(new Blob()),
        formData: () => Promise.resolve(new FormData()),
        text: () => Promise.resolve(''),
      } as Response)
    );

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
    expect(items).toHaveLength(10);
    expect(items[0]).toHaveTextContent('Dataset 0');

    // Go to next page
    fireEvent.click(screen.getByLabelText('Go to page 2'));
    items = await screen.findAllByTestId('data-list-card');
    expect(items).toHaveLength(10);
    expect(items[0]).toHaveTextContent('Dataset 10');
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
