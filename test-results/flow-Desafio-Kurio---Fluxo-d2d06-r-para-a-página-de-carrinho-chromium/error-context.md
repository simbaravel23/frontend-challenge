# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: flow.spec.ts >> Desafio Kurio - Fluxos E2E >> Deve adicionar um NFT ao carrinho e avançar para a página de carrinho
- Location: e2e/flow.spec.ts:25:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('header').getByText('1')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('header').getByText('1') with timeout 5000ms
  - waiting for locator('header').getByText('1')

```

```yaml
- banner:
  - link "KURIO":
    - /url: /
  - navigation:
    - link "Início":
      - /url: /
    - link "Mercado":
      - /url: /
    - link "Criadores":
      - /url: "#criadores"
    - link "Aprenda":
      - /url: "#aprenda"
  - button "Pesquisar":
    - img
  - link:
    - /url: /cart
    - img
  - link "Entrar":
    - /url: /login
    - button "Entrar":
      - img
      - text: Entrar
- main:
  - heading "KURIO" [level=1]
  - heading "Entrar" [level=2]
  - textbox "E-mail":
    - /placeholder: contato@email.com
  - textbox "Senha"
  - button:
    - img
  - text: Recuperação de senha indisponível no ambiente simulado.
  - button "Entrar"
  - text: Ou continue com
  - button "Google (indisponível no mock)" [disabled]:
    - img
    - text: Google (indisponível no mock)
  - button "Facebook (indisponível no mock)" [disabled]:
    - img
    - text: Facebook (indisponível no mock)
  - button "Novo na Kurio? Crie uma conta"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Desafio Kurio - Fluxos E2E', () => {
  4  | 
  5  |   test('Deve carregar o catálogo, exibir o Hero Banner e filtrar NFTs', async ({ page }) => {
  6  |     // 1. Aceder à página inicial
  7  |     await page.goto('/');
  8  | 
  9  |     // 2. Verificar presença do Logo e Hero Banner
  10 |     await expect(page.getByText('KURIO')).toBeVisible();
  11 |     await expect(page.getByRole('heading', { name: /SEJA DONO DO FUTURO/i })).toBeVisible();
  12 | 
  13 |     // 3. Testar pesquisa por texto no input da Sidebar
  14 |     const searchInput = page.getByPlaceholder('Pesquisar NFT...');
  15 |     await searchInput.fill('Emerald');
  16 | 
  17 |     // Confirmar se o parâmetro de pesquisa reflete na URL
  18 |     await expect(page).toHaveURL(/\/\?.*search=Emerald/);
  19 |     await expect(page.getByText('Emerald Ape #042')).toBeVisible();
  20 | 
  21 |     // Limpar o filtro
  22 |     await searchInput.fill('');
  23 |   });
  24 | 
  25 |   test('Deve adicionar um NFT ao carrinho e avançar para a página de carrinho', async ({ page }) => {
  26 |     await page.goto('/');
  27 | 
  28 |     // Adicionar o primeiro NFT ao carrinho
  29 |     const addButton = page.getByRole('button', { name: /Adicionar/i }).first();
  30 |     await addButton.click();
  31 | 
  32 |     // Verificar se o badge do carrinho no header atualiza para 1
  33 |     const cartBadge = page.locator('header').getByText('1');
> 34 |     await expect(cartBadge).toBeVisible();
     |                             ^ Error: expect(locator).toBeVisible() failed
  35 | 
  36 |     // Navegar para a página do carrinho
  37 |     await page.getByRole('link', { name: /Carrinho/i }).click();
  38 |     await expect(page).toHaveURL('/cart');
  39 | 
  40 |     // Validar se o resumo da ordem exibe o item
  41 |     await expect(page.getByText('Resumo da Ordem')).toBeVisible();
  42 |     await expect(page.getByRole('button', { name: /Avançar para o Checkout/i })).toBeVisible();
  43 |   });
  44 | 
  45 |   test('Deve realizar login com credenciais de teste com sucesso', async ({ page }) => {
  46 |     await page.goto('/login');
  47 | 
  48 |     // Preencher campos com as credenciais do MSW
  49 |     await page.getByPlaceholder('contato@email.com').fill('colecionador@kurio.io');
  50 |     await page.getByPlaceholder('Senha').fill('kurio123');
  51 | 
  52 |     // Clicar no botão Entrar
  53 |     await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  54 | 
  55 |     // Verificar redirecionamento para a Home e exibição do badge '● Conectado'
  56 |     await expect(page).toHaveURL('/');
  57 |     await expect(page.getByText('● Conectado')).toBeVisible();
  58 |   });
  59 | 
  60 |   test('Deve completar o fluxo de checkout quando autenticado', async ({ page }) => {
  61 |     // Definir token de sessão mockado no LocalStorage
  62 |     await page.addInitScript(() => {
  63 |       window.localStorage.setItem('kurio_token', 'mock-jwt-token-kurio-123');
  64 |     });
  65 | 
  66 |     await page.goto('/');
  67 | 
  68 |     // Adicionar item e ir para o checkout
  69 |     await page.getByRole('button', { name: /Adicionar/i }).first().click();
  70 |     await page.goto('/cart/checkout');
  71 | 
  72 |     // Confirmar e concluir a ordem de compra
  73 |     await expect(page.getByText(/Checkout/i)).toBeVisible();
  74 |     const finishButton = page.getByRole('button', { name: /Finalizar Compra/i });
  75 |     if (await finishButton.isVisible()) {
  76 |       await finishButton.click();
  77 |       await expect(page.getByText(/Compra realizada com sucesso/i)).toBeVisible();
  78 |     }
  79 |   });
  80 | 
  81 | });
```