import { toSocketIo } from '@mswjs/socket.io-binding';
import { ws } from 'msw';
import { mockNFTs } from './catalogData';

const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const socketServer = ws.link(`${protocol}//${window.location.host}/`);
let version = Math.max(...mockNFTs.map((nft) => nft.version));

function emitNFTUpdate(client: ReturnType<typeof toSocketIo>['client'], updateVersion: number) {
  const nft = mockNFTs[0];
  nft.priceETH = updateVersion % 2 === 0 ? '1.45' : '1.19';
  nft.version = updateVersion;
  client.emit('nft.updated', {
    id: nft.id,
    priceETH: nft.priceETH,
    available: nft.available > 0,
    editionAvailable: nft.available,
    version: updateVersion,
  });
}

export const socketHandlers = [
  socketServer.addEventListener('connection', (connection) => {
    const { client } = toSocketIo(connection);
    client.on('mock.trigger', (_event, scenario: string) => {
      console.info('[socket mock] trigger', scenario);
      if (scenario === 'socket-update') {
        version += 1;
        emitNFTUpdate(client, version);
      } else if (scenario === 'socket-duplicate') {
        version += 1;
        emitNFTUpdate(client, version);
        emitNFTUpdate(client, version);
      } else if (scenario === 'socket-old-event') {
        version += 1;
        emitNFTUpdate(client, version - 1);
        emitNFTUpdate(client, version);
      }
    });
    const interval = window.setInterval(() => {
      version += 1;
      emitNFTUpdate(client, version);
    }, 15000);

    connection.server.addEventListener('close', () => {
      window.clearInterval(interval);
    });
  }),
];
