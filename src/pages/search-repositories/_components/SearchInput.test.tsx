import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchInput from './SearchInput';

// Mock the Icons since they might cause issues in tests
vi.mock('../../../components/Icons', () => ({
  SearchIcon: () => <div data-testid="search-icon" />,
}));

describe('SearchInput', () => {
  const mockOnSearch = vi.fn();
  const mockOnInputChange = vi.fn();
  const mockSuggestions = ['climate data', 'air quality', 'tree inventory', 'water quality'];
  
  const defaultProps = {
    onSearch: mockOnSearch,
    onInputChange: mockOnInputChange,
    suggestions: mockSuggestions,
  };
  
  beforeEach(() => {
    mockOnSearch.mockClear();
    mockOnInputChange.mockClear();
  });
  
  it('renders the search input correctly', () => {
    render(<SearchInput {...defaultProps} />);
    
    // Check if the search input is rendered
    expect(screen.getByPlaceholderText('Search datasets...')).toBeInTheDocument();
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
  });
  
  it('updates input value when user types', async () => {
    const user = userEvent.setup();
    render(<SearchInput {...defaultProps} />);
    
    // Find the input and type in it
    const input = screen.getByPlaceholderText('Search datasets...');
    await user.type(input, 'climate');
    
    // Check if the input value is updated
    expect(input).toHaveValue('climate');
    
    // Check if onInputChange was called
    expect(mockOnInputChange).toHaveBeenCalled();
  });
  
  it('shows suggestions when typing matching text', async () => {
    const user = userEvent.setup();
    render(<SearchInput {...defaultProps} />);
    
    // Find the input and type in it
    const input = screen.getByPlaceholderText('Search datasets...');
    await user.type(input, 'climate');
    
    // Check if the suggestion is shown
    expect(screen.getByText('climate data')).toBeInTheDocument();
  });
  
  it('does not show suggestions for non-matching text', async () => {
    const user = userEvent.setup();
    render(<SearchInput {...defaultProps} />);
    
    // Find the input and type in it
    const input = screen.getByPlaceholderText('Search datasets...');
    await user.type(input, 'xyz');
    
    // Check that no suggestions are shown
    expect(screen.queryByText('climate data')).not.toBeInTheDocument();
    expect(screen.queryByText('air quality')).not.toBeInTheDocument();
    expect(screen.queryByText('tree inventory')).not.toBeInTheDocument();
  });
  
  it('calls onSearch when Enter key is pressed', async () => {
    const user = userEvent.setup();
    render(<SearchInput {...defaultProps} />);
    
    // Find the input, type in it, and press Enter
    const input = screen.getByPlaceholderText('Search datasets...');
    await user.type(input, 'climate');
    await user.keyboard('{Enter}');
    
    // Check if onSearch was called with the input value
    expect(mockOnSearch).toHaveBeenCalledWith('climate');
  });
  
  it('selects a suggestion when clicked', async () => {
    const user = userEvent.setup();
    render(<SearchInput {...defaultProps} />);
    
    // Find the input and type in it to show suggestions
    const input = screen.getByPlaceholderText('Search datasets...');
    await user.type(input, 'air');
    
    // Find and click on a suggestion
    const suggestion = screen.getByText('air quality');
    await user.click(suggestion);
    
    // Check if the input value is updated to the suggestion
    expect(input).toHaveValue('air quality');
    
    // Check if onSearch was called with the suggestion
    expect(mockOnSearch).toHaveBeenCalledWith('air quality');
  });
  
  it('closes suggestions when clicking outside', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <SearchInput {...defaultProps} />
        <div data-testid="outside-element">Outside</div>
      </div>
    );
    
    // Find the input and type in it to show suggestions
    const input = screen.getByPlaceholderText('Search datasets...');
    await user.type(input, 'air');
    
    // Verify suggestion is shown
    expect(screen.getByText('air quality')).toBeInTheDocument();
    
    // Click outside
    await user.click(screen.getByTestId('outside-element'));
    
    // Check that suggestions are no longer shown
    expect(screen.queryByText('air quality')).not.toBeInTheDocument();
  });
  
  it('filters suggestions based on input value', async () => {
    const user = userEvent.setup();
    render(<SearchInput {...defaultProps} />);
    
    // Find the input and type in it
    const input = screen.getByPlaceholderText('Search datasets...');
    await user.type(input, 'tree');
    
    // Check that only matching suggestions are shown
    expect(screen.getByText('tree inventory')).toBeInTheDocument();
    expect(screen.queryByText('climate data')).not.toBeInTheDocument();
    expect(screen.queryByText('air quality')).not.toBeInTheDocument();
  });
});
