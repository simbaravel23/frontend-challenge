# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: flow.spec.ts >> Kurio Marketplace — fluxos principais >> conclui compra e recupera recibo confirmado
- Location: e2e/flow.spec.ts:85:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/pedido confirmado|recibo|sucesso/i)
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText(/pedido confirmado|recibo|sucesso/i) with timeout 10000ms
  - waiting for getByText(/pedido confirmado|recibo|sucesso/i)

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
    - text: Criadores Aprenda
  - button "Pesquisar":
    - img
  - link "Carrinho":
    - /url: /cart
    - img
  - link "Perfil":
    - /url: /profile
  - button "Sair"
- main:
  - article:
    - heading "Aquisição Confirmada" [level=1]
    - status: O pedido foi confirmado pela simulação.
    - term: ID do pedido
    - definition: order-1792667179490
    - term: Estado
    - definition: confirmed
    - term: Carteira
    - definition: wallet-1
    - term: Rede
    - definition: ethereum
    - term: Referência simulada
    - definition: "0xde17926671794900000000000000000000000000000000000000000000000000"
    - heading "Itens do pedido" [level=2]
    - paragraph: "Emerald Ape #042"
    - paragraph: "Quantidade: 1"
    - paragraph: 1.19 × 1 ETH
    - term: Subtotal
    - definition: 1.19 ETH
    - term: Desconto
    - definition: −0 ETH
    - term: Taxa de rede
    - definition: 0.005 ETH
    - term: Total
    - definition: 1.195 ETH
    - link "Voltar ao Marketplace":
      - /url: /
      - button "Voltar ao Marketplace"
- contentinfo:
  - text: W
  - heading "Segurança da carteira" [level=4]
  - paragraph: Proteja sua carteira e colecione arte digital verificada com confiança.
  - text: C
  - heading "Criadores em destaque" [level=4]
  - paragraph: Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.
  - text: D
  - heading "Alertas de lançamentos" [level=4]
  - paragraph: Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.
  - heading "Antecipe-se ao próximo lançamento" [level=4]
  - textbox "E-mail para newsletter":
    - /placeholder: digite seu e-mail...
  - button "Enviar" [disabled]
  - paragraph: Inscrição na newsletter indisponível na simulação.
  - text: KURIO Feito para colecionadores, criadores e cultura contato@email.com +55 11 4002 8922
  - heading "Meu perfil" [level=5]
  - list:
    - listitem:
      - link "Meu perfil":
        - /url: /profile
    - listitem: Minha coleção (fora do escopo)
    - listitem: Atividade (fora do escopo)
    - listitem: Estúdio do criador (fora do escopo)
    - listitem: Lista de interesse (fora do escopo)
  - heading "Central de ajuda" [level=5]
  - list:
    - listitem: Central de ajuda (fora do escopo)
    - listitem: Como comprar NFTs (fora do escopo)
    - listitem: Carteira e segurança (fora do escopo)
    - listitem: Política do mercado (fora do escopo)
    - listitem: Denunciar item (fora do escopo)
  - heading "Coleções" [level=5]
  - list:
    - listitem:
      - link "Arte digital":
        - /url: /?category=Arte+digital&page=1
    - listitem:
      - link "Fotografia":
        - /url: /?category=Fotografia&page=1
    - listitem:
      - link "Música":
        - /url: /?category=M%C3%BAsica&page=1
    - listitem:
      - link "Arte 3D":
        - /url: /?category=Arte+3D&page=1
    - listitem:
      - link "Utilidade":
        - /url: /?category=Utilidade&page=1
  - heading "Redes sociais" [level=5]
  - text: f ig tw in yt
  - heading "Carteiras compatíveis" [level=5]
  - text: METAMASK WALLETCONNECT COINBASE © 2026 Kurio - Proprietários de arte digital. Todos os direitos reservados.
```

# Test source

```ts
  1   | import { expect, test, type Page } from '@playwright/test';
  2   | 
  3   | async function signInAsSeedUser(page: Page) {
  4   |   await page.goto('/login');
  5   |   const form = page.getByRole('main');
  6   |   await form.getByLabel('E-mail', { exact: true }).fill('colecionador@kurio.io');
  7   |   await form.getByLabel('Senha', { exact: true }).fill('kurio123');
  8   |   await form.getByRole('button', { name: 'Entrar', exact: true }).click();
  9   |   await expect(page.getByRole('button', { name: 'Sair', exact: true })).toBeVisible();
  10  | }
  11  | 
  12  | async function addFirstNFTToCart(page: Page) {
  13  |   await page.getByRole('button', { name: /Adicionar .* ao carrinho/i }).first().click();
  14  | }
  15  | 
  16  | test.describe('Kurio Marketplace — fluxos principais', () => {
  17  |   test('combina filtros, ordenação, paginação e histórico da URL', async ({ page }) => {
  18  |     await page.goto('/');
  19  |     await expect(page.getByRole('link', { name: 'KURIO' })).toBeVisible();
  20  |     await expect(page.getByRole('heading', { name: /SEJA DONO DO FUTURO/i })).toBeVisible();
  21  |     await expect(page.getByRole('navigation', { name: 'Paginação do catálogo' })).toBeVisible();
  22  | 
  23  |     await page.getByRole('button', { name: /Música/ }).click();
  24  |     await expect(page).toHaveURL(/category=M%C3%BAsica/);
  25  |     await page.getByLabel('Ordenar catálogo').selectOption('price-asc');
  26  |     await expect(page).toHaveURL(/sort=price-asc/);
  27  |     await page.getByLabel('Pesquisar NFT').fill('Echoes');
  28  |     await expect(page).toHaveURL(/search=Echoes/);
  29  |     await expect(page.getByRole('heading', { name: 'Echoes #777' })).toBeVisible();
  30  | 
  31  |     await page.goBack();
  32  |     await expect(page.getByLabel('Pesquisar NFT')).toHaveValue('');
  33  |     await expect(page.getByLabel('Ordenar catálogo')).toHaveValue('price-asc');
  34  |   });
  35  | 
  36  |   test('abre detalhe diretamente e trata NFT inexistente', async ({ page }) => {
  37  |     await page.goto('/nfts/emerald-ape-042');
  38  |     await expect(page.getByRole('heading', { name: 'Emerald Ape #042' })).toBeVisible();
  39  |     await expect(page.getByLabel('Quantidade')).toHaveValue('1');
  40  | 
  41  |     await page.goto('/nfts/id-que-nao-existe');
  42  |     await expect(page.getByRole('heading', { name: 'NFT não encontrado' })).toBeVisible();
  43  |   });
  44  | 
  45  |   test('persiste quantidades do carrinho após refresh', async ({ page }) => {
  46  |     await page.goto('/');
  47  |     await addFirstNFTToCart(page);
  48  |     await page.getByRole('link', { name: 'Carrinho' }).click();
  49  |     const quantity = page.getByRole('spinbutton', { name: 'Quantidade de Emerald Ape #042' });
  50  |     await quantity.fill('2');
  51  |     await expect(quantity).toHaveValue('2');
  52  |     await expect(page.getByText('2.38 ETH')).toBeVisible();
  53  | 
  54  |     await page.reload();
  55  |     await expect(page.getByRole('spinbutton', { name: 'Quantidade de Emerald Ape #042' })).toHaveValue('2');
  56  |     await expect(page.getByText('Resumo da Ordem')).toBeVisible();
  57  |   });
  58  | 
  59  |   test('realiza login com credenciais fictícias e encerra a sessão', async ({ page }) => {
  60  |     await page.goto('/login');
  61  |     const form = page.getByRole('main');
  62  |     await form.getByLabel('E-mail', { exact: true }).fill('colecionador@kurio.io');
  63  |     await form.getByLabel('Senha', { exact: true }).fill('senha-incorreta');
  64  |     await form.getByRole('button', { name: 'Entrar', exact: true }).click();
  65  |     await expect(page.getByRole('alert')).toContainText('inválidos');
  66  | 
  67  |     await form.getByLabel('Senha', { exact: true }).fill('kurio123');
  68  |     await form.getByRole('button', { name: 'Entrar', exact: true }).click();
  69  |     await expect(page).toHaveURL(/\/(?:\?.*)?$/);
  70  |     await expect(page.getByRole('button', { name: 'Sair', exact: true })).toBeVisible();
  71  |     await page.getByRole('button', { name: 'Sair' }).click();
  72  |     await expect(page.getByRole('link', { name: 'Entrar', exact: true })).toBeVisible();
  73  |   });
  74  | 
  75  |   test('faz rollback de favorito quando a API falha', async ({ page }) => {
  76  |     await signInAsSeedUser(page);
  77  |     await page.evaluate(() => localStorage.setItem('kurio_mock_scenario', 'favorite-error'));
  78  |     await page.goto('/');
  79  |     const favorite = page.getByRole('button', { name: 'Adicionar Emerald Ape #042 aos favoritos' });
  80  |     await favorite.click();
  81  |     await expect(page.getByRole('alert')).toContainText('Não foi possível atualizar');
  82  |     await expect(page.getByRole('button', { name: 'Adicionar Emerald Ape #042 aos favoritos' })).toHaveAttribute('aria-pressed', 'false');
  83  |   });
  84  | 
  85  |   test('conclui compra e recupera recibo confirmado', async ({ page }) => {
  86  |   await signInAsSeedUser(page);
  87  |   await page.goto('/');
  88  |   await addFirstNFTToCart(page);
  89  |   await page.getByRole('link', { name: 'Carrinho' }).click();
  90  |   await page.getByRole('link', { name: /Avançar para o Checkout/i }).click();
  91  |   await expect(page.getByRole('heading', { name: 'Finalizar Aquisição' })).toBeVisible();
  92  |   
  93  |   const confirm = page.getByRole('button', { name: 'Confirmar e Pagar' });
  94  |   await expect(confirm).toBeEnabled();
  95  |   
  96  |   // 1. Clicar efetivamente para finalizar a compra
  97  |   await confirm.click();
  98  | 
  99  |   // 2. Validar que a aplicação redirecionou para o recibo ou exibe a confirmação do pedido
> 100 |   await expect(page.getByText(/pedido confirmado|recibo|sucesso/i)).toBeVisible({ timeout: 10000 });
      |                                                                     ^ Error: expect(locator).toBeVisible() failed
  101 | });
  102 | 
  103 |   test('mantém o carrinho em recusa e recupera timeout com a mesma chave', async ({ page }) => {
  104 |     await signInAsSeedUser(page);
  105 |     await page.evaluate(() => localStorage.setItem('kurio_mock_scenario', 'payment-declined'));
  106 |     await page.goto('/');
  107 |     await addFirstNFTToCart(page);
  108 |     await page.goto('/cart/checkout');
  109 |     await page.getByRole('button', { name: 'Confirmar e Pagar' }).click();
  110 |     await expect(page.getByRole('alert')).toContainText('Pagamento recusado');
  111 |     await expect(page.getByRole('link', { name: 'Carrinho' })).toContainText('1');
  112 |   });
  113 | 
  114 |   test('edita perfil e adiciona carteira com validação', async ({ page }) => {
  115 |     await signInAsSeedUser(page);
  116 |     await page.goto('/profile');
  117 |     await expect(page.getByRole('heading', { name: 'Perfil do Colecionador' })).toBeVisible();
  118 |     await page.getByLabel('Nome de Exibição').fill('Colecionador Atualizado');
  119 |     await page.getByRole('button', { name: 'Guardar Alterações' }).click();
  120 |     await expect(page.getByRole('status')).toContainText('guardadas');
  121 | 
  122 |     await page.getByLabel('Nome da carteira').fill('Carteira de Teste');
  123 |     await page.getByLabel('Endereço Ethereum').fill('0x1234567890123456789012345678901234567890');
  124 |     await page.getByRole('button', { name: 'Adicionar Carteira' }).click();
  125 |     await expect(page.getByText('Carteira de Teste')).toBeVisible();
  126 |   });
  127 | 
  128 |   test('atualiza preço por Socket.IO e adapta a interface mobile', async ({ page }) => {
  129 |     await page.setViewportSize({ width: 390, height: 844 });
  130 |     await signInAsSeedUser(page);
  131 |     await page.evaluate(() => localStorage.setItem('kurio_mock_scenario', 'socket-update'));
  132 |     await page.goto('/');
  133 |     await expect(page.getByRole('status').filter({ hasText: 'mudou para' })).toBeVisible({ timeout: 10000 });
  134 |     const dimensions = await page.evaluate(() => ({
  135 |       documentWidth: document.documentElement.scrollWidth,
  136 |       viewportWidth: document.documentElement.clientWidth,
  137 |     }));
  138 |     expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
  139 |   });
  140 | });
  141 | 
```