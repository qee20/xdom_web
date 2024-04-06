import React from 'react';
import { Alert } from 'react-bootstrap';

export const AlertComponent = ({ message, variant, onClose }) => {
  return (
    <Alert variant={variant} onClose={onClose} dismissible>
      {message}
    </Alert>
  );
};
