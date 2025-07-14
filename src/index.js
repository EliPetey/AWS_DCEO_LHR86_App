import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Amplify } from 'aws-amplify';

// Configure Amplify (will be populated after backend setup)
try {
  const awsconfig = require('./aws-exports').default;
  Amplify.configure(awsconfig);
} catch (error) {
  console.log('AWS config not found, running in development mode');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);