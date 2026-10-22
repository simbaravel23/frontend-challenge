import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';
import { socketHandlers } from './socketHandlers';

// Configura o worker do MSW com os handlers REST e Socket.IO
export const worker = setupWorker(...handlers, ...socketHandlers);