import { io } from 'socket.io-client';

// Se omitires o URL ou usares '/', o client usa a origem atual, 
// permitindo que o MSW intercete o tráfego do socket localmente.
export const socket = io({
  path: '/socket.io',
  autoConnect: true,
});