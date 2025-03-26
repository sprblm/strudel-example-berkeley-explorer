import { Alert } from '@mui/material';

interface ErrorAlertProps {
  message: string;
}

export const ErrorAlert = ({ message }: ErrorAlertProps) => (
  <Alert severity="error" sx={{ margin: 2 }}>
    {message}
  </Alert>
);
