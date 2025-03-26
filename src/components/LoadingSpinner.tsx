import { CircularProgress } from '@mui/material';

export const LoadingSpinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
    <CircularProgress />
  </div>
);
