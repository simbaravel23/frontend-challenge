import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from '@/features/cart/context/CartContext';
import App from './App';
import './index.css';

// Inicializa o MSW em ambiente de desenvolvimento
async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');
    return worker.start({
      onUnhandledRequest: 'bypass',
    });
  }
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