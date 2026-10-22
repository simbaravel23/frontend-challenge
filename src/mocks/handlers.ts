import BigNumber from 'bignumber.js';
import { http, HttpResponse } from 'msw';
import { mockNFTs, queryMockNFTCatalog } from './catalogData';

interface MockUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  password: string;
}

interface OrderItem {
  id: string;
  quantity: number;
}

interface OrderRequest {
  items: OrderItem[];
  walletId: string;
  network: string;
  coupon?: string;
  totalETH: string;
}

const users = new Map<string, MockUser>([
  [
    'colecionador@kurio.io',
    {
      id: 'user-1',
      name: 'Colecionador Kurio',
      email: 'colecionador@kurio.io',
      avatar: '/favicon.svg',
      password: 'kurio123',
    },
  ],
  [
    'ana@kurio.io',
    {
      id: 'user-2',
      name: 'Ana Colecionadora',
      email: 'ana@kurio.io',
      avatar: '/favicon.svg',
      password: 'kurio456',
    },
  ],
]);

const tokens = new Map([
  ['mock-jwt-token-kurio-123', 'user-1'],
  ['mock-jwt-token-kurio-456', 'user-2'],
]);
const favorites = new Map<string, Set<string>>();
const carts = new Map<string, OrderItem[]>();
const profiles = new Map<string, Omit<MockUser, 'password'>>();
const wallets = new Map<string, Array<{ id: string; name: string; address: string; balanceETH: string; isDefault: boolean }>>([
  [
    'user-1',
    [
      { id: 'wallet-1', name: 'Carteira Principal', address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', balanceETH: '8.4500', isDefault: true },
      { id: 'wallet-2', name: 'Carteira Secundária', address: '0x52908400098527886E0F7030069857D2E4169EE7', balanceETH: '2.1000', isDefault: false },
    ],
  ],
  [
    'user-2',
    [{ id: 'wallet-3', name: 'Carteira da Ana', address: '0xde709f2102306220921060314715629080e2fb77', balanceETH: '3.2500', isDefault: true }],
  ],
]);
const orders = new Map<string, { request: OrderRequest; order: Record<string, unknown> }>();
const ordersByIdempotencyKey = new Map<string, string>();
const timedOutOrderKeys = new Set<string>();
const finalizedOrders = new Set<string>();
const persistedOrderKey = (id: string) => `kurio_mock_order_${id}`;

function persistOrder(id: string): void {
  const record = orders.get(id);
  if (record) window.localStorage.setItem(persistedOrderKey(id), JSON.stringify(record));
}

function getUser(request: Request): MockUser | undefined {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  const userId = token && tokens.get(token);
  return userId ? [...users.values()].find((user) => user.id === userId) : undefined;
}

function unauthorized() {
  return HttpResponse.json({ message: 'Sessão inválida ou expirada.' }, { status: 401 });
}

function userData(user: MockUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  };
}

function getFavorites(userId: string): Set<string> {
  let result = favorites.get(userId);
  if (!result) {
    result = new Set<string>();
    favorites.set(userId, result);
  }
  return result;
}

function getCart(userId: string): OrderItem[] {
  let result = carts.get(userId);
  if (!result) {
    result = [];
    carts.set(userId, result);
  }
  return result;
}

function createQuote(subtotalETH: string, coupon = '') {
  const subtotal = new BigNumber(subtotalETH);
  if (!subtotal.isFinite() || subtotal.isNegative()) {
    return null;
  }
  const code = coupon.trim().toUpperCase();
  if (code && code !== 'KURIO10') {
    return null;
  }
  const discountETH = code === 'KURIO10' ? subtotal.multipliedBy('0.1') : new BigNumber(0);
  const networkFeeETH = new BigNumber('0.005');
  return {
    subtotalETH: subtotal.toFixed(),
    discountETH: discountETH.toFixed(),
    networkFeeETH: networkFeeETH.toFixed(),
    totalETH: subtotal.minus(discountETH).plus(networkFeeETH).toFixed(),
    coupon: code || null,
  };
}

function finalizeOrder(orderId: string): void {
  if (finalizedOrders.has(orderId)) return;
  const record = orders.get(orderId);
  if (!record || record.order.status !== 'confirmed') return;
  const userId = String(record.order.userId);
  const cart = getCart(userId);
  record.request.items.forEach(({ id, quantity }) => {
    const cartItem = cart.find((item) => item.id === id);
    if (cartItem) cartItem.quantity -= quantity;
    const nft = mockNFTs.find((item) => item.id === id);
    if (nft) {
      nft.available = Math.max(0, nft.available - quantity);
      nft.version += 1;
    }
  });
  carts.set(userId, cart.filter((item) => item.quantity > 0));
  finalizedOrders.add(orderId);
}

export const handlers = [
  http.get('/api/nfts', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.trim() ?? '';
    const category = url.searchParams.get('category') ?? '';
    const rarity = url.searchParams.get('rarity') ?? '';
    const sort = url.searchParams.get('sort') ?? '';
    const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
    const pageSize = Math.min(24, Math.max(1, Number(url.searchParams.get('pageSize')) || 9));

    if (
      url.searchParams.get('scenario') === 'server-error'
      || request.headers.get('x-mock-scenario') === 'catalog-error'
    ) {
      return HttpResponse.json({ message: 'Falha temporária ao carregar o catálogo.' }, { status: 503 });
    }
    if (url.searchParams.get('scenario') === 'empty') {
      return HttpResponse.json({ data: [], pagination: { page, pageSize, total: 0, totalPages: 0 } });
    }

    const user = getUser(request);
    const userFavorites = user ? getFavorites(user.id) : new Set<string>();
    const catalog = queryMockNFTCatalog({ search, category, rarity, sort, page, pageSize });
    return HttpResponse.json({
      data: catalog.data.map((nft) => ({
        ...nft,
        favorite: userFavorites.has(nft.id),
      })),
      pagination: catalog.pagination,
    });
  }),

  http.get('/api/nfts/:id', ({ params, request }) => {
    const nft = mockNFTs.find((item) => item.id === params.id);
    if (!nft) return HttpResponse.json({ message: 'NFT não encontrado.' }, { status: 404 });
    const user = getUser(request);
    return HttpResponse.json({ data: { ...nft, favorite: user ? getFavorites(user.id).has(nft.id) : false } });
  }),

  http.post('/api/auth/register', async ({ request }) => {
    const body = (await request.json()) as { name?: string; email?: string; password?: string };
    const email = body.email?.trim().toLowerCase() ?? '';
    if (!body.name?.trim() || !email.includes('@') || (body.password?.length ?? 0) < 8) {
      return HttpResponse.json({ message: 'Informe nome, e-mail válido e senha com pelo menos 8 caracteres.' }, { status: 400 });
    }
    if (users.has(email)) return HttpResponse.json({ message: 'Já existe uma conta com este e-mail.' }, { status: 409 });

    const user: MockUser = {
      id: `user-${users.size + 1}`,
      name: body.name.trim(),
      email,
      avatar: '/favicon.svg',
      password: body.password!,
    };
    const token = `mock-jwt-${user.id}-${Date.now()}`;
    users.set(email, user);
    tokens.set(token, user.id);
    return HttpResponse.json({ token, user: userData(user) }, { status: 201 });
  }),

  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };
    const user = users.get(body.email?.trim().toLowerCase() ?? '');
    if (!user || user.password !== body.password) {
      return HttpResponse.json({ message: 'E-mail ou senha inválidos.' }, { status: 401 });
    }
    const token = user.id === 'user-1' ? 'mock-jwt-token-kurio-123' : user.id === 'user-2' ? 'mock-jwt-token-kurio-456' : `mock-jwt-${user.id}-${Date.now()}`;
    tokens.set(token, user.id);
    return HttpResponse.json({ token, user: userData(user) });
  }),

  http.get('/api/auth/session', ({ request }) => {
    const user = getUser(request);
    return user ? HttpResponse.json({ user: userData(user) }) : unauthorized();
  }),

  http.post('/api/auth/logout', ({ request }) => {
    const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    if (token) tokens.delete(token);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get('/api/favorites', ({ request }) => {
    const user = getUser(request);
    if (!user) return unauthorized();
    return HttpResponse.json({ data: [...getFavorites(user.id)] });
  }),

  http.post('/api/favorites/:id', ({ params, request }) => {
    const user = getUser(request);
    if (!user) return unauthorized();
    if (request.headers.get('x-mock-scenario') === 'favorite-error') {
      return HttpResponse.json({ message: 'Falha simulada ao atualizar favoritos.' }, { status: 503 });
    }
    if (!mockNFTs.some((nft) => nft.id === params.id)) {
      return HttpResponse.json({ message: 'NFT não encontrado.' }, { status: 404 });
    }
    getFavorites(user.id).add(String(params.id));
    return HttpResponse.json({ data: [...getFavorites(user.id)] });
  }),

  http.delete('/api/favorites/:id', ({ params, request }) => {
    const user = getUser(request);
    if (!user) return unauthorized();
    if (request.headers.get('x-mock-scenario') === 'favorite-error') {
      return HttpResponse.json({ message: 'Falha simulada ao atualizar favoritos.' }, { status: 503 });
    }
    getFavorites(user.id).delete(String(params.id));
    return HttpResponse.json({ data: [...getFavorites(user.id)] });
  }),

  http.get('/api/cart', ({ request }) => {
    const user = getUser(request);
    if (!user) return unauthorized();
    return HttpResponse.json({ data: getCart(user.id) });
  }),

  http.post('/api/cart', async ({ request }) => {
    const user = getUser(request);
    if (!user) return unauthorized();
    const body = (await request.json()) as OrderItem;
    const nft = mockNFTs.find((item) => item.id === body.id);
    if (!nft) return HttpResponse.json({ message: 'NFT não encontrado.' }, { status: 404 });
    if (!Number.isInteger(body.quantity) || body.quantity < 1 || body.quantity > nft.available) {
      return HttpResponse.json({ message: 'Quantidade indisponível.' }, { status: 409 });
    }
    const cart = getCart(user.id);
    const existing = cart.find((item) => item.id === body.id);
    if (existing) existing.quantity = Math.min(nft.available, existing.quantity + body.quantity);
    else cart.push(body);
    return HttpResponse.json({ data: cart });
  }),

  http.put('/api/cart/:id', async ({ params, request }) => {
    const user = getUser(request);
    if (!user) return unauthorized();
    const body = (await request.json()) as { quantity: number };
    const nft = mockNFTs.find((item) => item.id === params.id);
    if (!nft || !Number.isInteger(body.quantity) || body.quantity < 1 || body.quantity > nft.available) {
      return HttpResponse.json({ message: 'Quantidade indisponível.' }, { status: 409 });
    }
    const cart = getCart(user.id);
    const item = cart.find((entry) => entry.id === params.id);
    if (!item) return HttpResponse.json({ message: 'Item não encontrado no carrinho.' }, { status: 404 });
    item.quantity = body.quantity;
    return HttpResponse.json({ data: cart });
  }),

  http.delete('/api/cart/:id', ({ params, request }) => {
    const user = getUser(request);
    if (!user) return unauthorized();
    const cart = getCart(user.id).filter((item) => item.id !== params.id);
    carts.set(user.id, cart);
    return HttpResponse.json({ data: cart });
  }),

  http.put('/api/cart', async ({ request }) => {
    const user = getUser(request);
    if (!user) return unauthorized();
    const body = (await request.json()) as { items: OrderItem[] };
    if (!Array.isArray(body.items)) {
      return HttpResponse.json({ message: 'O formato do carrinho é inválido.' }, { status: 400 });
    }
    const ids = new Set<string>();
    for (const item of body.items) {
      const nft = mockNFTs.find((entry) => entry.id === item.id);
      if (!nft || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > nft.available || ids.has(item.id)) {
        return HttpResponse.json({ message: `Quantidade ou disponibilidade inválida para ${item.id}.` }, { status: 409 });
      }
      ids.add(item.id);
    }
    carts.set(user.id, body.items.map((item) => ({ ...item })));
    return HttpResponse.json({ data: getCart(user.id) });
  }),

  http.post('/api/checkout/quote', async ({ request }) => {
    const user = getUser(request);
    if (!user) return unauthorized();
    const body = (await request.json()) as { coupon?: string };
    const subtotal = getCart(user.id).reduce((total, item) => {
      const nft = mockNFTs.find((entry) => entry.id === item.id);
      return nft ? total.plus(new BigNumber(nft.priceETH).multipliedBy(item.quantity)) : total;
    }, new BigNumber(0));
    if (subtotal.isZero()) {
      return HttpResponse.json({ message: 'O carrinho não contém itens disponíveis.' }, { status: 409 });
    }
    const quote = createQuote(subtotal.toFixed(), body.coupon);
    if (!quote) return HttpResponse.json({ message: 'Cupão inválido ou subtotal incorreto.' }, { status: 400 });
    return HttpResponse.json(quote);
  }),

  http.get('/api/wallets', ({ request }) => {
    const user = getUser(request);
    if (!user) return unauthorized();
    return HttpResponse.json({ data: wallets.get(user.id) ?? [] });
  }),

  http.post('/api/wallets', async ({ request }) => {
    const user = getUser(request);
    if (!user) return unauthorized();
    const body = (await request.json()) as { name?: string; address?: string };
    if (!body.name?.trim() || !/^0x[a-fA-F0-9]{40}$/.test(body.address ?? '')) {
      return HttpResponse.json({ message: 'Informe um nome e um endereço Ethereum válido.' }, { status: 400 });
    }
    const userWallets = wallets.get(user.id) ?? [];
    const wallet = { id: `wallet-${Date.now()}`, name: body.name.trim(), address: body.address!, balanceETH: '0.0000', isDefault: userWallets.length === 0 };
    userWallets.push(wallet);
    wallets.set(user.id, userWallets);
    return HttpResponse.json({ data: wallet }, { status: 201 });
  }),

  http.put('/api/wallets/:id', async ({ params, request }) => {
    const user = getUser(request);
    if (!user) return unauthorized();
    const body = (await request.json()) as { isDefault?: boolean; name?: string; address?: string };
    const userWallets = wallets.get(user.id) ?? [];
    const wallet = userWallets.find((entry) => entry.id === params.id);
    if (!wallet) return HttpResponse.json({ message: 'Carteira não encontrada.' }, { status: 404 });
    if (body.name !== undefined && !body.name.trim()) {
      return HttpResponse.json({ message: 'O nome da carteira é obrigatório.' }, { status: 400 });
    }
    if (body.address !== undefined && !/^0x[a-fA-F0-9]{40}$/.test(body.address)) {
      return HttpResponse.json({ message: 'Endereço Ethereum inválido.' }, { status: 400 });
    }
    if (body.isDefault) {
      userWallets.forEach((entry) => { entry.isDefault = entry.id === wallet.id; });
    }
    if (body.name !== undefined) wallet.name = body.name.trim();
    if (body.address !== undefined) wallet.address = body.address;
    wallets.set(user.id, userWallets);
    return HttpResponse.json({ data: wallet });
  }),

  http.get('/api/profile', ({ request }) => {
    const user = getUser(request);
    if (!user) return unauthorized();
    return HttpResponse.json({ data: profiles.get(user.id) ?? userData(user) });
  }),

  http.put('/api/profile', async ({ request }) => {
    const user = getUser(request);
    if (!user) return unauthorized();
    const body = (await request.json()) as { name?: string; avatar?: string };
    if (!body.name?.trim()) return HttpResponse.json({ message: 'O nome é obrigatório.' }, { status: 400 });
    const profile = { ...userData(user), name: body.name.trim(), avatar: body.avatar?.trim() || user.avatar };
    profiles.set(user.id, profile);
    users.set(user.email, { ...user, name: profile.name, avatar: profile.avatar });
    return HttpResponse.json({ data: profile });
  }),

  http.post('/api/profile/password', async ({ request }) => {
    const user = getUser(request);
    if (!user) return unauthorized();
    const body = (await request.json()) as { currentPassword?: string; newPassword?: string };
    if (body.currentPassword !== user.password) {
      return HttpResponse.json({ message: 'A senha atual está incorreta.' }, { status: 400 });
    }
    if ((body.newPassword?.length ?? 0) < 8) {
      return HttpResponse.json({ message: 'A nova senha deve conter pelo menos 8 caracteres.' }, { status: 400 });
    }
    users.set(user.email, { ...user, password: body.newPassword! });
    return HttpResponse.json({ message: 'Senha atualizada.' });
  }),

  http.post('/api/orders', async ({ request }) => {
    const user = getUser(request);
    if (!user) return unauthorized();
    const key = request.headers.get('x-idempotency-key');
    if (!key) return HttpResponse.json({ message: 'Chave de idempotência obrigatória.' }, { status: 400 });
    const body = (await request.json()) as OrderRequest;
    const existingId = ordersByIdempotencyKey.get(key);
    if (existingId) {
      const existing = orders.get(existingId)!;
      if (String(existing.order.userId) !== user.id || JSON.stringify(existing.request) !== JSON.stringify(body)) {
        return HttpResponse.json({ message: 'A chave de idempotência já foi usada com outro pedido.' }, { status: 409 });
      }
      if (request.headers.get('x-mock-scenario') === 'timeout-after-create' && !timedOutOrderKeys.has(key)) {
        timedOutOrderKeys.add(key);
        return HttpResponse.json({ message: 'Tempo limite após criação; repita com a mesma chave.' }, { status: 504 });
      }
      if (existing.order.status === 'pending') {
        existing.order.status = 'confirmed';
        finalizeOrder(existingId);
        persistOrder(existingId);
      }
      return HttpResponse.json({ order: existing.order });
    }

    if (!Array.isArray(body.items) || body.items.length === 0 || !body.walletId || !body.network) {
      return HttpResponse.json({ message: 'Dados do pedido incompletos.' }, { status: 400 });
    }
    const userWallets = wallets.get(user.id) ?? [];
    if (!userWallets.some((wallet) => wallet.id === body.walletId)) {
      return HttpResponse.json({ message: 'Carteira inválida.' }, { status: 400 });
    }
    const currentCart = getCart(user.id);
    const quoteSubtotal = body.items.reduce((sum, item) => {
      const nft = mockNFTs.find((entry) => entry.id === item.id);
      return nft && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= nft.available
        ? sum.plus(new BigNumber(nft.priceETH).multipliedBy(item.quantity))
        : sum;
    }, new BigNumber(0));
    if (body.items.some((item) => !currentCart.some((cartItem) => cartItem.id === item.id && cartItem.quantity >= item.quantity))) {
      return HttpResponse.json({ message: 'O carrinho mudou ou a edição ficou indisponível.' }, { status: 409 });
    }
    const quote = createQuote(quoteSubtotal.toFixed(), body.coupon);
    if (!quote) return HttpResponse.json({ message: 'Cotação inválida.' }, { status: 400 });
    if (quote.totalETH !== body.totalETH) {
      return HttpResponse.json({ message: 'A cotação mudou. Revise o novo total antes de confirmar.', quote }, { status: 409 });
    }

    const scenario = request.headers.get('x-mock-scenario');
    const id = `order-${Date.now()}`;
    const order = {
      id,
      status: scenario === 'payment-declined' ? 'declined' : scenario === 'timeout-after-create' ? 'pending' : 'confirmed',
      userId: user.id,
      items: body.items.map((item) => {
        const nft = mockNFTs.find((entry) => entry.id === item.id)!;
        return { id: nft.id, name: nft.name, priceETH: nft.priceETH, quantity: item.quantity, imageUrl: nft.imageUrl };
      }),
      ...quote,
      walletId: body.walletId,
      network: body.network,
      transactionHash: `0x${id.replace(/[^a-f0-9]/gi, '').padEnd(64, '0').slice(0, 64)}`,
      createdAt: new Date().toISOString(),
    };
    orders.set(id, { request: body, order });
    ordersByIdempotencyKey.set(key, id);

    if (scenario === 'timeout-after-create' && !timedOutOrderKeys.has(key)) {
      timedOutOrderKeys.add(key);
      persistOrder(id);
      return HttpResponse.json({ message: 'Tempo limite após criação; repita com a mesma chave.' }, { status: 504 });
    }
    finalizeOrder(id);
    persistOrder(id);
    return HttpResponse.json({ order });
  }),

  http.get('/api/orders/:id', ({ params, request }) => {
    const user = getUser(request);
    if (!user) return unauthorized();
    const id = String(params.id);
    let record = orders.get(id);
    if (!record) {
      const serialized = window.localStorage.getItem(persistedOrderKey(id));
      if (serialized) {
        const parsed: unknown = JSON.parse(serialized);
        if (
          typeof parsed === 'object'
          && parsed !== null
          && 'request' in parsed
          && 'order' in parsed
          && typeof parsed.request === 'object'
          && parsed.request !== null
          && typeof parsed.order === 'object'
          && parsed.order !== null
        ) {
          record = parsed as { request: OrderRequest; order: Record<string, unknown> };
          orders.set(id, record);
        }
      }
    }
    if (!record || record.order.userId !== user.id) return HttpResponse.json({ message: 'Pedido não encontrado.' }, { status: 404 });
    return HttpResponse.json({ order: record.order });
  }),
];
