import { http, HttpResponse } from 'msw';

export const mockNFTs = [
  {
    id: 'emerald-ape-042',
    name: 'Emerald Ape #042',
    priceETH: '1.19',
    edition: '1/50',
    rarity: 'Raro',
    imageUrl: 'https://placehold.co/400x400/1E1815/E28743?text=Emerald+Ape',
    category: 'Arte digital',
  },
  {
    id: 'sage-nomad-009',
    name: 'Sage Nomad #009',
    priceETH: '1.69',
    edition: '1/10',
    rarity: 'Épico',
    imageUrl: 'https://placehold.co/400x400/1E1815/E28743?text=Sage+Nomad',
    category: 'Arte digital',
  },
  {
    id: 'neon-vessel-552',
    name: 'Neon Vessel #552',
    priceETH: '1.99',
    edition: '1/100',
    rarity: 'Comum',
    imageUrl: 'https://placehold.co/400x400/1E1815/E28743?text=Neon+Vessel',
    category: 'Música',
  },
];

export const handlers = [
  // Listagem de NFTs
  http.get('/api/nfts', ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('query')?.toLowerCase();

    let filtered = [...mockNFTs];
    if (query) {
      filtered = filtered.filter((nft) => nft.name.toLowerCase().includes(query));
    }

    return HttpResponse.json({
      data: filtered,
      total: filtered.length,
    });
  }),

  // Detalhes do NFT por ID
  http.get('/api/nfts/:id', ({ params }) => {
    const { id } = params;
    const nft = mockNFTs.find((item) => item.id === id);

    if (!nft) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(nft);
  }),
];