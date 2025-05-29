import React from 'react'; // Keep React if Wrapper or other React-specific setup is used.
import '@testing-library/jest-dom';

export const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return children;
};
