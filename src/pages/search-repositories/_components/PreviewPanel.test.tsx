import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PreviewPanel } from './PreviewPanel';
import { BrowserRouter } from 'react-router-dom';

// Mock the DataGrid component from MUI
vi.mock('@mui/x-data-grid', () => ({
  DataGrid: ({ rows, columns }: any) => (
    <div data-testid="data-grid">
      <span>DataGrid Mock</span>
      <span>Rows: {rows.length}</span>
    </div>
  ),
  GridColDef: vi.fn(),
}));

// Mock the taskflow config
vi.mock('../_config/taskflow.config', () => ({
  taskflow: {
    pages: {
      index: {
        cardFields: {
          titleField: 'title',
          contentField: 'summary',
        },
      },
    },
  },
}));

// Mock icons
vi.mock('@mui/icons-material/Close', () => ({
  default: () => <div data-testid="close-icon" />,
}));

vi.mock('@mui/icons-material/Download', () => ({
  default: () => <div data-testid="download-icon" />,
}));

vi.mock('@mui/icons-material/Bookmark', () => ({
  default: () => <div data-testid="bookmark-icon" />,
}));

vi.mock('@mui/icons-material/Share', () => ({
  default: () => <div data-testid="share-icon" />,
}));

describe('PreviewPanel', () => {
  const mockPreviewItem = {
    id: '123',
    title: 'Test Dataset',
    summary: 'This is a test dataset summary.',
    source: 'Test Source',
    publication_date: '2023-05-15',
    temporal_coverage: '2020-2023',
    spatial_coverage: 'Berkeley, CA',
    attached_files: [
      { file_name: 'test.csv', file_size: '10 MB' },
      { file_name: 'metadata.json', file_size: '2 KB' },
    ],
  };

  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders the preview panel with dataset information', () => {
    render(
      <BrowserRouter>
        <PreviewPanel previewItem={mockPreviewItem} onClose={mockOnClose} />
      </BrowserRouter>
    );

    // Check if the title is displayed
    expect(screen.getByText('Test Dataset')).toBeInTheDocument();
    
    // Check if the summary is displayed
    expect(screen.getByText('This is a test dataset summary.')).toBeInTheDocument();
    
    // Check if the source is displayed
    expect(screen.getByText('Test Source')).toBeInTheDocument();
    
    // Check if temporal and spatial coverage are displayed
    expect(screen.getByText('2020-2023')).toBeInTheDocument();
    expect(screen.getByText('Berkeley, CA')).toBeInTheDocument();
    
    // Check if the close button is rendered
    expect(screen.getByTestId('close-icon')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <PreviewPanel previewItem={mockPreviewItem} onClose={mockOnClose} />
      </BrowserRouter>
    );

    // Find and click the close button
    const closeButton = screen.getByTestId('close-icon').closest('button');
    if (closeButton) {
      await user.click(closeButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    }
  });

  it('renders action buttons', () => {
    render(
      <BrowserRouter>
        <PreviewPanel previewItem={mockPreviewItem} onClose={mockOnClose} />
      </BrowserRouter>
    );

    // Check if the action buttons are rendered
    expect(screen.getByText('Bookmark')).toBeInTheDocument();
    expect(screen.getByText('Share')).toBeInTheDocument();
  });

  it('renders the data grid for attached files', () => {
    render(
      <BrowserRouter>
        <PreviewPanel previewItem={mockPreviewItem} onClose={mockOnClose} />
      </BrowserRouter>
    );

    // Check if the attached files section is rendered
    expect(screen.getByText('Attached Files')).toBeInTheDocument();
    expect(screen.getByTestId('data-grid')).toBeInTheDocument();
    expect(screen.getByText('Rows: 4')).toBeInTheDocument(); // Using our mock implementation
  });

  it('handles missing data gracefully', () => {
    const incompleteItem = {
      id: '456',
      title: 'Incomplete Dataset',
      // Missing other fields
    };

    render(
      <BrowserRouter>
        <PreviewPanel previewItem={incompleteItem} onClose={mockOnClose} />
      </BrowserRouter>
    );

    // Check if the title is still displayed
    expect(screen.getByText('Incomplete Dataset')).toBeInTheDocument();
    
    // The component should not crash due to missing fields
    expect(screen.getByTestId('close-icon')).toBeInTheDocument();
  });

  it('renders a link to the dataset detail page', () => {
    render(
      <BrowserRouter>
        <PreviewPanel previewItem={mockPreviewItem} onClose={mockOnClose} />
      </BrowserRouter>
    );

    // Check if the title is a link
    const titleLink = screen.getByText('Test Dataset').closest('a');
    expect(titleLink).toHaveAttribute('href', '/123');
  });
});
