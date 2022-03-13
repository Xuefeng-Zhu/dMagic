import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import './index.css';
import App from './App';
import { StateContextProvider } from './contexts/StateContextProvider';
import { Web3ContextProvider } from './contexts/Web3ContextProvider';

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Web3ContextProvider>
        <StateContextProvider>
          <App />
        </StateContextProvider>
      </Web3ContextProvider>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
