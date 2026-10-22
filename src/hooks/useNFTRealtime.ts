import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';

interface NFTUpdatePayload {
  id: string;
  priceETH: string;
  available: boolean;
  version: number;
}

export function useNFTRealtime() {
  const queryClient = useQueryClient();
  const [priceAlert, setPriceAlert] = useState<string | null>(null);

  useEffect(() => {
    const socket: Socket = io('http://localhost:5176', {
      transports: ['websocket'],
      autoConnect: true,
    });

    socket.on('nft.updated', (data: NFTUpdatePayload) => {
      console.log('[Socket.IO] Evento nft.updated recebido:', data);

      // Invalida o cache do TanStack Query para atualizar os dados automaticamente
      queryClient.invalidateQueries({ queryKey: ['nfts'] });

      setPriceAlert(`Atenção: A cotação do NFT ${data.id} mudou para ${data.priceETH} ETH!`);
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

  return { priceAlert, clearAlert: () => setPriceAlert(null) };
}