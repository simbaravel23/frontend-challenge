import { toSocketIo } from '@mswjs/socket.io-binding';
import { ws } from 'msw';
import { mockNFTs } from './handlers';

const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const socketServer = ws.link(`${protocol}//${window.location.host}/socket.io/`);

export const socketHandlers = [
  socketServer.addEventListener('connection', (connection) => {
    const { server } = toSocketIo(connection);
    let version = Math.max(...mockNFTs.map((nft) => nft.version));
    const interval = window.setInterval(() => {
      const nft = mockNFTs[0];
      version += 1;
      nft.priceETH = version % 2 === 0 ? '1.45' : '1.19';
      nft.version = version;
      server.emit('nft.updated', {
        id: nft.id,
        priceETH: nft.priceETH,
        available: nft.available > 0,
        editionAvailable: nft.available,
        version,
      });
    }, 15000);

    connection.server.addEventListener('close', () => {
      window.clearInterval(interval);
    });
  }),
];
