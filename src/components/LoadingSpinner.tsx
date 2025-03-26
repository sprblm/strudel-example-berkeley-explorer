import { CircularProgress } from '@mui/material';
import './LoadingSpinner.css';

export const LoadingSpinner = () => (
  <div className="loading-spinner-container">
    <CircularProgress />
  </div>
);
