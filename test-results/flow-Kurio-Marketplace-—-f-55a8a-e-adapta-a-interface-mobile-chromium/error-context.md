# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: flow.spec.ts >> Kurio Marketplace — fluxos principais >> atualiza preço por Socket.IO e adapta a interface mobile
- Location: e2e/flow.spec.ts:126:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('status').filter({ hasText: 'mudou para' })
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('status').filter({ hasText: 'mudou para' }) with timeout 10000ms
  - waiting for getByRole('status').filter({ hasText: 'mudou para' })

```

```yaml
- banner:
  - link "KURIO":
    - /url: /
  - button "Pesquisar":
    - img
  - link "Carrinho":
    - /url: /cart
    - img
  - link "Perfil":
    - /url: /profile
  - button "Sair"
- main:
  - text: Bem-vindo à Kurio
  - heading "SEJA DONO DO FUTURO DA ARTE DIGITAL" [level=1]
  - paragraph: Colecione NFTs autenticados de criadores excecionais e acompanhe a proveniência desta página rara. Arte urbana e temas de culto de culturas de exceção.
  - link "Ver Destaque":
    - /url: /nfts/emerald-ape-042
    - button "Ver Destaque"
  - img "Destaque Kurio"
  - complementary:
    - heading "Pesquisa" [level=3]
    - textbox "Pesquisar NFT":
      - /placeholder: Pesquisar NFT...
    - heading "Coleções" [level=3]
    - button "Arte digital (33)"
    - button "Fotografia (12)"
    - button "Música (65)"
    - button "Arte 3D (39)"
    - button "Colecionáveis (23)"
    - button "Generativa (17)"
    - button "Jogos (19)"
    - button "Assinaturas (13)"
    - button "Utilidade (18)"
    - heading "Faixa de preço" [level=3]
    - paragraph: "Preço: 0,02 - 12,30 ETH"
    - button "Aplicar"
    - heading "Rede" [level=3]
    - button "Ethereum (119)"
    - button "Polygon (78)"
    - button "Solana (86)"
    - paragraph: NFT EM DESTAQUE
    - paragraph: OFERTA LIMITADA
    - img "NFT em Destaque"
  - text: Exibindo 9 de 18 resultado(s) Ordenar
  - combobox "Ordenar catálogo":
    - option "Recentes" [selected]
    - option "Menor preço"
    - option "Maior preço"
    - option "Nome"
  - 'link "Emerald Ape #042 Arte digital Raro Emerald Ape #042 Edição 1/50"':
    - /url: /nfts/emerald-ape-042
    - 'img "Emerald Ape #042"'
    - text: Arte digital Raro
    - 'heading "Emerald Ape #042" [level=3]'
    - paragraph: Edição 1/50
  - 'button "Adicionar Emerald Ape #042 aos favoritos"': ♡
  - text: Preço atual 1.19 ETH
  - 'button "Adicionar Emerald Ape #042 ao carrinho"': Adicionar
  - 'link "Sage Nomad #009 Arte digital Épico Sage Nomad #009 Edição 1/13"':
    - /url: /nfts/sage-nomad-009
    - 'img "Sage Nomad #009"'
    - text: Arte digital Épico
    - 'heading "Sage Nomad #009" [level=3]'
    - paragraph: Edição 1/13
  - 'button "Adicionar Sage Nomad #009 aos favoritos"': ♡
  - text: Preço atual 1.69 ETH
  - 'button "Adicionar Sage Nomad #009 ao carrinho"': Adicionar
  - 'link "Neon Vessel #552 Música Comum Neon Vessel #552 Edição 1/16"':
    - /url: /nfts/neon-vessel-552
    - 'img "Neon Vessel #552"'
    - text: Música Comum
    - 'heading "Neon Vessel #552" [level=3]'
    - paragraph: Edição 1/16
  - 'button "Adicionar Neon Vessel #552 aos favoritos"': ♡
  - text: Preço atual 1.99 ETH
  - 'button "Adicionar Neon Vessel #552 ao carrinho"': Adicionar
  - 'link "Quiet Orbit #118 Arte 3D Comum Quiet Orbit #118 Edição 1/19"':
    - /url: /nfts/quiet-orbit-118
    - 'img "Quiet Orbit #118"'
    - text: Arte 3D Comum
    - 'heading "Quiet Orbit #118" [level=3]'
    - paragraph: Edição 1/19
  - 'button "Adicionar Quiet Orbit #118 aos favoritos"': ♡
  - text: Preço atual 0.82 ETH
  - 'button "Adicionar Quiet Orbit #118 ao carrinho"': Adicionar
  - 'link "Golden Hour #031 Fotografia Lendário Golden Hour #031 Edição 1/22"':
    - /url: /nfts/golden-hour-031
    - 'img "Golden Hour #031"'
    - text: Fotografia Lendário
    - 'heading "Golden Hour #031" [level=3]'
    - paragraph: Edição 1/22
  - 'button "Adicionar Golden Hour #031 aos favoritos"': ♡
  - text: Preço atual 2.45 ETH
  - 'button "Adicionar Golden Hour #031 ao carrinho"': Adicionar
  - 'link "Pixel Garden #204 Generativa Raro Pixel Garden #204 Edição 1/25"':
    - /url: /nfts/pixel-garden-204
    - 'img "Pixel Garden #204"'
    - text: Generativa Raro
    - 'heading "Pixel Garden #204" [level=3]'
    - paragraph: Edição 1/25
  - 'button "Adicionar Pixel Garden #204 aos favoritos"': ♡
  - text: Preço atual 0.56 ETH
  - 'button "Adicionar Pixel Garden #204 ao carrinho"': Adicionar
  - 'link "Echoes #777 Música Épico Echoes #777 Edição 1/28"':
    - /url: /nfts/echoes-777
    - 'img "Echoes #777"'
    - text: Música Épico
    - 'heading "Echoes #777" [level=3]'
    - paragraph: Edição 1/28
  - 'button "Adicionar Echoes #777 aos favoritos"': ♡
  - text: Preço atual 3.10 ETH
  - 'button "Adicionar Echoes #777 ao carrinho"': Adicionar
  - 'link "Driftwood #016 Fotografia Comum Driftwood #016 Edição 1/31"':
    - /url: /nfts/driftwood-016
    - 'img "Driftwood #016"'
    - text: Fotografia Comum
    - 'heading "Driftwood #016" [level=3]'
    - paragraph: Edição 1/31
  - 'button "Adicionar Driftwood #016 aos favoritos"': ♡
  - text: Preço atual 0.93 ETH
  - 'button "Adicionar Driftwood #016 ao carrinho"': Adicionar
  - 'link "Cosmic Bloom #064 Generativa Lendário Cosmic Bloom #064 Edição 1/34"':
    - /url: /nfts/cosmic-bloom-064
    - 'img "Cosmic Bloom #064"'
    - text: Generativa Lendário
    - 'heading "Cosmic Bloom #064" [level=3]'
    - paragraph: Edição 1/34
  - 'button "Adicionar Cosmic Bloom #064 aos favoritos"': ♡
  - text: Preço atual 4.25 ETH
  - 'button "Adicionar Cosmic Bloom #064 ao carrinho"': Adicionar
  - navigation "Paginação do catálogo":
    - button "Anterior" [disabled]
    - text: Página 1 de 2
    - button "Próxima"
  - img "Lançamentos gênesis"
  - heading "Lançamentos gênesis de edição limitada" [level=3]
  - paragraph: Colecione edições escassas diretamente dos criadores antes da revelação pública.
  - link "Explorar coleção →":
    - /url: /?category=Colecion%C3%A1veis&page=1
  - img "Arte digital selecionada"
  - heading "Arte digital selecionada e muito mais" [level=3]
  - paragraph: Explore novos artistas, coleções verificadas e obras digitais que definem a rede.
  - link "Explorar coleção →":
    - /url: /?category=Arte+digital&page=1
  - heading "Diário da Cunhagem" [level=2]
  - paragraph: Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.
  - img "Como funciona a propriedade de NFTs"
  - text: 12 de setembro | Leitura de 4 min
  - heading "Como funciona a propriedade de NFTs" [level=4]
  - paragraph: Aprenda a colecionar, negociar e verificar ativos digitais.
  - text: Informação demonstrativa
  - img "10 artistas digitais para acompanhar"
  - text: 13 de setembro | Leitura de 3 min
  - heading "10 artistas digitais para acompanhar" [level=4]
  - paragraph: Conheça criadores que moldam a cultura digital.
  - text: Informação demonstrativa
  - img "Raridade, atributos e procedência"
  - text: 15 de setembro | Leitura de 5 min
  - heading "Raridade, atributos e procedência" [level=4]
  - paragraph: Entenda raridade, procedência, direitos autorais e utilidade.
  - text: Informação demonstrativa
  - img "Como proteger sua carteira"
  - text: 15 de setembro | Leitura de 2 min
  - heading "Como proteger sua carteira" [level=4]
  - paragraph: Proteja sua carteira, seus ativos e sua identidade.
  - text: Informação demonstrativa
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
  86  |     await signInAsSeedUser(page);
  87  |     await page.goto('/');
  88  |     await addFirstNFTToCart(page);
  89  |     await page.getByRole('link', { name: 'Carrinho' }).click();
  90  |     await page.getByRole('link', { name: /Avançar para o Checkout/i }).click();
  91  |     await expect(page.getByRole('heading', { name: 'Finalizar Aquisição' })).toBeVisible();
  92  |     const confirm = page.getByRole('button', { name: 'Confirmar e Pagar' });
  93  |     await expect(confirm).toBeEnabled();
  94  |     await confirm.click();
  95  |     await expect(page.getByRole('heading', { name: 'Aquisição Confirmada' })).toBeVisible();
  96  |     await expect(page.getByText('1.19 ETH')).toBeVisible();
  97  |     await page.reload();
  98  |     await expect(page.getByRole('heading', { name: 'Aquisição Confirmada' })).toBeVisible();
  99  |   });
  100 | 
  101 |   test('mantém o carrinho em recusa e recupera timeout com a mesma chave', async ({ page }) => {
  102 |     await signInAsSeedUser(page);
  103 |     await page.evaluate(() => localStorage.setItem('kurio_mock_scenario', 'payment-declined'));
  104 |     await page.goto('/');
  105 |     await addFirstNFTToCart(page);
  106 |     await page.goto('/cart/checkout');
  107 |     await page.getByRole('button', { name: 'Confirmar e Pagar' }).click();
  108 |     await expect(page.getByRole('alert')).toContainText('Pagamento recusado');
  109 |     await expect(page.getByRole('link', { name: 'Carrinho' })).toContainText('1');
  110 |   });
  111 | 
  112 |   test('edita perfil e adiciona carteira com validação', async ({ page }) => {
  113 |     await signInAsSeedUser(page);
  114 |     await page.goto('/profile');
  115 |     await expect(page.getByRole('heading', { name: 'Perfil do Colecionador' })).toBeVisible();
  116 |     await page.getByLabel('Nome de Exibição').fill('Colecionador Atualizado');
  117 |     await page.getByRole('button', { name: 'Guardar Alterações' }).click();
  118 |     await expect(page.getByRole('status')).toContainText('guardadas');
  119 | 
  120 |     await page.getByLabel('Nome da carteira').fill('Carteira de Teste');
  121 |     await page.getByLabel('Endereço Ethereum').fill('0x1234567890123456789012345678901234567890');
  122 |     await page.getByRole('button', { name: 'Adicionar Carteira' }).click();
  123 |     await expect(page.getByText('Carteira de Teste')).toBeVisible();
  124 |   });
  125 | 
  126 |   test('atualiza preço por Socket.IO e adapta a interface mobile', async ({ page }) => {
  127 |     await page.setViewportSize({ width: 390, height: 844 });
  128 |     await signInAsSeedUser(page);
  129 |     await page.evaluate(() => localStorage.setItem('kurio_mock_scenario', 'socket-update'));
  130 |     await page.goto('/');
> 131 |     await expect(page.getByRole('status').filter({ hasText: 'mudou para' })).toBeVisible({ timeout: 10000 });
      |                                                                              ^ Error: expect(locator).toBeVisible() failed
  132 |     const dimensions = await page.evaluate(() => ({
  133 |       documentWidth: document.documentElement.scrollWidth,
  134 |       viewportWidth: document.documentElement.clientWidth,
  135 |     }));
  136 |     expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
  137 |   });
  138 | });
  139 | 
```