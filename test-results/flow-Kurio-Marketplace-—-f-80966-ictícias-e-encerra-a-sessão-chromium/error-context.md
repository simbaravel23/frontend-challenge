# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: flow.spec.ts >> Kurio Marketplace — fluxos principais >> realiza login com credenciais fictícias e encerra a sessão
- Location: e2e/flow.spec.ts:59:3

# Error details

```
Error: locator.fill: Error: strict mode violation: getByLabel('E-mail') resolved to 2 elements:
    1) <input value="" required="" type="email" aria-label="E-mail" placeholder="contato@email.com" class="w-full bg-[#120E0C] border border-[#342A24] text-white text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-[#E28743] placeholder-[#A19288]/70"/> aka getByRole('textbox', { name: 'E-mail', exact: true })
    2) <input type="email" placeholder="digite seu e-mail..." aria-label="E-mail para newsletter" class="w-full bg-[#1E1815] border border-[#342A24] text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#E28743] font-mono placeholder-[#A19288]"/> aka getByRole('textbox', { name: 'E-mail para newsletter' })

Call log:
  - waiting for getByLabel('E-mail')

```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - banner [ref=f1e4]:
    - link "KURIO" [ref=f1e5] [cursor=pointer]:
      - /url: /
    - navigation [ref=f1e6]:
      - link "Início" [ref=f1e7] [cursor=pointer]:
        - /url: /
      - link "Mercado" [ref=f1e8] [cursor=pointer]:
        - /url: /
      - generic [ref=f1e9]: Criadores
      - generic [ref=f1e10]: Aprenda
    - generic [ref=f1e11]:
      - button "Pesquisar" [ref=f1e12] [cursor=pointer]
      - link "Carrinho" [ref=f1e15] [cursor=pointer]:
        - /url: /cart
      - link "Entrar" [ref=f1e18] [cursor=pointer]:
        - /url: /login
  - main [ref=f1e21]:
    - generic [ref=f1e23]:
      - heading "KURIO" [level=1] [ref=f1e24]
      - heading "Entrar" [level=2] [ref=f1e25]
      - generic [ref=f1e26]:
        - textbox "E-mail" [ref=f1e28]:
          - /placeholder: contato@email.com
        - generic [ref=f1e29]:
          - textbox "Senha" [ref=f1e30]
          - button [ref=f1e31] [cursor=pointer]
        - generic [ref=f1e35]: Recuperação de senha indisponível no ambiente simulado.
        - button "Entrar" [ref=f1e36] [cursor=pointer]
      - generic [ref=f1e37]: Ou continue com
      - generic [ref=f1e41]:
        - button "Google (indisponível no mock)" [disabled] [ref=f1e42]
        - button "Facebook (indisponível no mock)" [disabled] [ref=f1e49]
      - button "Novo na Kurio? Crie uma conta" [ref=f1e54] [cursor=pointer]
  - contentinfo [ref=f1e55]:
    - generic [ref=f1e57]:
      - generic [ref=f1e58]:
        - generic [ref=f1e59]: W
        - heading "Segurança da carteira" [level=4] [ref=f1e60]
        - paragraph [ref=f1e61]: Proteja sua carteira e colecione arte digital verificada com confiança.
      - generic [ref=f1e62]:
        - generic [ref=f1e63]: C
        - heading "Criadores em destaque" [level=4] [ref=f1e64]
        - paragraph [ref=f1e65]: Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.
      - generic [ref=f1e66]:
        - generic [ref=f1e67]: D
        - heading "Alertas de lançamentos" [level=4] [ref=f1e68]
        - paragraph [ref=f1e69]: Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.
      - generic [ref=f1e70]:
        - heading "Antecipe-se ao próximo lançamento" [level=4] [ref=f1e71]
        - generic [ref=f1e72]:
          - textbox "E-mail para newsletter" [ref=f1e73]:
            - /placeholder: digite seu e-mail...
          - button "Enviar" [disabled]
        - paragraph [ref=f1e74]: Inscrição na newsletter indisponível na simulação.
    - generic [ref=f1e75]:
      - generic [ref=f1e76]:
        - generic [ref=f1e77]: KURIO
        - generic [ref=f1e78]: Feito para colecionadores, criadores e cultura
      - generic [ref=f1e79]:
        - generic [ref=f1e80]: contato@email.com
        - generic [ref=f1e81]: +55 11 4002 8922
    - generic [ref=f1e82]:
      - generic [ref=f1e83]:
        - heading "Meu perfil" [level=5] [ref=f1e84]
        - list [ref=f1e85]:
          - listitem [ref=f1e86]:
            - link "Meu perfil" [ref=f1e87] [cursor=pointer]:
              - /url: /profile
          - listitem [ref=f1e88]: Minha coleção (fora do escopo)
          - listitem [ref=f1e89]: Atividade (fora do escopo)
          - listitem [ref=f1e90]: Estúdio do criador (fora do escopo)
          - listitem [ref=f1e91]: Lista de interesse (fora do escopo)
      - generic [ref=f1e92]:
        - heading "Central de ajuda" [level=5] [ref=f1e93]
        - list [ref=f1e94]:
          - listitem [ref=f1e95]: Central de ajuda (fora do escopo)
          - listitem [ref=f1e96]: Como comprar NFTs (fora do escopo)
          - listitem [ref=f1e97]: Carteira e segurança (fora do escopo)
          - listitem [ref=f1e98]: Política do mercado (fora do escopo)
          - listitem [ref=f1e99]: Denunciar item (fora do escopo)
      - generic [ref=f1e100]:
        - heading "Coleções" [level=5] [ref=f1e101]
        - list [ref=f1e102]:
          - listitem [ref=f1e103]:
            - link "Arte digital" [ref=f1e104] [cursor=pointer]:
              - /url: /?category=Arte+digital&page=1
          - listitem [ref=f1e105]:
            - link "Fotografia" [ref=f1e106] [cursor=pointer]:
              - /url: /?category=Fotografia&page=1
          - listitem [ref=f1e107]:
            - link "Música" [ref=f1e108] [cursor=pointer]:
              - /url: /?category=M%C3%BAsica&page=1
          - listitem [ref=f1e109]:
            - link "Arte 3D" [ref=f1e110] [cursor=pointer]:
              - /url: /?category=Arte+3D&page=1
          - listitem [ref=f1e111]:
            - link "Utilidade" [ref=f1e112] [cursor=pointer]:
              - /url: /?category=Utilidade&page=1
      - generic [ref=f1e113]:
        - generic [ref=f1e114]:
          - heading "Redes sociais" [level=5] [ref=f1e115]
          - generic [ref=f1e116]:
            - generic "f indisponível" [ref=f1e117]: f
            - generic "ig indisponível" [ref=f1e118]: ig
            - generic "tw indisponível" [ref=f1e119]: tw
            - generic "in indisponível" [ref=f1e120]: in
            - generic "yt indisponível" [ref=f1e121]: yt
        - generic [ref=f1e122]:
          - heading "Carteiras compatíveis" [level=5] [ref=f1e123]
          - generic [ref=f1e124]:
            - generic [ref=f1e125]: METAMASK
            - generic [ref=f1e126]: WALLETCONNECT
            - generic [ref=f1e127]: COINBASE
    - generic [ref=f1e128]: © 2026 Kurio - Proprietários de arte digital. Todos os direitos reservados.
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
> 61  |     await page.getByLabel('E-mail').fill('colecionador@kurio.io');
      |                                     ^ Error: locator.fill: Error: strict mode violation: getByLabel('E-mail') resolved to 2 elements:
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