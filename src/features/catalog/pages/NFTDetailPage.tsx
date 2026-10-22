import { useState } from 'react';
import { useParams, Link, useNavigate } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { useCart } from '@/features/cart/context/CartContext';
import { useNFTRealtime } from '@/hooks/useNFTRealtime';

interface NFTDetail {
  id: string;
  name: string;
  description: string;
  priceETH: string;
  edition: string;
  rarity: string;
  imageUrl: string;
  category: string;
  creator: string;
  owner: string;
  available: number;
  favorite: boolean;
  version: number;
}

export function NFTDetailPage() {
  const { id } = useParams({ from: '/nfts/$id' });
  const { cart, addToCart, removeFromCart } = useCart();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [favoriteError, setFavoriteError] = useState('');
  const { priceAlert } = useNFTRealtime();

  const { data: nft, isLoading, error } = useQuery({
    queryKey: ['nft', id],
    retry: false,
    queryFn: async () => {
      const response = await axios.get<{ data: NFTDetail }>(`/api/nfts/${id}`);
      return response.data.data;
    },
  });

  const favoriteMutation = useMutation({
    mutationFn: async (nextFavorite: boolean) => {
      if (nextFavorite) await axios.post(`/api/favorites/${id}`);
      else await axios.delete(`/api/favorites/${id}`);
      return nextFavorite;
    },
    onMutate: async (nextFavorite) => {
      setFavoriteError('');
      await queryClient.cancelQueries({ queryKey: ['nft', id] });
      const previous = queryClient.getQueryData<NFTDetail>(['nft', id]);
      queryClient.setQueryData<NFTDetail>(['nft', id], (current) =>
        current ? { ...current, favorite: nextFavorite } : current,
      );
      return { previous };
    },
    onError: (_error, _nextFavorite, context) => {
      if (context?.previous) queryClient.setQueryData(['nft', id], context.previous);
      setFavoriteError('Não foi possível atualizar os favoritos. Tente novamente.');
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['nft', id] });
      void queryClient.invalidateQueries({ queryKey: ['nfts'] });
    },
  });

  if (isLoading) {
    return <div className="text-center py-20 text-[#A19288] font-mono">A carregar detalhes do NFT...</div>;
  }

  if (error || !nft) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold text-red-400 font-mono">NFT não encontrado</h2>
        <p className="text-[#A19288] text-sm">O item que procura ({id}) pode ter sido removido ou o ID é inválido.</p>
        <Link to="/">
          <Button className="bg-[#E28743] hover:bg-[#c97435] text-[#120E0C] font-semibold cursor-pointer">
            Voltar ao Marketplace
          </Button>
        </Link>
      </div>
    );
  }

  const isInCart = cart.some((item) => item.id === nft.id);

  const handleToggleCart = () => {
    if (isInCart) {
      removeFromCart(nft.id);
    } else {
      if (nft.available < 1 || quantity > nft.available) return;
      addToCart({
        id: nft.id,
        name: nft.name,
        priceETH: nft.priceETH,
        imageUrl: nft.imageUrl,
        rarity: nft.rarity,
        quantity,
        available: nft.available,
      });
    }
  };

  const handleFavorite = () => {
    if (!window.localStorage.getItem('kurio_token')) {
      void navigate({ to: '/login' });
      return;
    }
    favoriteMutation.mutate(!nft.favorite);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Link to="/" className="text-sm text-[#A19288] hover:text-white transition-colors font-mono inline-flex items-center gap-2">
        ← Voltar ao catálogo
      </Link>

      {priceAlert && (
        <p role="status" aria-live="polite" className="rounded-lg border border-[#E28743] bg-[#E28743]/10 p-3 text-sm text-white">
          {priceAlert}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-[#1E1815] border border-[#342A24] rounded-2xl p-8 shadow-xl">
        <div className="aspect-square rounded-xl overflow-hidden bg-[#120E0C] border border-[#342A24] flex items-center justify-center">
          <img src={nft.imageUrl} alt={nft.name} className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-[#120E0C] text-[#E28743] text-xs font-mono px-3 py-1 rounded-md border border-[#342A24]">
                {nft.category}
              </span>
              <span className="bg-[#E28743]/20 text-[#E28743] text-xs font-mono px-3 py-1 rounded">
                {nft.rarity}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{nft.name}</h1>
            <p className="text-sm text-[#A19288] font-mono">Edição {nft.edition || '1/1'}</p>
            <p className="text-xs text-[#A19288]">Disponíveis: {nft.available}</p>

            <Button
              type="button"
              variant="outline"
              aria-pressed={nft.favorite}
              disabled={favoriteMutation.isPending}
              onClick={handleFavorite}
            >
              {nft.favorite ? '♥ Remover dos favoritos' : '♡ Adicionar aos favoritos'}
            </Button>
            {favoriteError && <p role="alert" className="text-sm text-red-400">{favoriteError}</p>}

            <p className="text-[#A19288] text-sm leading-relaxed pt-2">
              {nft.description || 'Arte digital exclusiva registada na rede Kurio, garantindo proveniência e propriedade digital autêntica para colecionadores.'}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#342A24] text-sm font-mono">
              <div>
                <span className="text-[#A19288] block text-xs">Criador</span>
                <span className="text-white font-medium">{nft.creator || 'Kurio Official'}</span>
              </div>
              <div>
                <span className="text-[#A19288] block text-xs">Proprietário atual</span>
                <span className="text-white font-medium">{nft.owner || 'Galeria Kurio'}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#342A24] flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs text-[#A19288] block">Preço atual</span>
              <span className="text-2xl font-mono font-bold text-[#E28743]">{nft.priceETH} ETH</span>
            </div>

            {!isInCart && (
              <label className="space-y-1 text-xs text-[#A19288]">
                <span className="block">Quantidade</span>
                <input
                  type="number"
                  min={1}
                  max={nft.available}
                  value={quantity}
                  disabled={nft.available < 1}
                  onChange={(event) => setQuantity(Math.max(1, Math.min(nft.available, Number(event.target.value))))}
                  className="w-20 rounded-lg border border-[#342A24] bg-[#120E0C] p-2 text-center text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E28743]"
                />
              </label>
            )}

            <Button
              onClick={handleToggleCart}
              disabled={!isInCart && nft.available < 1}
              className={`font-bold px-8 py-3 cursor-pointer transition-colors ${
                isInCart
                  ? 'bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800'
                  : 'bg-[#E28743] hover:bg-[#c97435] text-[#120E0C]'
              }`}
            >
              {nft.available < 1 && !isInCart ? 'Edição esgotada' : isInCart ? 'Remover do Carrinho' : 'Adicionar ao Carrinho'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}