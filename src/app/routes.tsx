import { createRootRoute, createRoute, createRouter, Outlet, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { NFTCard } from '@/features/catalog/components/NFTCard';
import { useCart } from '@/features/cart/context/CartContext';
import { Button } from '@/components/ui/button';
import { NFTDetailPage } from '@/features/catalog/pages/NFTDetailPage';
import { LoginPage } from '@/features/auth/pages/LoginPage';

interface NFT {
  id: string;
  name: string;
  priceETH: string;
  edition: string;
  rarity: string;
  imageUrl: string;
  category: string;
}

export const rootRoute = createRootRoute({
  component: () => {
    const { cart } = useCart();
    const token = typeof window !== 'undefined' ? localStorage.getItem('kurio_token') : null;

    return (
      <div className="min-h-screen bg-[#120E0C] text-[#A19288] font-sans">
        {/* Header Fiel ao Figma */}
        <header className="border-b border-[#342A24] px-8 py-5 flex items-center justify-between sticky top-0 bg-[#120E0C]/90 backdrop-blur-md z-50">
          <Link to="/" className="font-mono font-bold tracking-widest text-white text-2xl">
            KURIO
          </Link>
          <nav className="flex items-center gap-8 text-sm">
            <Link to="/" className="hover:text-white transition-colors text-white font-medium">
              Início
            </Link>
            <Link to="/cart" className="hover:text-white transition-colors flex items-center gap-2">
              <span>Carrinho</span>
              {cart.length > 0 && (
                <span className="bg-[#E28743] text-[#120E0C] text-xs font-bold font-mono px-2 py-0.5 rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>
            {token ? (
              <span className="text-xs font-mono text-[#E28743] bg-[#E28743]/10 px-3 py-1 rounded-full border border-[#E28743]/30">
                ● Conectado
              </span>
            ) : (
              <Link to="/login" className="text-xs font-mono text-[#E28743] hover:underline">
                Entrar
              </Link>
            )}
          </nav>
        </header>

        {/* Conteúdo Principal */}
        <main className="max-w-7xl mx-auto px-8 py-10">
          <Outlet />
        </main>
      </div>
    );
  },
});

function CatalogPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['nfts'],
    queryFn: async () => {
      const response = await axios.get<{ data: NFT[] }>('/api/nfts');
      return response.data.data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-20 text-[#A19288] font-mono">A carregar marketplace...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-400 font-mono">Erro ao carregar os NFTs.</div>;
  }

  return (
    <div className="space-y-10">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Mercado de NFTs</h2>
        <p className="text-sm text-[#A19288]">Descubra, colecione e negocie arte digital exclusiva.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {data?.map((nft) => (
          <NFTCard key={nft.id} {...nft} />
        ))}
      </div>
    </div>
  );
}

function CartPage() {
  const { cart, removeFromCart, clearCart, totalETH } = useCart();

  if (cart.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold text-white">O teu carrinho está vazio</h2>
        <p className="text-[#A19288] text-sm">Explora o catálogo e escolhe os teus NFTs favoritos.</p>
        <div className="pt-2">
          <Link to="/">
            <Button className="bg-[#E28743] hover:bg-[#c97435] text-[#120E0C] font-semibold cursor-pointer">
              Explorar Marketplace
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-end border-b border-[#342A24] pb-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Carrinho de Compras</h2>
          <p className="text-sm text-[#A19288] mt-1">Revisão dos itens selecionados para aquisição.</p>
        </div>
        <Button 
          onClick={clearCart}
          variant="outline"
          className="text-xs border-[#342A24] text-[#A19288] hover:text-red-400 hover:border-red-900 bg-transparent cursor-pointer"
        >
          Esvaziar carrinho
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div 
              key={item.id}
              className="bg-[#1E1815] border border-[#342A24] rounded-xl p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-[#120E0C] border border-[#342A24] flex items-center justify-center overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <div>
                  <h4 className="text-white font-semibold">{item.name}</h4>
                  <span className="text-xs text-[#E28743] font-mono bg-[#E28743]/10 px-2 py-0.5 rounded">
                    {item.rarity}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <span className="text-[#E28743] font-mono font-bold">{item.priceETH} ETH</span>
                <Button 
                  size="sm"
                  onClick={() => removeFromCart(item.id)}
                  className="bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800 text-xs cursor-pointer"
                >
                  Remover
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#1E1815] border border-[#342A24] rounded-xl p-6 space-y-6 h-fit">
          <h3 className="text-lg font-bold text-white border-b border-[#342A24] pb-3">Resumo da Ordem</h3>
          
          <div className="space-y-3 font-mono text-sm">
            <div className="flex justify-between text-[#A19288]">
              <span>Quantidade</span>
              <span className="text-white">{cart.length} NFT(s)</span>
            </div>
            <div className="border-t border-[#342A24] pt-3 flex justify-between text-base font-bold">
              <span className="text-white">Total</span>
              <span className="text-[#E28743]">{totalETH} ETH</span>
            </div>
          </div>

          <Button 
            onClick={() => alert('Compra efetuada com sucesso!')}
            className="w-full bg-[#E28743] hover:bg-[#c97435] text-[#120E0C] font-bold py-3 cursor-pointer"
          >
            Finalizar Compra
          </Button>
        </div>
      </div>
    </div>
  );
}

// Declaração de todas as rotas
export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: CatalogPage,
});

export const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartPage,
});

export const nftDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/nfts/$id',
  component: NFTDetailPage,
});

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

// Construção única da árvore de rotas
const routeTree = rootRoute.addChildren([indexRoute, cartRoute, nftDetailRoute, loginRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}