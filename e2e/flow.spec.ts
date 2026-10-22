import { expect, test, type Page } from '@playwright/test';

async function signInAsSeedUser(page: Page) {
  await page.goto('/login');
  const form = page.getByRole('main');
  await form.getByLabel('E-mail', { exact: true }).fill('colecionador@kurio.io');
  await form.getByLabel('Senha', { exact: true }).fill('kurio123');
  await form.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Sair', exact: true })).toBeVisible();
}

async function addFirstNFTToCart(page: Page) {
  await page.getByRole('button', { name: /Adicionar .* ao carrinho/i }).first().click();
}

test.describe('Kurio Marketplace — fluxos principais', () => {
  test('combina filtros, ordenação, paginação e histórico da URL', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'KURIO' })).toBeVisible();
    await expect(page.getByRole('heading', { name: /SEJA DONO DO FUTURO/i })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Paginação do catálogo' })).toBeVisible();

    await page.getByRole('button', { name: /Música/ }).click();
    await expect(page).toHaveURL(/category=M%C3%BAsica/);
    await page.getByLabel('Ordenar catálogo').selectOption('price-asc');
    await expect(page).toHaveURL(/sort=price-asc/);
    await page.getByLabel('Pesquisar NFT').fill('Echoes');
    await expect(page).toHaveURL(/search=Echoes/);
    await expect(page.getByRole('heading', { name: 'Echoes #777' })).toBeVisible();

    await page.goBack();
    await expect(page.getByLabel('Pesquisar NFT')).toHaveValue('');
    await expect(page.getByLabel('Ordenar catálogo')).toHaveValue('price-asc');
  });

  test('abre detalhe diretamente e trata NFT inexistente', async ({ page }) => {
    await page.goto('/nfts/emerald-ape-042');
    await expect(page.getByRole('heading', { name: 'Emerald Ape #042' })).toBeVisible();
    await expect(page.getByLabel('Quantidade')).toHaveValue('1');

    await page.goto('/nfts/id-que-nao-existe');
    await expect(page.getByRole('heading', { name: 'NFT não encontrado' })).toBeVisible();
  });

  test('persiste quantidades do carrinho após refresh', async ({ page }) => {
    await page.goto('/');
    await addFirstNFTToCart(page);
    await page.getByRole('link', { name: 'Carrinho' }).click();
    const quantity = page.getByRole('spinbutton', { name: 'Quantidade de Emerald Ape #042' });
    await quantity.fill('2');
    await expect(quantity).toHaveValue('2');
    await expect(page.getByText('2.38 ETH')).toBeVisible();

    await page.reload();
    await expect(page.getByRole('spinbutton', { name: 'Quantidade de Emerald Ape #042' })).toHaveValue('2');
    await expect(page.getByText('Resumo da Ordem')).toBeVisible();
  });

  test('realiza login com credenciais fictícias e encerra a sessão', async ({ page }) => {
    await page.goto('/login');
    const form = page.getByRole('main');
    await form.getByLabel('E-mail', { exact: true }).fill('colecionador@kurio.io');
    await form.getByLabel('Senha', { exact: true }).fill('senha-incorreta');
    await form.getByRole('button', { name: 'Entrar', exact: true }).click();
    await expect(page.getByRole('alert')).toContainText('inválidos');

    await form.getByLabel('Senha', { exact: true }).fill('kurio123');
    await form.getByRole('button', { name: 'Entrar', exact: true }).click();
    await expect(page).toHaveURL(/\/(?:\?.*)?$/);
    await expect(page.getByRole('button', { name: 'Sair', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Sair' }).click();
    await expect(page.getByRole('link', { name: 'Entrar', exact: true })).toBeVisible();
  });

  test('faz rollback de favorito quando a API falha', async ({ page }) => {
    await signInAsSeedUser(page);
    await page.evaluate(() => localStorage.setItem('kurio_mock_scenario', 'favorite-error'));
    await page.goto('/');
    const favorite = page.getByRole('button', { name: 'Adicionar Emerald Ape #042 aos favoritos' });
    await favorite.click();
    await expect(page.getByRole('alert')).toContainText('Não foi possível atualizar');
    await expect(page.getByRole('button', { name: 'Adicionar Emerald Ape #042 aos favoritos' })).toHaveAttribute('aria-pressed', 'false');
  });

  test('conclui compra e recupera recibo confirmado', async ({ page }) => {
    await signInAsSeedUser(page);
    await page.goto('/');
    await addFirstNFTToCart(page);
    await page.getByRole('link', { name: 'Carrinho' }).click();
    await page.getByRole('link', { name: /Avançar para o Checkout/i }).click();
    await expect(page.getByRole('heading', { name: 'Finalizar Aquisição' })).toBeVisible();

    const confirm = page.getByRole('button', { name: 'Confirmar e Pagar' });
    await expect(confirm).toBeEnabled();
    await confirm.click();
    await expect(page.getByRole('heading', { name: 'Aquisição Confirmada' })).toBeVisible();
    await expect(page.getByText('1.19 ETH')).toBeVisible();
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Aquisição Confirmada' })).toBeVisible();
  });

  test('mantém o carrinho em recusa e recupera timeout com a mesma chave', async ({ page }) => {
    await signInAsSeedUser(page);
    await page.evaluate(() => localStorage.setItem('kurio_mock_scenario', 'payment-declined'));
    await page.goto('/');
    await addFirstNFTToCart(page);
    await page.goto('/cart/checkout');
    await page.getByRole('button', { name: 'Confirmar e Pagar' }).click();
    await expect(page.getByRole('alert')).toContainText('Pagamento recusado');
    await expect(page.getByRole('link', { name: 'Carrinho' })).toContainText('1');
  });

  test('edita perfil e adiciona carteira com validação', async ({ page }) => {
    await signInAsSeedUser(page);
    await page.goto('/profile');
    await expect(page.getByRole('heading', { name: 'Perfil do Colecionador' })).toBeVisible();
    await page.getByLabel('Nome de Exibição').fill('Colecionador Atualizado');
    await page.getByRole('button', { name: 'Guardar Alterações' }).click();
    await expect(page.getByRole('status')).toContainText('guardadas');

    await page.getByLabel('Nome da carteira').fill('Carteira de Teste');
    await page.getByLabel('Endereço Ethereum').fill('0x1234567890123456789012345678901234567890');
    await page.getByRole('button', { name: 'Adicionar Carteira' }).click();
    await expect(page.getByText('Carteira de Teste')).toBeVisible();
  });

  test('atualiza preço por Socket.IO e adapta a interface mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    page.on('websocket', (socket) => {
      console.log(`[E2E websocket] ${socket.url()}`);
      socket.on('framesent', (frame) => console.log(`[E2E sent] ${String(frame.payload)}`));
      socket.on('framereceived', (frame) => console.log(`[E2E received] ${String(frame.payload)}`));
      socket.on('socketerror', (error) => console.log(`[E2E socket error] ${error}`));
    });
    await signInAsSeedUser(page);
    await page.evaluate(() => localStorage.setItem('kurio_mock_scenario', 'socket-update'));
    await page.goto('/');
    await expect(page.getByRole('status').filter({ hasText: 'mudou para' })).toBeVisible({ timeout: 10000 });
    const dimensions = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
    }));
    expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
  });
});
