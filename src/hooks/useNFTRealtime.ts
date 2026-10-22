import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';

interface NFTUpdatePayload {
  id: string;
  priceETH: string;
  available: boolean;
  editionAvailable: number;
  version: number;
}

interface CachedNFT {
  id: string;
  priceETH: string;
  available?: number;
  version?: number;
}

interface CachedNFTResponse {
  data: CachedNFT[];
}

export function useNFTRealtime() {
  const queryClient = useQueryClient();
  const [priceAlert, setPriceAlert] = useState<string | null>(null);

  useEffect(() => {
    console.info('[realtime] effect');
    const token = window.localStorage.getItem('kurio_token');
    const socket = io(window.location.origin, {
      path: '/socket.io/',
      transports: ['websocket'],
      auth: { token },
      forceNew: true,
    });
    socket.io.on('open', () => console.info('[realtime] engine open'));
    socket.io.on('error', (error) => console.error('[realtime] manager error', error.message));
    socket.io.on('packet', (packet) => console.info('[realtime] packet', packet.type, packet.data));
    const versions = new Map<string, number>();

    const onConnect = () => {
      console.info('[realtime] connected', window.localStorage.getItem('kurio_mock_scenario'));
      void queryClient.invalidateQueries({ queryKey: ['nfts'] });
      void queryClient.invalidateQueries({ queryKey: ['nft'] });
      void queryClient.invalidateQueries({ queryKey: ['cart'] });
      const scenario = window.localStorage.getItem('kurio_mock_scenario');
      if (scenario?.startsWith('socket-')) socket.emit('mock.trigger', scenario);
    };

    const onNFTUpdate = (data: NFTUpdatePayload) => {
      console.info('[realtime] update', data);
      if (window.localStorage.getItem('kurio_token') !== token) return;
      const cachedVersion = queryClient.getQueriesData<CachedNFTResponse>({ queryKey: ['nfts'] })
        .flatMap(([, result]) => result?.data ?? [])
        .find((nft) => nft.id === data.id)?.version ?? 0;
      if (Math.max(versions.get(data.id) ?? 0, cachedVersion) >= data.version) return;
      versions.set(data.id, data.version);

      queryClient.setQueriesData<CachedNFTResponse>({ queryKey: ['nfts'] }, (current) =>
        current
          ? {
              ...current,
              data: current.data.map((nft) =>
                nft.id === data.id
                  ? { ...nft, priceETH: data.priceETH, available: data.editionAvailable, version: data.version }
                  : nft,
              ),
            }
          : current,
      );
      void queryClient.invalidateQueries({ queryKey: ['nft', data.id] });
      void queryClient.invalidateQueries({ queryKey: ['cart'] });
      window.dispatchEvent(new CustomEvent('kurio:nft-updated', { detail: data }));
      setPriceAlert(
        data.available
          ? `A cotação do NFT ${data.id} mudou para ${data.priceETH} ETH.`
          : `O NFT ${data.id} está esgotado.`,
      );
    };

    socket.on('connect', onConnect);
    socket.on('nft.updated', onNFTUpdate);
    socket.on('connect_error', (error) => console.error('[realtime] connect error', error.message));
    socket.on('disconnect', (reason) => console.info('[realtime] disconnect', reason));
    return () => {
      socket.off('connect', onConnect);
      socket.off('nft.updated', onNFTUpdate);
      socket.disconnect();
    };
  }, [queryClient]);

  return { priceAlert, clearAlert: () => setPriceAlert(null) };
}
