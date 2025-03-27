import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { FilterContextProvider } from '../../../components/FilterContext';
import DataListPanel from './DataListPanel';
import { createTestQueryClient } from '../../../utils/testing.utils';
import { useListQuery } from '../../../utils/useListQuery';
import { vi } from 'vitest';

// Define mock data structure for testing
interface MockDataItem {
  id: string;
  name: string;
  date: string;
  description: string;
}

// Create mock data for testing
const mockData: MockDataItem[] = [
  {
    id: '1',
    name: 'Dataset A',
    date: '2023-01-01',
    description: 'Test dataset A',
  },
  {
    id: '2',
    name: 'Dataset B',
    date: '2023-02-01',
    description: 'Test dataset B',
  },
];

// Define complete Dataset interface matching the actual data structure
interface Dataset {
  id: string;
  title: string;
  summary: string;
  publication_date: string;
  citation: string;
  doi: string;
  source: string;
  tags: string[];
  category: string;
  point_of_contact: string;
  originator: string;
  metadata_contact: string;
  publisher: string;
  distributor: string;
  usgs_mission_area: string;
  communities: { title: string; url: string }[];
  associated_projects: { title: string; url: string }[];
  attached_files: {
    file_id: number;
    file_name: string;
    file_size: string;
    description: string;
  }[];
}

// Create a complete mock dataset for testing
const mockDataset = {
  id: 'test-id',
  title: 'Test Dataset',
  summary: 'Test summary',
  publication_date: '2023-01-01',
  citation: 'Test citation',
  doi: 'test-doi',
  source: 'Test source',
  tags: ['test'],
  category: 'test',
  point_of_contact: 'test@example.com',
  originator: 'Test Originator',
  metadata_contact: 'test@example.com',
  publisher: 'Test Publisher',
  distributor: 'Test Distributor',
  usgs_mission_area: 'Test Area',
  communities: [],
  associated_projects: [],
  attached_files: [],
};

// Add this above the test suite
const mockSearchResults: Dataset[] = [mockDataset];

// Mock the useListQuery hook for controlled testing
vi.mock('../../../utils/useListQuery', () => ({
  useListQuery: vi.fn(() => ({
    data: {
      data: mockData,
      total: mockData.length,
    },
    isPending: false,
    isError: false,
    error: null,
  })),
}));

// Main test suite for DataListPanel component
describe('DataListPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test loading state rendering
  it('renders loading state', async () => {
    // Mock loading state
    (useListQuery as vi.Mock).mockReturnValue({
      data: null,
      isPending: true,
      isError: false,
      error: null,
    });

    const mockSetPreviewItem = vi.fn();

    // Render component with test setup
    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <FilterContextProvider>
          <DataListPanel
            searchResults={mockSearchResults}
            previewItem={null}
            setPreviewItem={mockSetPreviewItem}
          />
        </FilterContextProvider>
      </QueryClientProvider>
    );

    // Verify loading spinner is shown
    const spinner = await screen.findByRole('progressbar');
    expect(spinner).toBeInTheDocument();
  });

  // Test sorting functionality
  it('sorts by name ascending', async () => {
    // Mock successful data fetch
    (useListQuery as vi.Mock).mockReturnValue({
      data: mockData,
      isPending: false,
      isError: false,
      error: null,
    });

    const mockSetPreviewItem = vi.fn();

    // Render component
    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <FilterContextProvider>
          <DataListPanel
            searchResults={mockSearchResults}
            previewItem={null}
            setPreviewItem={mockSetPreviewItem}
          />
        </FilterContextProvider>
      </QueryClientProvider>
    );

    // Test sorting interaction
    const sortButton = await screen.findByRole('button', {
      name: /sort by date/i,
    });
    fireEvent.click(sortButton);

    // Verify sorted order
    const items = await screen.findAllByRole('listitem');
    expect(items[0]).toHaveTextContent('Dataset A');
  });

  // Test error state handling
  it('displays error message when data fetching fails', async () => {
    // Mock error state
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const mockSetPreviewItem = vi.fn();

    // Render component
    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <FilterContextProvider>
          <DataListPanel
            searchResults={mockSearchResults}
            previewItem={null}
            setPreviewItem={mockSetPreviewItem}
          />
        </FilterContextProvider>
      </QueryClientProvider>
    );

    // Verify error message is shown
    const errorMessage = await screen.findByText(/error fetching data/i);
    expect(errorMessage).toBeInTheDocument();
  });

  // Test snapshot matching
  it('should render dataset items', () => {
    const mockPreviewItem = mockDataset;
    const mockSetPreviewItem = vi.fn();

    // Render component and verify snapshot
    const { container } = render(
      <QueryClientProvider client={createTestQueryClient()}>
        <FilterContextProvider>
          <DataListPanel
            searchResults={[mockDataset]}
            previewItem={mockPreviewItem}
            setPreviewItem={mockSetPreviewItem}
          />
        </FilterContextProvider>
      </QueryClientProvider>
    );

    expect(container).toMatchSnapshot();
  });
});
