import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './app/routes';
import { worker } from './mocks/browser';
import { CartProvider } from './features/cart/context/CartContext';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

window.addEventListener('kurio:auth-changed', () => {
  queryClient.clear();
});

axios.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('kurio_token');
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  } else {
    config.headers.delete('Authorization');
  }

  const scenario = window.localStorage.getItem('kurio_mock_scenario');
  if (scenario) {
    config.headers.set('x-mock-scenario', scenario);
  } else {
    config.headers.delete('x-mock-scenario');
  }
  return config;
});

async function enableMocking() {
  if (import.meta.env.VITE_ENABLE_MOCKS !== 'false') {
    await worker.start({ onUnhandledRequest: 'bypass' });
  }
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
});