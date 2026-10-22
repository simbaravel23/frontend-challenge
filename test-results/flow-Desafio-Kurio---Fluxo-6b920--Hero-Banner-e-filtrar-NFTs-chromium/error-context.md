# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: flow.spec.ts >> Desafio Kurio - Fluxos E2E >> Deve carregar o catálogo, exibir o Hero Banner e filtrar NFTs
- Location: e2e/flow.spec.ts:5:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('KURIO')
Expected: visible
Error: strict mode violation: getByText('KURIO') resolved to 2 elements:
    1) <a href="/" aria-current="page" data-status="active" class="font-mono font-bold tracking-widest text-white text-xl active">KURIO</a> aka getByRole('link', { name: 'KURIO' })
    2) <span class="text-xs font-mono text-[#E28743] uppercase tracking-widest bg-[#E28743]/10 px-3 py-1 rounded border border-[#E28743]/20">Bem-vindo à Kurio</span> aka getByText('Bem-vindo à Kurio')

Call log:
  - Expect "toBeVisible" getByText('KURIO') with timeout 5000ms
  - waiting for getByText('KURIO')

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
    - generic [ref=e24]:
      - generic [ref=e25]:
        - generic [ref=e26]:
          - text: Bem-vindo à Kurio
          - heading "SEJA DONO DO FUTURO DA ARTE DIGITAL" [level=1] [ref=e27]
          - paragraph [ref=e28]: Colecione NFTs autenticados de criadores excecionais e acompanhe a proveniência desta página rara. Arte urbana e temas de culto de culturas de exceção.
          - link [ref=e30] [cursor=pointer]:
            - /url: /nfts/emerald-ape-042
            - button "Ver Destaque" [ref=e31]
        - img "Destaque Kurio" [ref=e33]
      - generic [ref=e34]:
        - complementary [ref=e35]:
          - generic [ref=e36]:
            - heading "Pesquisa" [level=3] [ref=e37]
            - textbox "Pesquisar NFT..." [ref=e38]
          - generic [ref=e39]:
            - heading "Coleções" [level=3] [ref=e40]
            - generic [ref=e41]:
              - button "Arte digital (33)" [ref=e42] [cursor=pointer]:
                - generic [ref=e43]: Arte digital
                - generic [ref=e44]: (33)
              - button "Fotografia (12)" [ref=e45] [cursor=pointer]:
                - generic [ref=e46]: Fotografia
                - generic [ref=e47]: (12)
              - button "Música (65)" [ref=e48] [cursor=pointer]:
                - generic [ref=e49]: Música
                - generic [ref=e50]: (65)
              - button "Arte 3D (39)" [ref=e51] [cursor=pointer]:
                - generic [ref=e52]: Arte 3D
                - generic [ref=e53]: (39)
              - button "Colecionáveis (23)" [ref=e54] [cursor=pointer]:
                - generic [ref=e55]: Colecionáveis
                - generic [ref=e56]: (23)
              - button "Generativa (17)" [ref=e57] [cursor=pointer]:
                - generic [ref=e58]: Generativa
                - generic [ref=e59]: (17)
              - button "Jogos (19)" [ref=e60] [cursor=pointer]:
                - generic [ref=e61]: Jogos
                - generic [ref=e62]: (19)
              - button "Assinaturas (13)" [ref=e63] [cursor=pointer]:
                - generic [ref=e64]: Assinaturas
                - generic [ref=e65]: (13)
              - button "Utilidade (18)" [ref=e66] [cursor=pointer]:
                - generic [ref=e67]: Utilidade
                - generic [ref=e68]: (18)
          - generic [ref=e69]:
            - heading "Faixa de preço" [level=3] [ref=e70]
            - generic [ref=e71]:
              - generic [ref=e72]:
                - generic [ref=e74] [cursor=pointer]
                - generic [ref=e75] [cursor=pointer]
              - paragraph [ref=e76]: "Preço: 0,02 - 12,30 ETH"
              - button "Aplicar" [ref=e77] [cursor=pointer]
          - generic [ref=e78]:
            - heading "Rede" [level=3] [ref=e79]
            - generic [ref=e80]:
              - button "Ethereum (119)" [ref=e81] [cursor=pointer]:
                - generic [ref=e82]: Ethereum
                - generic [ref=e83]: (119)
              - button "Polygon (78)" [ref=e84] [cursor=pointer]:
                - generic [ref=e85]: Polygon
                - generic [ref=e86]: (78)
              - button "Solana (86)" [ref=e87] [cursor=pointer]:
                - generic [ref=e88]: Solana
                - generic [ref=e89]: (86)
          - generic [ref=e90]:
            - generic [ref=e91]:
              - paragraph [ref=e92]: NFT EM DESTAQUE
              - paragraph [ref=e93]: OFERTA LIMITADA
            - img "NFT em Destaque" [ref=e95]
        - generic [ref=e96]:
          - generic [ref=e97]:
            - generic [ref=e98]: Exibindo 9 de 18 resultado(s)
            - generic [ref=e99]:
              - generic [ref=e100]: Ordenar
              - combobox "Ordenar catálogo" [ref=e101]:
                - option "Recentes" [selected]
                - option "Menor preço"
                - option "Maior preço"
                - option "Nome"
          - generic [ref=e102]:
            - generic [ref=e103]:
              - 'link "Emerald Ape #042 Arte digital Raro Emerald Ape #042 Edição 1/50" [ref=e104] [cursor=pointer]':
                - /url: /nfts/emerald-ape-042
                - generic [ref=e105]:
                  - 'img "Emerald Ape #042" [ref=e106]'
                  - generic [ref=e107]: Arte digital
                  - generic [ref=e108]: Raro
                - generic [ref=e109]:
                  - 'heading "Emerald Ape #042" [level=3] [ref=e110]'
                  - paragraph [ref=e111]: Edição 1/50
              - 'button "Adicionar Emerald Ape #042 aos favoritos" [ref=e112]': ♡
              - generic [ref=e114]:
                - generic [ref=e115]:
                  - generic [ref=e116]: Preço atual
                  - generic [ref=e117]: 1.19 ETH
                - button "Adicionar" [ref=e118] [cursor=pointer]
            - generic [ref=e119]:
              - 'link "Sage Nomad #009 Arte digital Épico Sage Nomad #009 Edição 1/13" [ref=e120] [cursor=pointer]':
                - /url: /nfts/sage-nomad-009
                - generic [ref=e121]:
                  - 'img "Sage Nomad #009" [ref=e122]'
                  - generic [ref=e123]: Arte digital
                  - generic [ref=e124]: Épico
                - generic [ref=e125]:
                  - 'heading "Sage Nomad #009" [level=3] [ref=e126]'
                  - paragraph [ref=e127]: Edição 1/13
              - 'button "Adicionar Sage Nomad #009 aos favoritos" [ref=e128]': ♡
              - generic [ref=e130]:
                - generic [ref=e131]:
                  - generic [ref=e132]: Preço atual
                  - generic [ref=e133]: 1.69 ETH
                - button "Adicionar" [ref=e134] [cursor=pointer]
            - generic [ref=e135]:
              - 'link "Neon Vessel #552 Música Comum Neon Vessel #552 Edição 1/16" [ref=e136] [cursor=pointer]':
                - /url: /nfts/neon-vessel-552
                - generic [ref=e137]:
                  - 'img "Neon Vessel #552" [ref=e138]'
                  - generic [ref=e139]: Música
                  - generic [ref=e140]: Comum
                - generic [ref=e141]:
                  - 'heading "Neon Vessel #552" [level=3] [ref=e142]'
                  - paragraph [ref=e143]: Edição 1/16
              - 'button "Adicionar Neon Vessel #552 aos favoritos" [ref=e144]': ♡
              - generic [ref=e146]:
                - generic [ref=e147]:
                  - generic [ref=e148]: Preço atual
                  - generic [ref=e149]: 1.99 ETH
                - button "Adicionar" [ref=e150] [cursor=pointer]
            - generic [ref=e151]:
              - 'link "Quiet Orbit #118 Arte 3D Comum Quiet Orbit #118 Edição 1/19" [ref=e152] [cursor=pointer]':
                - /url: /nfts/quiet-orbit-118
                - generic [ref=e153]:
                  - 'img "Quiet Orbit #118" [ref=e154]'
                  - generic [ref=e155]: Arte 3D
                  - generic [ref=e156]: Comum
                - generic [ref=e157]:
                  - 'heading "Quiet Orbit #118" [level=3] [ref=e158]'
                  - paragraph [ref=e159]: Edição 1/19
              - 'button "Adicionar Quiet Orbit #118 aos favoritos" [ref=e160]': ♡
              - generic [ref=e162]:
                - generic [ref=e163]:
                  - generic [ref=e164]: Preço atual
                  - generic [ref=e165]: 0.82 ETH
                - button "Adicionar" [ref=e166] [cursor=pointer]
            - generic [ref=e167]:
              - 'link "Golden Hour #031 Fotografia Lendário Golden Hour #031 Edição 1/22" [ref=e168] [cursor=pointer]':
                - /url: /nfts/golden-hour-031
                - generic [ref=e169]:
                  - 'img "Golden Hour #031" [ref=e170]'
                  - generic [ref=e171]: Fotografia
                  - generic [ref=e172]: Lendário
                - generic [ref=e173]:
                  - 'heading "Golden Hour #031" [level=3] [ref=e174]'
                  - paragraph [ref=e175]: Edição 1/22
              - 'button "Adicionar Golden Hour #031 aos favoritos" [ref=e176]': ♡
              - generic [ref=e178]:
                - generic [ref=e179]:
                  - generic [ref=e180]: Preço atual
                  - generic [ref=e181]: 2.45 ETH
                - button "Adicionar" [ref=e182] [cursor=pointer]
            - generic [ref=e183]:
              - 'link "Pixel Garden #204 Generativa Raro Pixel Garden #204 Edição 1/25" [ref=e184] [cursor=pointer]':
                - /url: /nfts/pixel-garden-204
                - generic [ref=e185]:
                  - 'img "Pixel Garden #204" [ref=e186]'
                  - generic [ref=e187]: Generativa
                  - generic [ref=e188]: Raro
                - generic [ref=e189]:
                  - 'heading "Pixel Garden #204" [level=3] [ref=e190]'
                  - paragraph [ref=e191]: Edição 1/25
              - 'button "Adicionar Pixel Garden #204 aos favoritos" [ref=e192]': ♡
              - generic [ref=e194]:
                - generic [ref=e195]:
                  - generic [ref=e196]: Preço atual
                  - generic [ref=e197]: 0.56 ETH
                - button "Adicionar" [ref=e198] [cursor=pointer]
            - generic [ref=e199]:
              - 'link "Echoes #777 Música Épico Echoes #777 Edição 1/28" [ref=e200] [cursor=pointer]':
                - /url: /nfts/echoes-777
                - generic [ref=e201]:
                  - 'img "Echoes #777" [ref=e202]'
                  - generic [ref=e203]: Música
                  - generic [ref=e204]: Épico
                - generic [ref=e205]:
                  - 'heading "Echoes #777" [level=3] [ref=e206]'
                  - paragraph [ref=e207]: Edição 1/28
              - 'button "Adicionar Echoes #777 aos favoritos" [ref=e208]': ♡
              - generic [ref=e210]:
                - generic [ref=e211]:
                  - generic [ref=e212]: Preço atual
                  - generic [ref=e213]: 3.10 ETH
                - button "Adicionar" [ref=e214] [cursor=pointer]
            - generic [ref=e215]:
              - 'link "Driftwood #016 Fotografia Comum Driftwood #016 Edição 1/31" [ref=e216] [cursor=pointer]':
                - /url: /nfts/driftwood-016
                - generic [ref=e217]:
                  - 'img "Driftwood #016" [ref=e218]'
                  - generic [ref=e219]: Fotografia
                  - generic [ref=e220]: Comum
                - generic [ref=e221]:
                  - 'heading "Driftwood #016" [level=3] [ref=e222]'
                  - paragraph [ref=e223]: Edição 1/31
              - 'button "Adicionar Driftwood #016 aos favoritos" [ref=e224]': ♡
              - generic [ref=e226]:
                - generic [ref=e227]:
                  - generic [ref=e228]: Preço atual
                  - generic [ref=e229]: 0.93 ETH
                - button "Adicionar" [ref=e230] [cursor=pointer]
            - generic [ref=e231]:
              - 'link "Cosmic Bloom #064 Generativa Lendário Cosmic Bloom #064 Edição 1/34" [ref=e232] [cursor=pointer]':
                - /url: /nfts/cosmic-bloom-064
                - generic [ref=e233]:
                  - 'img "Cosmic Bloom #064" [ref=e234]'
                  - generic [ref=e235]: Generativa
                  - generic [ref=e236]: Lendário
                - generic [ref=e237]:
                  - 'heading "Cosmic Bloom #064" [level=3] [ref=e238]'
                  - paragraph [ref=e239]: Edição 1/34
              - 'button "Adicionar Cosmic Bloom #064 aos favoritos" [ref=e240]': ♡
              - generic [ref=e242]:
                - generic [ref=e243]:
                  - generic [ref=e244]: Preço atual
                  - generic [ref=e245]: 4.25 ETH
                - button "Adicionar" [ref=e246] [cursor=pointer]
          - navigation "Paginação do catálogo" [ref=e247]:
            - button "Anterior" [disabled]
            - generic [ref=e248]: Página 1 de 2
            - button "Próxima" [ref=e249]
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
> 10 |     await expect(page.getByText('KURIO')).toBeVisible();
     |                                           ^ Error: expect(locator).toBeVisible() failed
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