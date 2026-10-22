/* eslint-disable react-refresh/only-export-components */
import { createRootRoute, createRoute, createRouter, Outlet, Link, redirect, useNavigate } from '@tanstack/react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';
import { NFTCard } from '@/features/catalog/components/NFTCard';
import { useCart } from '@/features/cart/context/CartContext';
import { Button } from '@/components/ui/button';
import { NFTDetailPage } from '@/features/catalog/pages/NFTDetailPage';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { CheckoutPage } from '@/features/cart/pages/CheckoutPage';
import { OrderConfirmationPage } from '@/features/cart/pages/OrderConfirmationPage';
import { useNFTRealtime } from '@/hooks/useNFTRealtime';
import { ProfilePage } from '@/features/profile/ProfilePage';
import { Footer } from '@/components/Footer';
import { CatalogBottomSections } from '@/components/CatalogBottomSections';
import { queryMockNFTCatalog } from '@/mocks/catalogData';

interface NFT {
  id: string;
  name: string;
  priceETH: string;
  edition: string;
  rarity: string;
  imageUrl: string;
  category: string;
  available: number;
  favorite: boolean;
  version: number;
}

interface NFTListResponse {
  data: NFT[];
  source?: 'local-fallback';
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

interface CatalogSearchParams {
  search?: string;
  category?: string;
  rarity?: string;
  sort?: string;
  page?: number;
}

function RootLayout() {
    const { cart } = useCart();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [logoutError, setLogoutError] = useState('');
    const token = typeof window !== 'undefined' ? localStorage.getItem('kurio_token') : null;

    const handleLogout = async () => {
      setLogoutError('');
      try {
        await axios.post('/api/auth/logout');
        localStorage.removeItem('kurio_token');
        localStorage.removeItem('kurio_user_id');
        localStorage.removeItem('kurio_user');
        window.dispatchEvent(new CustomEvent('kurio:auth-changed', { detail: { userId: null } }));
        queryClient.clear();
        void navigate({ to: '/' });
      } catch {
        setLogoutError('Não foi possível encerrar a sessão. Tente novamente.');
      }
    };

    return (
      <div className="min-h-screen bg-[#120E0C] text-[#A19288] font-sans">
        {/* Header Fiel ao Figma */}
        <header className="border-b border-[#342A24]/60 px-8 py-4 flex items-center justify-between sticky top-0 bg-[#120E0C]/95 backdrop-blur-md z-50">
          {/* Logo à esquerda */}
          <Link to="/" className="font-mono font-bold tracking-widest text-white text-xl">
            KURIO
          </Link>

          {/* Links do Menu Central */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono">
            <Link 
              to="/" 
              className="text-white border-b-2 border-[#E28743] pb-1 font-semibold transition-colors"
            >
              Início
            </Link>
            <Link 
              to="/" 
              className="text-[#A19288] hover:text-white transition-colors"
            >
              Mercado
            </Link>
            <span className="text-[#A19288]" aria-disabled="true">
              Criadores
            </span>
            <span className="text-[#A19288]" aria-disabled="true">
              Aprenda
            </span>
          </nav>

          {/* Ações da Direita: Lupa, Carrinho com Badge e Botão Entrar com Ícone */}
          <div className="flex items-center gap-6">
            <button 
              type="button" 
              className="text-[#A19288] hover:text-white transition-colors cursor-pointer p-1"
              title="Pesquisar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <Link to="/cart" aria-label="Carrinho" className="relative text-[#A19288] hover:text-white transition-colors p-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#E28743] text-[#120E0C] text-[10px] font-bold font-mono min-width-[16px] h-4 px-1 rounded-full flex items-center justify-center">
                  {cart.reduce((count, item) => count + item.quantity, 0)}
                </span>
              )}
            </Link>

            {token ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="text-xs font-mono text-[#E28743] bg-[#E28743]/10 px-3 py-1.5 rounded-lg border border-[#E28743]/30">
                  Perfil
                </Link>
                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  className="text-xs text-[#A19288] underline hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E28743]"
                >
                  Sair
                </button>
              </div>
            ) : (
              <Link to="/login" className="rounded-lg bg-[#E28743] px-3.5 py-1.5 text-xs font-semibold text-[#120E0C] transition-colors hover:bg-[#c97435] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E28743]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Entrar</span>
              </Link>
            )}
          </div>
          {logoutError && <p role="alert" className="absolute right-8 top-full rounded bg-red-950 p-2 text-xs text-red-300">{logoutError}</p>}
        </header>

        {/* Conteúdo Principal */}
        <main className="max-w-7xl mx-auto px-8 py-10">
          <Outlet />
        </main>
        <Footer />
      </div>
    );
}

// 1. Root Route (Header Fiel ao Figma)
export const rootRoute = createRootRoute({ component: RootLayout });

// 2. Catálogo (Hero Banner + Sidebar Ajustada ao Figma)
function CatalogPage() {
  const navigate = useNavigate();
  const searchParams = indexRoute.useSearch();

  const search = searchParams.search || '';
  const category = searchParams.category || 'all';
  const rarity = searchParams.rarity || 'all';
  const sort = searchParams.sort || 'none';
  const page = searchParams.page ?? 1;
  const pageSize = 9;
  const { priceAlert, clearAlert } = useNFTRealtime();

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ['nfts', { search, category, rarity, sort, page, pageSize }],
    queryFn: async () => {
      try {
        const response = await axios.get<NFTListResponse>('/api/nfts', {
          params: { search, category, rarity, sort, page, pageSize },
        });
        if (
          !Array.isArray(response.data?.data)
          || !response.data.pagination
          || typeof response.data.pagination.total !== 'number'
        ) {
          throw new Error('The catalog endpoint returned an invalid response.');
        }
        return response.data;
      } catch (error) {
        if (!import.meta.env.PROD) throw error;

        console.error('Catalog API unavailable; showing local demo catalog.', error);
        const fallback = queryMockNFTCatalog({ search, category, rarity, sort, page, pageSize });
        return {
          ...fallback,
          data: fallback.data.map((nft) => ({ ...nft, favorite: false })),
          source: 'local-fallback' as const,
        };
      }
    },
  });

  const updateFilters = (newParams: Partial<CatalogSearchParams>) => {
    const hasFilterChanged = ['search', 'category', 'rarity', 'sort']
      .some((key) => key in newParams);
    navigate({
      to: '/',
      search: (prev) => ({
        ...prev,
        ...newParams,
        ...(hasFilterChanged && !('page' in newParams) ? { page: 1 } : {}),
      }),
    });
  };

  return (
    <div className="space-y-12">
      {/* Alerta de Atualização de Cotação em Tempo Real */}
      {priceAlert && (
        <div className="bg-[#E28743]/20 border border-[#E28743] text-white p-4 rounded-xl flex items-center justify-between font-mono text-xs animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E28743] animate-ping" />
            <span>{priceAlert}</span>
          </div>
          <button 
            onClick={clearAlert}
            className="text-[#A19288] hover:text-white underline cursor-pointer"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Hero Banner */}
      <div className="bg-[#1E1815] border border-[#342A24] rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
        <div className="space-y-4 max-w-xl">
          <span className="text-xs font-mono text-[#E28743] uppercase tracking-widest bg-[#E28743]/10 px-3 py-1 rounded border border-[#E28743]/20">
            Bem-vindo à Kurio
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            SEJA DONO DO FUTURO <br />DA ARTE DIGITAL
          </h1>
          <p className="text-sm text-[#A19288] leading-relaxed">
            Colecione NFTs autenticados de criadores excecionais e acompanhe a proveniência desta página rara. Arte urbana e temas de culto de culturas de exceção.
          </p>
          <div className="pt-2">
            <Link to="/nfts/$id" params={{ id: 'emerald-ape-042' }}>
              <Button className="bg-[#E28743] hover:bg-[#c97435] text-[#120E0C] font-bold px-6 py-3 cursor-pointer">
                Ver Destaque
              </Button>
            </Link>
          </div>
        </div>
        <div className="w-full md:w-80 aspect-square rounded-xl overflow-hidden border border-[#342A24] bg-[#120E0C] shadow-lg flex items-center justify-center">
          <img 
            src="/mac.jpeg" 
            alt="Destaque Kurio" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Grid Principal: Sidebar + Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar de Filtros Fiel ao Figma */}
        <aside className="bg-[#1E1815] border border-[#342A24]/70 rounded-2xl p-6 space-y-8 lg:sticky lg:top-24">
          {/* Pesquisa */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-sm font-mono border-b border-[#342A24]/60 pb-2">Pesquisa</h3>
            <input
              aria-label="Pesquisar NFT"
              type="text"
              placeholder="Pesquisar NFT..."
              value={search}
              onChange={(e) => updateFilters({ search: e.target.value || undefined })}
              className="w-full bg-[#120E0C] border border-[#342A24] text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#E28743] font-mono placeholder-[#A19288]"
            />
          </div>

          {/* Coleções */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-sm font-mono border-b border-[#342A24]/60 pb-2">
              Coleções
            </h3>
            <div className="space-y-1 text-xs font-mono">
              {[
                { label: 'Arte digital', value: 'Arte digital', count: 33 },
                { label: 'Fotografia', value: 'Fotografia', count: 12 },
                { label: 'Música', value: 'Música', count: 65 },
                { label: 'Arte 3D', value: 'Arte 3D', count: 39 },
                { label: 'Colecionáveis', value: 'Colecionáveis', count: 23 },
                { label: 'Generativa', value: 'Generativa', count: 17 },
                { label: 'Jogos', value: 'Jogos', count: 19 },
                { label: 'Assinaturas', value: 'Assinaturas', count: 13 },
                { label: 'Utilidade', value: 'Utilidade', count: 18 },
              ].map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => updateFilters({ category: category === cat.value ? 'all' : cat.value })}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md transition-colors cursor-pointer ${
                    category === cat.value 
                      ? 'text-[#E28743] bg-[#E28743]/10 font-bold' 
                      : 'text-[#A19288] hover:text-white'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="text-[10px] opacity-70">({cat.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Faixa de Preço */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-sm font-mono border-b border-[#342A24]/60 pb-2">
              Faixa de preço
            </h3>
            <div className="space-y-2 font-mono text-xs">
              <div className="h-1.5 w-full bg-[#120E0C] border border-[#342A24] rounded-full relative my-3">
                <div className="absolute left-1/4 right-1/4 h-full bg-[#E28743] rounded-full" />
                <div className="absolute left-1/4 -top-1 w-3.5 h-3.5 bg-[#E28743] border border-[#120E0C] rounded-full cursor-pointer" />
                <div className="absolute right-1/4 -top-1 w-3.5 h-3.5 bg-[#E28743] border border-[#120E0C] rounded-full cursor-pointer" />
              </div>
              <p className="text-[#A19288] text-[11px]">Preço: 0,02 - 12,30 ETH</p>
              <Button 
                type="button"
                className="bg-[#E28743] hover:bg-[#c97435] text-[#120E0C] font-bold text-xs px-4 py-1.5 rounded-lg cursor-pointer mt-1"
              >
                Aplicar
              </Button>
            </div>
          </div>

          {/* Rede */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-sm font-mono border-b border-[#342A24]/60 pb-2">
              Rede
            </h3>
            <div className="space-y-1 text-xs font-mono">
              {[
                { label: 'Ethereum', count: 119 },
                { label: 'Polygon', count: 78 },
                { label: 'Solana', count: 86 },
              ].map((net) => (
                <button
                  key={net.label}
                  type="button"
                  className="w-full flex items-center justify-between px-2 py-1.5 text-[#A19288] hover:text-white transition-colors cursor-pointer"
                >
                  <span>{net.label}</span>
                  <span className="text-[10px] opacity-70">({net.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* NFT em Destaque */}
          <div className="bg-[#120E0C] border border-[#342A24] rounded-xl p-4 text-center space-y-3 mt-6">
            <div className="space-y-1">
              <p className="text-[10px] font-mono font-bold tracking-wider text-[#E28743] uppercase">
                NFT EM DESTAQUE
              </p>
              <p className="text-xs font-bold text-white tracking-widest uppercase">
                OFERTA LIMITADA
              </p>
            </div>
            <div className="aspect-square rounded-lg overflow-hidden border border-[#342A24]">
              <img
                src="/mac.jpeg"
                alt="NFT em Destaque"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </aside>

        {/* Listagem de Cards */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#342A24] pb-4 font-mono text-xs text-[#A19288]">
            <span>
              Exibindo {data?.data.length ?? 0} de {data?.pagination.total ?? 0} resultado(s)
              {isFetching && <span role="status" className="ml-2 text-[#E28743]">Atualizando...</span>}
            </span>
            <label className="flex items-center gap-2">
              <span>Ordenar</span>
              <select
                aria-label="Ordenar catálogo"
                value={sort}
                onChange={(event) => updateFilters({ sort: event.target.value || undefined })}
                className="rounded-md border border-[#342A24] bg-[#120E0C] px-2 py-1 text-white"
              >
                <option value="none">Recentes</option>
                <option value="price-asc">Menor preço</option>
                <option value="price-desc">Maior preço</option>
                <option value="name-asc">Nome</option>
              </select>
            </label>
          </div>

          {data?.source === 'local-fallback' && (
            <p role="status" className="rounded-lg border border-[#E28743]/50 bg-[#E28743]/10 p-3 text-sm text-[#E9B17F]">
              A API do catálogo está indisponível. Exibindo dados locais de demonstração.
            </p>
          )}

          {isLoading && (
            <div aria-label="A carregar NFTs" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: pageSize }, (_, index) => (
                <div key={index} className="animate-pulse rounded-xl border border-[#342A24] bg-[#1E1815]">
                  <div className="aspect-square rounded-t-xl bg-[#342A24]" />
                  <div className="space-y-3 p-4">
                    <div className="h-4 w-2/3 rounded bg-[#342A24]" />
                    <div className="h-3 w-1/3 rounded bg-[#342A24]" />
                    <div className="h-9 rounded bg-[#342A24]" />
                  </div>
                </div>
              ))}
            </div>
          )}
          {error && <div className="text-center py-20 text-red-400 font-mono">Erro ao carregar o catálogo.</div>}

          {!isLoading && !error && data?.data.length === 0 && (
            <div className="text-center py-20 space-y-3 bg-[#1E1815] border border-[#342A24] rounded-2xl p-8">
              <h3 className="text-lg font-bold text-white">Nenhum NFT encontrado</h3>
              <p className="text-xs text-[#A19288]">Tente limpar os filtros na barra lateral.</p>
              <Button 
                onClick={() => navigate({ to: '/', search: {} })}
                className="bg-[#E28743] hover:bg-[#c97435] text-[#120E0C] font-semibold text-xs cursor-pointer mt-2"
              >
                Limpar Filtros
              </Button>
            </div>
          )}

          {!isLoading && !error && data && data.data.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {data.data.map((nft) => (
                <NFTCard key={nft.id} {...nft} />
              ))}
            </div>
          )}

          {!isLoading && !error && (data?.pagination.totalPages ?? 0) > 1 && (
            <nav aria-label="Paginação do catálogo" className="flex items-center justify-center gap-4 pt-2">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => updateFilters({ page: page - 1 })}
              >
                Anterior
              </Button>
              <span aria-live="polite" className="font-mono text-sm text-white">
                Página {page} de {data?.pagination.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page >= (data?.pagination.totalPages ?? 1)}
                onClick={() => updateFilters({ page: page + 1 })}
              >
                Próxima
              </Button>
            </nav>
          )}
        </div>
      </div>
      <CatalogBottomSections />
    </div>
  );
}

// 3. Página do Carrinho
function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, totalETH } = useCart();

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
                <div className="space-y-1 text-right">
                  <span className="block text-[#E28743] font-mono font-bold">{item.priceETH} ETH cada</span>
                  <label className="flex items-center justify-end gap-2 text-xs">
                    <span>Quantidade</span>
                    <input
                      aria-label={`Quantidade de ${item.name}`}
                      type="number"
                      min={1}
                      max={item.available}
                      value={item.quantity}
                      disabled={item.available === 0}
                      onChange={(event) => updateQuantity(item.id, Number(event.target.value))}
                      className="w-16 rounded border border-[#342A24] bg-[#120E0C] px-2 py-1 text-center text-white disabled:opacity-50"
                    />
                  </label>
                  {item.available === 0 && (
                    <p role="alert" className="text-xs text-red-400">Edição esgotada</p>
                  )}
                </div>
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
              <span className="text-white">{cart.reduce((count, item) => count + item.quantity, 0)} NFT(s)</span>
            </div>
            <div className="border-t border-[#342A24] pt-3 flex justify-between text-base font-bold">
              <span className="text-white">Total</span>
              <span className="text-[#E28743]">{totalETH} ETH</span>
            </div>
          </div>

          <Link to="/cart/checkout">
            <Button className="w-full bg-[#E28743] hover:bg-[#c97435] text-[#120E0C] font-bold py-3 cursor-pointer">
              Avançar para o Checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// 4. Configuração das Rotas
export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  validateSearch: (search: Record<string, unknown>): CatalogSearchParams => {
    return {
      search: typeof search.search === 'string' ? search.search : undefined,
      category: typeof search.category === 'string' ? search.category : undefined,
      rarity: typeof search.rarity === 'string' ? search.rarity : undefined,
      sort: typeof search.sort === 'string' ? search.sort : undefined,
      page: Number.isInteger(Number(search.page)) && Number(search.page) > 0 ? Number(search.page) : 1,
    };
  },
  component: CatalogPage,
});

export const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartPage,
});

export const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart/checkout',
  beforeLoad: ensureAuthenticated,
  component: CheckoutPage,
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

export const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  beforeLoad: ensureAuthenticated,
  component: ProfilePage,
});

export const orderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/orders/$id',
  beforeLoad: ensureAuthenticated,
  component: OrderConfirmationPage,
});

async function ensureAuthenticated({ location }: { location: { pathname: string; searchStr: string } }) {
  const token = window.localStorage.getItem('kurio_token');
  const returnTo = `${location.pathname}${location.searchStr}`;
  if (!token) {
    window.sessionStorage.setItem('kurio_return_to', returnTo);
    throw redirect({ to: '/login' });
  }

  try {
    await axios.get('/api/auth/session');
  } catch (error) {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) throw error;
    window.localStorage.removeItem('kurio_token');
    window.localStorage.removeItem('kurio_user_id');
    window.localStorage.removeItem('kurio_user');
    window.dispatchEvent(new CustomEvent('kurio:auth-changed', { detail: { userId: null } }));
    window.sessionStorage.setItem('kurio_return_to', returnTo);
    throw redirect({ to: '/login' });
  }
}

const routeTree = rootRoute.addChildren([
  indexRoute,
  cartRoute,
  checkoutRoute,
  nftDetailRoute,
  loginRoute,
  profileRoute,
  orderRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}