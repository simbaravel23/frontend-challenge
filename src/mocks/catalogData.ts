import BigNumber from 'bignumber.js';

export interface MockNFT {
  id: string;
  name: string;
  description: string;
  priceETH: string;
  edition: string;
  rarity: string;
  category: string;
  imageUrl: string;
  creator: string;
  owner: string;
  available: number;
  version: number;
}

const seeds = [
  ['emerald-ape-042', 'Emerald Ape #042', '1.19', 'Raro', 'Arte digital'],
  ['sage-nomad-009', 'Sage Nomad #009', '1.69', 'Épico', 'Arte digital'],
  ['neon-vessel-552', 'Neon Vessel #552', '1.99', 'Comum', 'Música'],
  ['quiet-orbit-118', 'Quiet Orbit #118', '0.82', 'Comum', 'Arte 3D'],
  ['golden-hour-031', 'Golden Hour #031', '2.45', 'Lendário', 'Fotografia'],
  ['pixel-garden-204', 'Pixel Garden #204', '0.56', 'Raro', 'Generativa'],
  ['echoes-777', 'Echoes #777', '3.10', 'Épico', 'Música'],
  ['driftwood-016', 'Driftwood #016', '0.93', 'Comum', 'Fotografia'],
  ['cosmic-bloom-064', 'Cosmic Bloom #064', '4.25', 'Lendário', 'Generativa'],
  ['arcade-ghost-090', 'Arcade Ghost #090', '1.34', 'Raro', 'Jogos'],
  ['velvet-relic-022', 'Velvet Relic #022', '0.71', 'Comum', 'Colecionáveis'],
  ['blue-hour-108', 'Blue Hour #108', '2.08', 'Épico', 'Fotografia'],
  ['paper-moon-033', 'Paper Moon #033', '0.48', 'Comum', 'Arte digital'],
  ['signal-noise-501', 'Signal Noise #501', '1.87', 'Raro', 'Música'],
  ['vivid-machine-012', 'Vivid Machine #012', '5.20', 'Lendário', 'Arte 3D'],
  ['tiny-world-304', 'Tiny World #304', '0.64', 'Comum', 'Jogos'],
  ['dream-key-090', 'Dream Key #090', '1.12', 'Raro', 'Utilidade'],
  ['silver-thread-045', 'Silver Thread #045', '2.76', 'Épico', 'Assinaturas'],
] as const;

export const mockNFTs: MockNFT[] = seeds.map(([id, name, priceETH, rarity, category], index) => ({
  id,
  name,
  description: `${name} — arte digital exclusiva registada na rede Kurio.`,
  priceETH,
  edition: `1/${index === 0 ? 50 : 10 + index * 3}`,
  rarity,
  category,
  imageUrl: '/mac.jpeg',
  creator: 'Kurio Official',
  owner: 'Galeria Kurio',
  available: index === 0 ? 5 : 2 + (index % 8),
  version: 1,
}));

export interface MockCatalogQuery {
  search?: string;
  category?: string;
  rarity?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}

export function queryMockNFTCatalog({
  search = '',
  category = 'all',
  rarity = 'all',
  sort = 'none',
  page = 1,
  pageSize = 9,
}: MockCatalogQuery) {
  const normalizedSearch = search.trim().toLowerCase();
  let filtered = mockNFTs.filter((nft) => {
    const matchesSearch = !normalizedSearch
      || `${nft.name} ${nft.description}`.toLowerCase().includes(normalizedSearch);
    const matchesCategory = category === 'all'
      || nft.category.toLowerCase() === category.toLowerCase();
    const matchesRarity = rarity === 'all'
      || nft.rarity.toLowerCase() === rarity.toLowerCase();
    return matchesSearch && matchesCategory && matchesRarity;
  });

  if (sort === 'price-asc') {
    filtered = filtered.toSorted((a, b) => new BigNumber(a.priceETH).comparedTo(b.priceETH) ?? 0);
  } else if (sort === 'price-desc') {
    filtered = filtered.toSorted((a, b) => new BigNumber(b.priceETH).comparedTo(a.priceETH) ?? 0);
  } else if (sort === 'name-asc') {
    filtered = filtered.toSorted((a, b) => a.name.localeCompare(b.name));
  }

  const normalizedPage = Math.max(1, page);
  const normalizedPageSize = Math.min(24, Math.max(1, pageSize));
  const total = filtered.length;
  const offset = (normalizedPage - 1) * normalizedPageSize;
  return {
    data: filtered.slice(offset, offset + normalizedPageSize),
    pagination: {
      page: normalizedPage,
      pageSize: normalizedPageSize,
      total,
      totalPages: Math.ceil(total / normalizedPageSize),
    },
  };
}
