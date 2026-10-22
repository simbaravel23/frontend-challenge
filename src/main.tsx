import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { CartProvider } from '@/features/cart/context/CartContext';
import App from './App';
import './index.css';

axios.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('kurio_token');
  const scenario = window.localStorage.getItem('kurio_mock_scenario');

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  } else {
    config.headers.delete('Authorization');
  }

  if (scenario) {
    config.headers.set('x-mock-scenario', scenario);
  } else {
    config.headers.delete('x-mock-scenario');
  }

  return config;
});


// Inicializa o MSW independentemente de ser dev ou produção (ideal para SPAs baseadas em mocks)
async function enableMocking() {
  const { worker } = await import('./mocks/browser');
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

const queryClient = new QueryClient();

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <App />
        </CartProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
});