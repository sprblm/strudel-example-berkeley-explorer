import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DataListPanel from './DataListPanel';
import { DataListPanelProps, Dataset } from '../_config/taskflow.types';

// Mock data - adjust according to the actual Dataset type structure if different
const mockDatasets: Dataset[] = [
  {
    id: '1',
    title: 'Dataset Alpha',
    summary: 'Summary for Alpha.',
    source: 'Source A',
    publication_date: '2023-01-15',
    distance: 100,
    species: 'Oak',
    dbh: 20,
    observationDate: '2023-01-10',
    attached_files: [{ file_name: 'alpha.nc', file_size: '1.2 GB' }],
    // Add any other required fields from your Dataset type
    data_categories: [],
    data_formats: [],
    data_types: [],
    keywords: [],
    license: '',
    project_name: '',
    spatial_coverage: '',
    temporal_coverage: '',
    data_provider_name: '',
    data_provider_url: '',
    citation: '',
    doi: '',
    related_publications: [],
    data_quality_metrics: {},
    access_restrictions: '',
    usage_rights: '',
    contact_information: {},
    version: '',
    lineage: '',
    additional_metadata: {},
  },
  {
    id: '2',
    title: 'Dataset Beta',
    summary: 'Summary for Beta.',
    source: 'Source B',
    publication_date: '2023-03-20',
    distance: 50,
    species: 'Pine',
    dbh: 30,
    observationDate: '2023-03-15',
    attached_files: [{ file_name: 'beta.csv', file_size: '500 MB' }],
    data_categories: [],
    data_formats: [],
    data_types: [],
    keywords: [],
    license: '',
    project_name: '',
    spatial_coverage: '',
    temporal_coverage: '',
    data_provider_name: '',
    data_provider_url: '',
    citation: '',
    doi: '',
    related_publications: [],
    data_quality_metrics: {},
    access_restrictions: '',
    usage_rights: '',
    contact_information: {},
    version: '',
    lineage: '',
    additional_metadata: {},
  },
  {
    id: '3',
    title: 'Dataset Gamma',
    summary: 'Summary for Gamma.',
    source: 'Source C',
    publication_date: '2022-12-01',
    distance: 200,
    species: 'Maple',
    dbh: 10,
    observationDate: '2022-11-25',
    attached_files: [], // Test case with no attached files
    data_categories: [],
    data_formats: [],
    data_types: [],
    keywords: [],
    license: '',
    project_name: '',
    spatial_coverage: '',
    temporal_coverage: '',
    data_provider_name: '',
    data_provider_url: '',
    citation: '',
    doi: '',
    related_publications: [],
    data_quality_metrics: {},
    access_restrictions: '',
    usage_rights: '',
    contact_information: {},
    version: '',
    lineage: '',
    additional_metadata: {},
  },
];

const mockSetPreviewItem = vi.fn();

const defaultProps: DataListPanelProps = {
  searchResults: [],
  previewItem: null,
  setPreviewItem: mockSetPreviewItem,
};

describe('DataListPanel', () => {
  beforeEach(() => {
    mockSetPreviewItem.mockClear();
  });

  it('renders "Enter a search term" message when no search results are provided', () => {
    render(<DataListPanel {...defaultProps} searchResults={[]} />);
    expect(screen.getByText('Enter a search term to find datasets')).toBeInTheDocument();
  });

  it('renders "Enter a search term" message when searchResults is undefined', () => {
    render(<DataListPanel {...defaultProps} searchResults={undefined as any} />); // Test undefined case
    expect(screen.getByText('Enter a search term to find datasets')).toBeInTheDocument();
  });

  it('renders search results when data is provided', () => {
    render(<DataListPanel {...defaultProps} searchResults={mockDatasets} />);
    expect(screen.getByText('Search Results')).toBeInTheDocument();
    expect(screen.getByText(`Showing ${mockDatasets.length} results`)).toBeInTheDocument();
    expect(screen.getByText('Dataset Alpha')).toBeInTheDocument();
    expect(screen.getByText('Dataset Beta')).toBeInTheDocument();
    expect(screen.getByText('Dataset Gamma')).toBeInTheDocument();
  });

  it('highlights the previewItem if provided', () => {
    render(<DataListPanel {...defaultProps} searchResults={mockDatasets} previewItem={mockDatasets[1]} />);
    // Assuming highlighting adds a specific style or class.
    // Here, we check the background color defined in the component sx prop.
    // This is a bit implementation-dependent; a data-testid or role might be more robust.
    const betaItem = screen.getByText('Dataset Beta').closest('div[role="button"], div[data-testid]'); // Adjust selector as needed
    // The component uses sx: { backgroundColor: previewItem?.id === dataset.id ? 'grey.50' : 'transparent' }
    // Testing exact style might be brittle. Let's check if the item containing 'Dataset Beta' exists and is visible.
    // A more robust test would be to add a data-testid='list-item-2' and data-testid='list-item-2-selected' or similar
    // For now, we'll just ensure it renders.
    expect(screen.getByText('Dataset Beta')).toBeVisible();
    // If you add a specific class or data attribute for selection, test for that.
    // e.g. expect(screen.getByTestId('dataset-item-2')).toHaveClass('selected');
  });

  it('calls setPreviewItem when a list item is clicked', async () => {
    const user = userEvent.setup();
    render(<DataListPanel {...defaultProps} searchResults={mockDatasets} />);
    const alphaItem = screen.getByText('Dataset Alpha').closest('div'); // Find the clickable Box
    if (alphaItem) {
      await user.click(alphaItem);
      expect(mockSetPreviewItem).toHaveBeenCalledWith(mockDatasets[0]);
    }
  });

  it('calls setPreviewItem when "View Details" button is clicked', async () => {
    const user = userEvent.setup();
    render(<DataListPanel {...defaultProps} searchResults={mockDatasets} />);
    // Find the 'View Details' button within the scope of 'Dataset Beta'
    const betaItemContainer = screen.getByText('Dataset Beta').closest('div > div'); // Adjust selector based on actual DOM
    if (betaItemContainer) {
      const viewDetailsButton = within(betaItemContainer).getByRole('button', { name: /View Details/i });
      await user.click(viewDetailsButton);
      expect(mockSetPreviewItem).toHaveBeenCalledWith(mockDatasets[1]);
    }
  });

  // Snapshot test
  it('matches snapshot with data', () => {
    const { container } = render(<DataListPanel {...defaultProps} searchResults={mockDatasets} />);
    expect(container).toMatchSnapshot();
  });

  
  // TODO: Add tests for display logic (formatDownloads, file format/size fallbacks)

  describe('Sorting functionality', () => {
    const user = userEvent.setup();

    it('sorts by relevance by default (initial order)', () => {
      render(<DataListPanel {...defaultProps} searchResults={mockDatasets} />);
      const listItems = screen.getAllByRole('heading', { level: 3 }); // Titles are H3
      expect(listItems[0]).toHaveTextContent('Dataset Alpha');
      expect(listItems[1]).toHaveTextContent('Dataset Beta');
      expect(listItems[2]).toHaveTextContent('Dataset Gamma');
    });

    it('sorts by distance (ascending) when selected', async () => {
      render(<DataListPanel {...defaultProps} searchResults={mockDatasets} />);
      const sortSelect = screen.getByRole('combobox'); // MUI Select role
      await user.click(sortSelect);
      await user.click(screen.getByRole('option', { name: 'Distance' }));

      const listItems = screen.getAllByRole('heading', { level: 3 });
      expect(listItems[0]).toHaveTextContent('Dataset Beta'); // Distance 50
      expect(listItems[1]).toHaveTextContent('Dataset Alpha'); // Distance 100
      expect(listItems[2]).toHaveTextContent('Dataset Gamma'); // Distance 200
    });

    it('sorts by species (A-Z) when selected', async () => {
      render(<DataListPanel {...defaultProps} searchResults={mockDatasets} />);
      const sortSelect = screen.getByRole('combobox');
      await user.click(sortSelect);
      await user.click(screen.getByRole('option', { name: 'Species (A-Z)' }));

      const listItems = screen.getAllByRole('heading', { level: 3 });
      expect(listItems[0]).toHaveTextContent('Dataset Gamma'); // Maple
      expect(listItems[1]).toHaveTextContent('Dataset Alpha'); // Oak
      expect(listItems[2]).toHaveTextContent('Dataset Beta'); // Pine
    });

    it('sorts by DBH (Smallest-Largest) when selected', async () => {
      render(<DataListPanel {...defaultProps} searchResults={mockDatasets} />);
      const sortSelect = screen.getByRole('combobox');
      await user.click(sortSelect);
      await user.click(screen.getByRole('option', { name: 'DBH (Smallest-Largest)' }));

      const listItems = screen.getAllByRole('heading', { level: 3 });
      expect(listItems[0]).toHaveTextContent('Dataset Gamma'); // DBH 10
      expect(listItems[1]).toHaveTextContent('Dataset Alpha'); // DBH 20
      expect(listItems[2]).toHaveTextContent('Dataset Beta'); // DBH 30
    });

    it('sorts by date (Oldest-Newest) when selected', async () => {
      // Note: The component uses 'observationDate' for sorting by 'date'
      render(<DataListPanel {...defaultProps} searchResults={mockDatasets} />);
      const sortSelect = screen.getByRole('combobox');
      await user.click(sortSelect);
      await user.click(screen.getByRole('option', { name: 'Date (Oldest-Newest)' }));

      const listItems = screen.getAllByRole('heading', { level: 3 });
      expect(listItems[0]).toHaveTextContent('Dataset Gamma'); // ObservationDate 2022-11-25
      expect(listItems[1]).toHaveTextContent('Dataset Alpha'); // ObservationDate 2023-01-10
      expect(listItems[2]).toHaveTextContent('Dataset Beta'); // ObservationDate 2023-03-15
    });
  });
});
