import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';

// Rota Raiz (Layout Base com o visual escuro do Kurio)
export const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-[#120E0C] text-white font-sans">
      <header className="border-b border-[#342A24] px-6 py-4 flex items-center justify-between">
        <h1 className="font-mono font-bold tracking-wider text-[#E28743]">KURIO</h1>
        <nav className="flex gap-6 text-sm text-[#A19288]">
          <a href="/" className="hover:text-white transition-colors">Início</a>
          <a href="/cart" className="hover:text-white transition-colors">Carrinho</a>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  ),
});

// Rota do Catálogo / Início
export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Mercado de NFTs</h2>
        <p className="text-sm text-[#A19288] mt-1">Descubra arte digital verificada na rede.</p>
      </div>
    </div>
  ),
});

// Rota do Carrinho
export const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: () => (
    <div>
      <h2 className="text-2xl font-bold text-white">Carrinho de NFTs</h2>
      <p className="text-sm text-[#A19288] mt-1">Revezamento e finalização de compras.</p>
    </div>
  ),
});

// Árvore de rotas
const routeTree = rootRoute.addChildren([indexRoute, cartRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}