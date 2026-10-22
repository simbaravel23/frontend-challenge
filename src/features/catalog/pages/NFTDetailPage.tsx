import { useParams, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { useCart } from '@/features/cart/context/CartContext';

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
}

export function NFTDetailPage() {
  const { id } = useParams({ from: '/nfts/$id' });
  const { cart, addToCart, removeFromCart } = useCart();

  const { data: nft, isLoading, error } = useQuery({
    queryKey: ['nft', id],
    queryFn: async () => {
      // Tenta procurar pelo ID exato ou faz fallback para listar e encontrar pelo slug/nome
      try {
        const response = await axios.get<{ data: NFTDetail }>(`/api/nfts/${id}`);
        return response.data.data;
      } catch {
        // Fallback: se o backend mockado usa IDs numéricos, busca todos e filtra
        const listResponse = await axios.get<{ data: NFTDetail[] }>('/api/nfts');
        const found = listResponse.data.data.find(
          (item) => item.id === id || item.name.toLowerCase().replace(/\s+/g, '-') === id
        );
        if (!found) throw new Error('NFT não encontrado');
        return found;
      }
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
      addToCart({
        id: nft.id,
        name: nft.name,
        priceETH: nft.priceETH,
        imageUrl: nft.imageUrl,
        rarity: nft.rarity,
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Link to="/" className="text-sm text-[#A19288] hover:text-white transition-colors font-mono inline-flex items-center gap-2">
        ← Voltar ao catálogo
      </Link>

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

          <div className="pt-6 border-t border-[#342A24] flex items-center justify-between">
            <div>
              <span className="text-xs text-[#A19288] block">Preço atual</span>
              <span className="text-2xl font-mono font-bold text-[#E28743]">{nft.priceETH} ETH</span>
            </div>

            <Button
              onClick={handleToggleCart}
              className={`font-bold px-8 py-3 cursor-pointer transition-colors ${
                isInCart
                  ? 'bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800'
                  : 'bg-[#E28743] hover:bg-[#c97435] text-[#120E0C]'
              }`}
            >
              {isInCart ? 'Remover do Carrinho' : 'Adicionar ao Carrinho'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}