import { http, HttpResponse } from 'msw';

// Dados simulados dos NFTs
export const mockNFTs = [
  {
    id: 'emerald-ape-042',
    name: 'Emerald Ape #042',
    description: 'Arte digital exclusiva registada na rede Kurio.',
    priceETH: '1.19',
    edition: '1/50',
    rarity: 'Raro',
    category: 'Arte digital',
    imageUrl: 'mac.jpeg',
    creator: 'Kurio Official',
    owner: 'Galeria Kurio',
  },
  {
    id: 'sage-nomad-009',
    name: 'Sage Nomad #009',
    description: 'Personagem lendário da coleção Nomad.',
    priceETH: '1.69',
    edition: '1/10',
    rarity: 'Épico',
    category: 'Arte digital',
    imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=600&auto=format&fit=crop',
    creator: 'Kurio Official',
    owner: 'Galeria Kurio',
  },
  {
    id: 'neon-vessel-552',
    name: 'Neon Vessel #552',
    description: 'Composição áudio-visual futurista.',
    priceETH: '1.99',
    edition: '1/100',
    rarity: 'Comum',
    category: 'Música',
    imageUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop',
    creator: 'Kurio Official',
    owner: 'Galeria Kurio',
  },
];

export const handlers = [
  // Endpoint para listar NFTs com suporte a busca, filtros e ordenação
  http.get('/api/nfts', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const category = url.searchParams.get('category') || '';
    const rarity = url.searchParams.get('rarity') || '';
    const sort = url.searchParams.get('sort') || '';

    let filtered = [...mockNFTs];

    // Filtro por busca de nome
    if (search) {
      filtered = filtered.filter((nft) =>
        nft.name.toLowerCase().includes(search)
      );
    }

    // Filtro por categoria
    if (category && category !== 'all') {
      filtered = filtered.filter(
        (nft) => nft.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filtro por raridade
    if (rarity && rarity !== 'all') {
      filtered = filtered.filter(
        (nft) => nft.rarity.toLowerCase() === rarity.toLowerCase()
      );
    }

    // Ordenação por preço
    if (sort === 'price-asc') {
      filtered.sort((a, b) => parseFloat(a.priceETH) - parseFloat(b.priceETH));
    } else if (sort === 'price-desc') {
      filtered.sort((a, b) => parseFloat(b.priceETH) - parseFloat(a.priceETH));
    }

    return HttpResponse.json({ data: filtered });
  }),

  // Endpoint para buscar os detalhes de um NFT por ID
  http.get('/api/nfts/:id', ({ params }) => {
    const { id } = params;
    const nft = mockNFTs.find((item) => item.id === id);

    if (!nft) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json({ data: nft });
  }),

  // Endpoint de Login
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };

    if (body.email === 'colecionador@kurio.io' && body.password === 'kurio123') {
      return HttpResponse.json({
        token: 'mock-jwt-token-kurio-123',
        user: {
          id: 'user-1',
          name: 'Colecionador Kurio',
          email: 'colecionador@kurio.io',
          avatar: 'https://placehold.co/150x150/1E1815/E28743?text=CK',
        },
      });
    }

    return new HttpResponse(
      JSON.stringify({ message: 'Credenciais inválidas. Utilize colecionador@kurio.io / kurio123' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }),

  // Endpoint para recuperar sessão ativa
  http.get('/api/auth/session', () => {
    return HttpResponse.json({
      user: {
        id: 'user-1',
        name: 'Colecionador Kurio',
        email: 'colecionador@kurio.io',
        avatar: 'https://placehold.co/150x150/1E1815/E28743?text=CK',
      },
    });
  }),
];