# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: flow.spec.ts >> Kurio Marketplace — fluxos principais >> abre detalhe diretamente e trata NFT inexistente
- Location: e2e/flow.spec.ts:36:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'NFT não encontrado' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('heading', { name: 'NFT não encontrado' }) with timeout 5000ms
  - waiting for getByRole('heading', { name: 'NFT não encontrado' })

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
  - link "Entrar":
    - /url: /login
    - img
    - text: Entrar
- main: A carregar detalhes do NFT...
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
  3   | const token = 'mock-jwt-token-kurio-123';
  4   | 
  5   | async function signInAsSeedUser(page: Page) {
  6   |   await page.addInitScript((authToken) => {
  7   |     window.localStorage.setItem('kurio_token', authToken);
  8   |     window.localStorage.setItem('kurio_user_id', 'user-1');
  9   |   }, token);
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
> 42  |     await expect(page.getByRole('heading', { name: 'NFT não encontrado' })).toBeVisible();
      |                                                                             ^ Error: expect(locator).toBeVisible() failed
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
  61  |     await page.getByLabel('E-mail').fill('colecionador@kurio.io');
  62  |     await page.getByLabel('Senha').fill('senha-incorreta');
  63  |     await page.getByRole('main').getByRole('button', { name: 'Entrar', exact: true }).click();
  64  |     await expect(page.getByRole('alert')).toContainText('inválidos');
  65  | 
  66  |     await page.getByLabel('Senha').fill('kurio123');
  67  |     await page.getByRole('main').getByRole('button', { name: 'Entrar', exact: true }).click();
  68  |     await expect(page).toHaveURL('/');
  69  |     await expect(page.getByRole('link', { name: 'Perfil' })).toBeVisible();
  70  |     await page.getByRole('button', { name: 'Sair' }).click();
  71  |     await expect(page.getByRole('link', { name: 'Entrar' })).toBeVisible();
  72  |   });
  73  | 
  74  |   test('faz rollback de favorito quando a API falha', async ({ page }) => {
  75  |     await signInAsSeedUser(page);
  76  |     await page.addInitScript(() => localStorage.setItem('kurio_mock_scenario', 'favorite-error'));
  77  |     await page.goto('/');
  78  |     const favorite = page.getByRole('button', { name: 'Adicionar Emerald Ape #042 aos favoritos' });
  79  |     await favorite.click();
  80  |     await expect(page.getByRole('alert')).toContainText('Não foi possível atualizar');
  81  |     await expect(page.getByRole('button', { name: 'Adicionar Emerald Ape #042 aos favoritos' })).toHaveAttribute('aria-pressed', 'false');
  82  |   });
  83  | 
  84  |   test('conclui compra e recupera recibo confirmado', async ({ page }) => {
  85  |     await signInAsSeedUser(page);
  86  |     await page.goto('/');
  87  |     await addFirstNFTToCart(page);
  88  |     await page.getByRole('link', { name: 'Carrinho' }).click();
  89  |     await page.getByRole('link', { name: /Avançar para o Checkout/i }).click();
  90  |     await expect(page.getByRole('heading', { name: 'Finalizar Aquisição' })).toBeVisible();
  91  |     const confirm = page.getByRole('button', { name: 'Confirmar e Pagar' });
  92  |     await expect(confirm).toBeEnabled();
  93  |     await confirm.click();
  94  |     await expect(page.getByRole('heading', { name: 'Aquisição Confirmada' })).toBeVisible();
  95  |     await expect(page.getByText('1.19 ETH')).toBeVisible();
  96  |     await page.reload();
  97  |     await expect(page.getByRole('heading', { name: 'Aquisição Confirmada' })).toBeVisible();
  98  |   });
  99  | 
  100 |   test('mantém o carrinho em recusa e recupera timeout com a mesma chave', async ({ page }) => {
  101 |     await signInAsSeedUser(page);
  102 |     await page.addInitScript(() => localStorage.setItem('kurio_mock_scenario', 'payment-declined'));
  103 |     await page.goto('/');
  104 |     await addFirstNFTToCart(page);
  105 |     await page.goto('/cart/checkout');
  106 |     await page.getByRole('button', { name: 'Confirmar e Pagar' }).click();
  107 |     await expect(page.getByRole('alert')).toContainText('Pagamento recusado');
  108 |     await expect(page.getByRole('link', { name: 'Carrinho' })).toContainText('1');
  109 |   });
  110 | 
  111 |   test('edita perfil e adiciona carteira com validação', async ({ page }) => {
  112 |     await signInAsSeedUser(page);
  113 |     await page.goto('/profile');
  114 |     await expect(page.getByRole('heading', { name: 'Perfil do Colecionador' })).toBeVisible();
  115 |     await page.getByLabel('Nome de Exibição').fill('Colecionador Atualizado');
  116 |     await page.getByRole('button', { name: 'Guardar Alterações' }).click();
  117 |     await expect(page.getByRole('status')).toContainText('guardadas');
  118 | 
  119 |     await page.getByLabel('Nome da carteira').fill('Carteira de Teste');
  120 |     await page.getByLabel('Endereço Ethereum').fill('0x1234567890123456789012345678901234567890');
  121 |     await page.getByRole('button', { name: 'Adicionar Carteira' }).click();
  122 |     await expect(page.getByText('Carteira de Teste')).toBeVisible();
  123 |   });
  124 | 
  125 |   test('atualiza preço por Socket.IO e adapta a interface mobile', async ({ page }) => {
  126 |     await page.setViewportSize({ width: 390, height: 844 });
  127 |     await page.addInitScript(() => localStorage.setItem('kurio_mock_scenario', 'socket-update'));
  128 |     await page.goto('/');
  129 |     await expect(page.getByRole('status').filter({ hasText: 'mudou para' })).toBeVisible({ timeout: 10000 });
  130 |     const dimensions = await page.evaluate(() => ({
  131 |       documentWidth: document.documentElement.scrollWidth,
  132 |       viewportWidth: document.documentElement.clientWidth,
  133 |     }));
  134 |     expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
  135 |   });
  136 | });
  137 | 
```