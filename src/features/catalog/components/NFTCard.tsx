import { Link } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { useCart } from '@/features/cart/context/CartContext';

interface NFTCardProps {
  id: string;
  name: string;
  priceETH: string;
  edition: string;
  rarity: string;
  imageUrl: string;
  category: string;
  available?: number;
  favorite?: boolean;
  version?: number;
}

interface NFTListCache {
  data: NFTCardProps[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export function NFTCard({
  id,
  name,
  priceETH,
  edition,
  rarity,
  imageUrl,
  category,
  available = 1,
  favorite = false,
}: NFTCardProps) {
  const { cart, addToCart, removeFromCart } = useCart();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isInCart = cart.some((item) => item.id === id);

  const favoriteMutation = useMutation({
    mutationFn: async (nextFavorite: boolean) => {
      if (nextFavorite) {
        await axios.post(`/api/favorites/${id}`);
      } else {
        await axios.delete(`/api/favorites/${id}`);
      }
    },
    onMutate: async (nextFavorite) => {
      await queryClient.cancelQueries({ queryKey: ['nfts'] });
      const previous = queryClient.getQueriesData<NFTListCache>({ queryKey: ['nfts'] });
      queryClient.setQueriesData<NFTListCache>({ queryKey: ['nfts'] }, (result) =>
        result
          ? {
              ...result,
              data: result.data.map((item) => item.id === id ? { ...item, favorite: nextFavorite } : item),
            }
          : result,
      );
      return { previous };
    },
    onError: (_error, _nextFavorite, context) => {
      context?.previous.forEach(([key, value]) => queryClient.setQueryData(key, value));
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['nfts'] });
      void queryClient.invalidateQueries({ queryKey: ['nft', id] });
      void queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  const isFavorite = favoriteMutation.isPending
    ? favoriteMutation.variables ?? favorite
    : favorite;

  const handleToggleCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Evita conflitos com o Link do Router
    if (isInCart) {
      removeFromCart(id);
    } else {
      addToCart({ id, name, priceETH, imageUrl, rarity, available });
    }
  };

  const handleToggleFavorite = () => {
    if (!window.localStorage.getItem('kurio_token')) {
      void navigate({ to: '/login' });
      return;
    }
    favoriteMutation.mutate(!isFavorite);
  };

  return (
    <div className="relative bg-[#1E1815] border border-[#342A24] rounded-xl overflow-hidden shadow-lg hover:border-[#E28743] transition-all group flex flex-col justify-between">
      {/* Link que redireciona para a página de Detalhes */}
      <Link to="/nfts/$id" params={{ id }} className="block">
        <div className="relative aspect-square overflow-hidden bg-[#120E0C] flex items-center justify-center">
          <img 
            src={imageUrl} 
            alt={name} 
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <span className="absolute top-3 left-3 bg-[#120E0C]/80 text-[#E28743] text-xs font-mono px-2.5 py-1 rounded-md border border-[#342A24]">
            {category}
          </span>
          <span className="absolute top-3 right-14 bg-[#E28743]/20 text-[#E28743] text-xs font-mono px-2 py-0.5 rounded">
            {rarity}
          </span>
        </div>

        <div className="p-4 space-y-1">
          <h3 className="text-white font-semibold text-lg hover:text-[#E28743] transition-colors">{name}</h3>
          <p className="text-xs text-[#A19288] font-mono">Edição {edition}</p>
        </div>
      </Link>

      <button
        type="button"
        aria-label={isFavorite ? `Remover ${name} dos favoritos` : `Adicionar ${name} aos favoritos`}
        aria-pressed={isFavorite}
        disabled={favoriteMutation.isPending}
        onClick={handleToggleFavorite}
        className="absolute right-3 top-3 z-10 rounded-full border border-[#342A24] bg-[#120E0C]/90 px-3 py-2 text-sm text-white transition-colors hover:text-[#E28743] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E28743]"
      >
        {isFavorite ? '♥' : '♡'}
      </button>

      <div className="p-4 pt-0 space-y-3">
        <div className="flex items-center justify-between pt-3 border-t border-[#342A24]">
          <div>
            <span className="text-xs text-[#A19288] block">Preço atual</span>
            <span className="text-[#E28743] font-mono font-bold text-base">{priceETH} ETH</span>
          </div>
          <Button 
            size="sm" 
            onClick={handleToggleCart}
            className={`font-semibold cursor-pointer transition-colors ${
              isInCart 
                ? 'bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800' 
                : 'bg-[#E28743] hover:bg-[#c97435] text-[#120E0C]'
            }`}
          >
            {isInCart ? 'Remover' : 'Adicionar'}
          </Button>
        </div>
      </div>
    </div>
  );
}