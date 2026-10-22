# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: flow.spec.ts >> Desafio Kurio - Fluxos E2E >> Deve realizar login com credenciais de teste com sucesso
- Location: e2e/flow.spec.ts:45:3

# Error details

```
Error: locator.click: Error: strict mode violation: getByRole('button', { name: 'Entrar', exact: true }) resolved to 2 elements:
    1) <button class="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2  bg-[#E28743] hover:bg-[#c97435] text-[#120E0C] font-semibold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer">…</button> aka getByRole('link', { name: 'Entrar' }).getByRole('button')
    2) <button type="submit" class="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2  w-full bg-[#E28743] hover:bg-[#c97435] text-[#120E0C] font-bold text-xs py-3 rounded-xl cursor-pointer mt-2">Entrar</button> aka getByRole('main').getByRole('button', { name: 'Entrar' })

Call log:
  - waiting for getByRole('button', { name: 'Entrar', exact: true })

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - link "KURIO" [ref=e5] [cursor=pointer]:
      - /url: /
    - navigation [ref=e6]:
      - link "Início" [ref=e7] [cursor=pointer]:
        - /url: /
      - link "Mercado" [ref=e8] [cursor=pointer]:
        - /url: /
      - link "Criadores" [ref=e9] [cursor=pointer]:
        - /url: "#criadores"
      - link "Aprenda" [ref=e10] [cursor=pointer]:
        - /url: "#aprenda"
    - generic [ref=e11]:
      - button "Pesquisar" [ref=e12] [cursor=pointer]
      - link [ref=e15] [cursor=pointer]:
        - /url: /cart
      - link [ref=e18] [cursor=pointer]:
        - /url: /login
        - button "Entrar" [ref=e19]
  - main [ref=e23]:
    - generic [ref=e25]:
      - heading "KURIO" [level=1] [ref=e26]
      - heading "Entrar" [level=2] [ref=e27]
      - generic [ref=e28]:
        - textbox "E-mail" [ref=e30]:
          - /placeholder: contato@email.com
          - text: colecionador@kurio.io
        - generic [ref=e31]:
          - textbox "Senha" [active] [ref=e32]: kurio123
          - button [ref=e33] [cursor=pointer]
        - generic [ref=e37]: Recuperação de senha indisponível no ambiente simulado.
        - button "Entrar" [ref=e38] [cursor=pointer]
      - generic [ref=e39]: Ou continue com
      - generic [ref=e43]:
        - button "Google (indisponível no mock)" [disabled] [ref=e44]
        - button "Facebook (indisponível no mock)" [disabled] [ref=e51]
      - button "Novo na Kurio? Crie uma conta" [ref=e56] [cursor=pointer]
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
  34 |     await expect(cartBadge).toBeVisible();
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
> 53 |     await page.getByRole('button', { name: 'Entrar', exact: true }).click();
     |                                                                     ^ Error: locator.click: Error: strict mode violation: getByRole('button', { name: 'Entrar', exact: true }) resolved to 2 elements:
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