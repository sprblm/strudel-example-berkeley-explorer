import { useState } from 'react';
import { AutoComplete } from 'antd';

interface SearchInputProps {
  onSearch: (searchText: string) => void;
  onInputChange: () => void;
  suggestions: string[];
}

export default function SearchInput({
  onSearch,
  onInputChange,
  suggestions,
}: SearchInputProps) {
  const [value, setValue] = useState('');

  const options = suggestions.map((suggestion) => ({
    value: suggestion,
    label: suggestion,
  }));

  const handleSelect = (searchText: string) => {
    setValue(searchText);
    onSearch(searchText);
  };

  return (
    <AutoComplete
      options={options}
      value={value}
      onSelect={handleSelect}
      onSearch={(value) => {
        setValue(value);
        onInputChange();
      }}
      placeholder="Search datasets..."
      style={{ width: '100%' }}
      aria-label="Search input"
    >
      <input 
        title="Search input"
        placeholder="Search datasets..."
        aria-label="Search input"
      />
    </AutoComplete>
  );
}
