import { ws } from 'msw';

// Simulação de servidor WebSocket escutando na porta padrão do Socket.IO
const socketServer = ws.link('ws://localhost:5173'); // ou a porta onde o teu servidor vite roda (ex: :5176)

export const socketHandlers = [
  socketServer.addEventListener('connection', ({ client }) => {
    console.log('[MSW Socket.IO] Cliente conectado:', client.id);

    // Evento de simulação: Dispara atualização de preço/disponibilidade do NFT a cada 15 segundos
    const interval = setInterval(() => {
      client.send(
        JSON.stringify({
          type: 'nft.updated',
          payload: {
            id: 'emerald-ape-042',
            priceETH: '1.45', // Preço atualizado em tempo real
            available: true,
            version: Date.now(),
          },
        })
      );
    }, 15000);

    client.addEventListener('disconnect', () => {
      clearInterval(interval);
      console.log('[MSW Socket.IO] Cliente desconectado');
    });
  }),
];