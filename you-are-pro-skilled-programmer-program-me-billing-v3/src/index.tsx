
import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from './App';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}

// Fix for local file access by adding event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  if (container) {
    const root = createRoot(container);
    root.render(
      <QueryClientProvider client={queryClient}>
        <App />
    </QueryClientProvider>
    );
  }
});
