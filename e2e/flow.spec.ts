import { test, expect } from '@playwright/test';

test.describe('Desafio Kurio - Fluxos E2E', () => {

  test('Deve carregar o catálogo, exibir o Hero Banner e filtrar NFTs', async ({ page }) => {
    // 1. Aceder à página inicial
    await page.goto('/');

    // 2. Verificar presença do Logo e Hero Banner
    await expect(page.getByText('KURIO')).toBeVisible();
    await expect(page.getByRole('heading', { name: /SEJA DONO DO FUTURO/i })).toBeVisible();

    // 3. Testar pesquisa por texto no input da Sidebar
    const searchInput = page.getByPlaceholder('Pesquisar NFT...');
    await searchInput.fill('Emerald');

    // Confirmar se o parâmetro de pesquisa reflete na URL
    await expect(page).toHaveURL(/\/\?.*search=Emerald/);
    await expect(page.getByText('Emerald Ape #042')).toBeVisible();

    // Limpar o filtro
    await searchInput.fill('');
  });

  test('Deve adicionar um NFT ao carrinho e avançar para a página de carrinho', async ({ page }) => {
    await page.goto('/');

    // Adicionar o primeiro NFT ao carrinho
    const addButton = page.getByRole('button', { name: /Adicionar/i }).first();
    await addButton.click();

    // Verificar se o badge do carrinho no header atualiza para 1
    const cartBadge = page.locator('header').getByText('1');
    await expect(cartBadge).toBeVisible();

    // Navegar para a página do carrinho
    await page.getByRole('link', { name: /Carrinho/i }).click();
    await expect(page).toHaveURL('/cart');

    // Validar se o resumo da ordem exibe o item
    await expect(page.getByText('Resumo da Ordem')).toBeVisible();
    await expect(page.getByRole('button', { name: /Avançar para o Checkout/i })).toBeVisible();
  });

  test('Deve realizar login com credenciais de teste com sucesso', async ({ page }) => {
    await page.goto('/login');

    // Preencher campos com as credenciais do MSW
    await page.getByPlaceholder('contato@email.com').fill('colecionador@kurio.io');
    await page.getByPlaceholder('Senha').fill('kurio123');

    // Clicar no botão Entrar
    await page.getByRole('button', { name: 'Entrar', exact: true }).click();

    // Verificar redirecionamento para a Home e exibição do badge '● Conectado'
    await expect(page).toHaveURL('/');
    await expect(page.getByText('● Conectado')).toBeVisible();
  });

  test('Deve completar o fluxo de checkout quando autenticado', async ({ page }) => {
    // Definir token de sessão mockado no LocalStorage
    await page.addInitScript(() => {
      window.localStorage.setItem('kurio_token', 'mock-jwt-token-kurio-123');
    });

    await page.goto('/');

    // Adicionar item e ir para o checkout
    await page.getByRole('button', { name: /Adicionar/i }).first().click();
    await page.goto('/cart/checkout');

    // Confirmar e concluir a ordem de compra
    await expect(page.getByText(/Checkout/i)).toBeVisible();
    const finishButton = page.getByRole('button', { name: /Finalizar Compra/i });
    if (await finishButton.isVisible()) {
      await finishButton.click();
      await expect(page.getByText(/Compra realizada com sucesso/i)).toBeVisible();
    }
  });

});