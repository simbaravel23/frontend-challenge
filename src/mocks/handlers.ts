import { http, HttpResponse } from 'msw';

// Dados simulados dos NFTs
export const mockNFTs = [
  {
    id: 'emerald-ape-042',
    name: 'Emerald Ape #042',
    description: 'Arte digital exclusiva registada na rede Kurio, garantindo proveniência e propriedade digital autêntica.',
    priceETH: '1.19',
    edition: '1/50',
    rarity: 'Raro',
    category: 'Arte digital',
    imageUrl: 'https://placehold.co/600x600/1E1815/E28743?text=Emerald+Ape+#042',
    creator: 'Kurio Official',
    owner: 'Galeria Kurio',
  },
  {
    id: 'sage-nomad-009',
    name: 'Sage Nomad #009',
    description: 'Personagem lendário da coleção Nomad, com detalhes e acabamento vetorial de alta definição.',
    priceETH: '1.69',
    edition: '1/10',
    rarity: 'Épico',
    category: 'Arte digital',
    imageUrl: 'https://placehold.co/600x600/1E1815/E28743?text=Sage+Nomad+#009',
    creator: 'Kurio Official',
    owner: 'Galeria Kurio',
  },
  {
    id: 'neon-vessel-552',
    name: 'Neon Vessel #552',
    description: 'Composição áudio-visual futurista inspirada em sintetizadores e soundscapes espaciais.',
    priceETH: '1.99',
    edition: '1/100',
    rarity: 'Comum',
    category: 'Música',
    imageUrl: 'https://placehold.co/600x600/1E1815/E28743?text=Neon+Vessel+#552',
    creator: 'Kurio Official',
    owner: 'Galeria Kurio',
  },
];

export const handlers = [
  // Endpoint para listar todos os NFTs
  http.get('/api/nfts', () => {
    return HttpResponse.json({ data: mockNFTs });
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