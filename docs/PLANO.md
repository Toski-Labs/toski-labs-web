# Site da Toski Labs — plano de desenvolvimento

Fonte da verdade visual: canvas "Toski Labs — Site" (Artifact de Design) + `../../design/` (tokens, SVGs da Paçoca, animações).
Stack: Astro 7 + TypeScript (strict) + Tailwind 4 (via `@tailwindcss/vite`). Hospedagem: Firebase Hosting, projeto `toski-labs` (Plano Spark), em `toski-labs.com.br` (o `toski-labs.web.app` continua respondendo, mas não é mais o oficial).
Regra: tudo gratuito. Site estático, sem cookies, sem Google Analytics. O único uso do Firebase no navegador é o Remote Config das campanhas, baixado só durante uma campanha.

## Decisões
- E-mail de suporte e contato: **toskilabs@gmail.com** (site, política, App Store e Google).
- Idiomas: português em `/`, inglês em `/en/`. Sem redirecionamento automático pelo navegador; o botão PT/EN no cabeçalho troca para a página equivalente.
- Rotas: `/`, `/projetos`, `/estudio`, `/privacidade`, `/suporte` · `/en/`, `/en/projects`, `/en/studio`, `/en/privacy`, `/en/support`. `/pethealthtracker` e `/en/pethealthtracker` saíram deste site e redirecionam (301) direto para o site do Pawta (`pawta.toski-labs.com.br`, sem passar pelo endereço antigo); `/pawta` e `/en/pawta` também.
- Tema: claro e escuro automáticos pelo sistema (`prefers-color-scheme`), sem botão — igual ao app.
- Fonte: Outfit hospedada no site (`@fontsource-variable/outfit`), sem Google Fonts.
- Projetos vêm de uma lista de dados (`src/data/projects.ts`) para um novo projeto entrar sem mexer no layout.
- Privacidade e Suporte escritos em Markdown (content collections), um arquivo por idioma.
- Fotos da Paçoca já em `src/assets/fotos/` (`pacoca-sorrindo.jpg` com o fundo tratado é a padrão). Usar `<Image>` do Astro (gera WebP e tamanhos).

## Projetos: Home com dois apps e página /projetos ✅ (10 out 2026, em PR)
Cada app tem o próprio site (`pawta.toski-labs.com.br`, `koti.toski-labs.com.br`). Este site só apresenta os projetos.

**Decisões (10 out)**
- Home: dois cards lado a lado (Pawta e Koti), com ícone do DS 0.6.0, status, frase na cor do produto, tags, "Ver o site", selo desativado "Em breve na App Store", Privacidade e Suporte do subdomínio e o endereço em texto pequeno. "Ainda no forno" foi para `/projetos`.
- `/projetos` (`/en/projects`): um bloco por app (o que é, para quem, 4 recursos, planos, botões) com celular ao lado, e "Ainda no forno" no fim. Título da aba "Toski Labs: Projetos". Dados em `src/data/projects.ts`.
- Cor do produto só dentro do card: variáveis locais com o nome do token em `global.css` (`[data-product]`), com `TODO(ds)` e as regras de `@media` e `data-theme`. `Button` e `Pill` do DS herdam sem classes novas (o `@theme inline` lê `--toski-*` em tempo de uso). `--toski-tint` recebe o valor de `--toski-hero` do tema (cor do canvas).
- Telas no celular: Pawta usa o snapshot do app (`pawta-calendario-claro/escuro.png`, só em português; o `alt` em inglês avisa); Koti é um componente HTML/CSS estático (`KotiScreen.astro`, aba Hoje, PT e EN, textos em `projects.ts`). Decorativas: `role="img"` com `aria-label`, tamanho fixo, nada clicável.
- Privacidade: cobre só o site da Toski e lista a política de cada app. Suporte: contato da Toski e links para o suporte de cada app. As URLs `/privacidade` e `/suporte` continuam.
- Black Friday: faixa e selo levam para a Home do subdomínio (`https://pawta.toski-labs.com.br` e `/en`); selo lilás, faixa caramelo. Segue desligada até o app estar na App Store.
- Rodapé: coluna Projetos com Pawta, Koti (subdomínios) e Estúdio.
- JSON-LD: Organization com `@id` `https://toski-labs.com.br/#organization` e `ItemList` em `/projetos` com os dois `MobileApplication` (`@id` `…/#app` de cada site). O `koti-web` ainda usa `https://toski-labs.web.app/#toski-labs` e será ajustado à parte.
- Domínio oficial: `https://toski-labs.com.br` (12 out 2026). `SITE`, canonical, hreflang, sitemap, `robots.txt`, Open Graph e JSON-LD usam esse endereço. Ver a seção "Domínio oficial" abaixo.
- Saíram: `PetHealthTrackerPage`, `PhoneMock`, `PdfCard`, `FeatureCard`, `BlackFridayOffer`, `FaqItem`, as rotas do PetHealthTracker e as imagens `og/pethealthtracker-*`.
- Entrou `public/google1c343bc8814b41ea.html` (verificação do Search Console da propriedade nova). Atenção: com `cleanUrls` o Firebase pode redirecionar esse `.html`; se a verificação falhar, usar DNS (propriedade de domínio) ou a meta tag.
- Corrigido o tipo do `hidden` no `SettingsMenu.astro` (o `astro check` falhava antes).

**Pendências do DS** (para levar ao `toski-ds`)
1. Tema de produto por elemento: seletor `[data-product]` sem `:root`, para valer dentro de um card.
2. `Button`, `Pill`, `Card`, `IconBox` etc. acompanhando o tema do contêiner (hoje herdam só por variáveis locais repetidas).
3. `ProductIcon`/`ProductMascot` escolhendo claro/escuro pelo tema da página (hoje cada chamador renderiza as duas versões com `data-art`).

**Verificações (10 out)**
- `astro check`: 0 erros, 0 avisos. Build: 15 páginas.
- axe (WCAG 2.0 a 2.2 A/AA e boas práticas): 0 violações em 15 páginas, 390 e 1280 px, claro e escuro, com o menu de configurações aberto.
- Lighthouse (mediana de 3): 100/100/100/100 em `/`, `/en`, `/projetos` e `/en/projects`, celular e computador, claro e escuro. CLS 0 em todas, depois de pré-carregar a fonte Outfit (latin) no `BaseLayout` (antes `/projetos` no celular tinha 0,031 pela troca da fonte). Repetido no celular, claro e escuro, após o preload.
- `npm run check` roda o `astro check` (`@astrojs/check` e `typescript` nas devDependencies): 0 erros.
- 301 conferidos: `/pethealthtracker` e `/en/pethealthtracker` vão para o subdomínio (desde 24 out, direto para `pawta.toski-labs.com.br`; conferir de novo depois do deploy).

## Fase 0 — Fundação ✅ (5 out 2026)
Feita: tokens em `src/styles/global.css`, Outfit local, SVGs em `src/assets/brand/`, favicon e apple-touch-icon, i18n em `src/i18n/ui.ts` (rotas, textos, `SUPPORT_EMAIL`), `BaseLayout`, `Header`, `Footer`, 8 rotas com página provisória (`Placeholder.astro`, some na Fase 2). Build gera `/privacidade.html` etc. (`build.format: 'file'`).

1. Remover o starter (`Welcome.astro`, `src/assets/*.svg` do Astro, favicons padrão).
2. `src/styles/global.css`: `@theme` do Tailwind com os tokens do Toski DS (`../../design/toski-ds/tokens/tokens.json`; antes `../../design/tokens/tokens.json`) — cores semânticas como variáveis CSS (claro em `:root`, escuro em `@media (prefers-color-scheme: dark)`), raios (chip 999, botão 14, card 18, seção 28), fonte Outfit. Classes resultantes: `bg-background`, `bg-surface`, `bg-tint`, `bg-hero`, `text-ink`, `text-muted`, `border-line`, `bg-accent`, `text-on-accent`, `text-critical`, `text-success`, `bg-footer`… Container das páginas: classe `page`.
3. Instalar `@fontsource-variable/outfit` e importar no layout.
4. Copiar SVGs de `../../design/svg/` para `src/assets/brand/`. Favicon e `apple-touch-icon` a partir de `icone-caramelo.svg`.
5. i18n: `i18n` no `astro.config.mjs` (`defaultLocale: 'pt'`, `locales: ['pt','en']`, `prefixDefaultLocale: false`) + `src/i18n/pt.ts`, `src/i18n/en.ts` e helper `t(lang)` + mapa de rotas equivalentes PT↔EN.
6. `BaseLayout.astro`: `<html lang>`, title/description por página, Open Graph, `hreflang` PT/EN, `theme-color` claro/escuro.
7. `Header.astro` (logo + nav + PT/EN) e `Footer.astro` (marca, Projetos, Ajuda, © 2026 Toski Labs · Recife).

## Fase 1 — Componentes (iguais ao canvas) ✅ (5 out 2026)
Feita. `src/components/ui/`: `Icon` (lista de ícones de traço), `Button` (primary/secondary/light · lg 54/md 48, com ícone), `Kicker`, `SectionHeading` (h1/h2), `Pill` (status/outline/tag/plus), `Card` (surface/plain/hero/dashed · raio card/panel), `IconBox`, `FeatureCard`, `CheckList` (success/accent, 1 ou 2 colunas), `FaqItem` (`<details>`). `src/components/brand/`: `Mascot`, `MascotHero`, `PhoneMock`, `PdfCard` (textos PT/EN internos). Conferidos claro e escuro numa página de teste fora do repositório.

`Button` (principal 54/raio 14; secundário com borda), `Kicker` (13px, 600, caixa alta, cor accent), `SectionHeading`, `Pill`/`Tag`, `Card`, `CheckList`, `AppIcon`, `Mascot` (Paçoca + bolinha animada 1,8 s, parada com reduzir movimento; contorno creme no escuro), `PhoneMock` (tela Início do app), `PdfCard` (carteirinha de exemplo), `FaqItem` (`<details>`). Ícones como SVG inline com `currentColor`, sem biblioteca.

## Fase 2 — Páginas ✅ (5 out 2026)
Feita. Rotas finas em `src/pages/` chamam os componentes de página em `src/components/pages/` (`HomePage`, `PetHealthTrackerPage`, `PrivacyPage`, `SupportPage`), que escolhem os textos pelo idioma. Projetos da Home vêm de `src/data/projects.ts`. Política em Markdown: `src/content/legal/pt/privacidade.md` e `src/content/legal/en/privacy.md` (coleção `legal` em `src/content.config.ts`; seções numeradas e sumário gerados dos `##`). FAQ do Suporte fica no próprio `SupportPage.astro`. Foto da Paçoca otimizada para WebP pelo `<Image>`. `404.astro` bilíngue com `noindex`. Conferido em 1280 e 390 px, claro e escuro.

1. Home (`/`, `/en/`): hero ("Soluções simples para problemas de verdade.") com a Paçoca ilustrada · Projetos (card do PetHealthTracker + card "Ainda no forno") · Por que Toski? em faixa `tint` com a foto.
2. PetHealthTracker: (saiu em 10 out; o app tem site próprio, ver a seção Projetos).
3. Privacidade: sumário lateral + seções numeradas (Markdown). Placeholders a preencher: data, prazos, rede de anúncios.
4. Suporte: contato, código de suporte, FAQ.
5. 404 com a Paçoca e a bolinha no chão (`pacoca-bolinha-chao-*.svg`).

## Fase 3 — Qualidade ✅ (5 out 2026)
Feita. `@astrojs/sitemap` com PT/EN ligados (`/sitemap-index.xml`, sem a 404), `public/robots.txt`, imagens de compartilhamento `public/og/og-pt.png` e `og-en.png` (1200×630) com Open Graph e Twitter card. Acessibilidade: token `accent-text` (#94481A no claro) para texto pequeno de destaque sobre tint/hero (o #A9541F não passava 4,5:1), links dentro de texto sublinhados, botão PT/EN com nome acessível que inclui o texto visível. axe-core sem nenhuma violação nas 9 páginas (1280/390, claro/escuro). Lighthouse: 100 em desempenho, acessibilidade, boas práticas e SEO.

- Acessibilidade: contraste 4,5:1, foco visível, alt nas imagens, alvos de toque ≥ 44 px, `prefers-reduced-motion`.
- Responsivo: conferir em 390 px e 1280 px, claro e escuro, comparando com os quadros do canvas.
- SEO: `@astrojs/sitemap`, `robots.txt`, descrições por página, `hreflang`.
- Performance: Lighthouse ≥ 95 em tudo; imagens via `<Image>`.

## Fase 4 — Publicação no Firebase ✅ (6 out 2026)
No ar em `https://toski-labs.com.br` (publicado primeiro em `toski-labs.web.app`).

1. `firebase init hosting` nesta pasta → projeto `toski-labs`, public `dist`, SPA **não**, GitHub **não**.
2. `firebase.json`: `cleanUrls: true`, `trailingSlash: false`, cache longo para `/_astro/**`, `404.html`.
3. `npm run build && firebase deploy --only hosting` → `https://toski-labs.com.br`.
4. Mais tarde: `public/app-ads.txt` quando os anúncios entrarem; deploy automático pelo GitHub Actions se fizer falta.

## Novidades ✅ (5 out 2026)
Desenhadas no canvas (página "Novidades") e implementadas:
1. **Menu de configurações** (`SettingsMenu.astro`) no lugar do botão EN: tema Automático/Claro/Escuro (salvo em `localStorage` `toski-theme`; aplicado por script inline no `<head>` antes da pintura; CSS aceita `data-theme` além do `prefers-color-scheme`) e idioma PT/EN. Fecha com Esc e clique fora; setas trocam o tema.
2. **Aviso de idioma do navegador** (`LangBanner.astro`): só na primeira visita, sem redirecionar. Textos em `src/i18n/ui.ts › langNotice` (es, fr, de, it, en, pt e "other").
3. **Wallpapers**: `/wallpapers` e `/en/wallpapers`, link no menu e no rodapé. Dados em `src/data/wallpapers.ts`, PNGs em `src/assets/wallpapers/` (prévia WebP + download do original). Filtro iPhone/Mac só com CSS. Faltam versões iPhone do Padrão noturno e da Linha.
4. **Black Friday**: `src/data/campaigns.ts` (projeto, chave, `start`, `end`, textos, preços). Faixa no topo de todas as páginas (`CampaignBar`), selo no card do projeto na Home (`CampaignSeal`) e seção BLACK FRIDAY na página do PetHealthTracker (`BlackFridayOffer`), no visual da tela de Black Friday do app. Preencher `appStoreUrl`.

## Campanhas pelo Remote Config ✅ (5 out 2026)
- Quem liga e desliga é o **Remote Config do projeto Firebase `toski-labs`** (app Web "site"), parâmetro `campanhas` (JSON), uma entrada por projeto: `{ "pawta": { "black_friday": true } }` (até 24 out a chave era `pethealthtracker`). Promoção de um projeto só = ligar só a chave dele.
- Uma campanha aparece quando **a data está dentro de `start`–`end`** e **a chave está ligada**. Fora das datas o site nem baixa o Firebase. Se o Remote Config falhar, nada aparece (padrão desligado). A última resposta fica guardada no navegador para a página não pular na volta.
- Controle: `src/components/campaign/CampaignFlags.astro`; configuração do app Web: `src/lib/firebase.ts` (valores públicos).
- Prévia sem ligar nada: abrir qualquer página com `?campanha=pawta.black_friday` (vale até fechar a aba).
- O app do iPhone continua com o Remote Config do próprio projeto. **São dois interruptores por campanha.**

### Passo a passo de uma campanha (ex.: Black Friday do Pawta)
1. App Store Connect: agendar as ofertas (introdutória/promocional do anual e preço temporário do vitalício).
2. Projeto Firebase do app: ligar a campanha no Remote Config do app.
3. Projeto Firebase `toski-labs` › Remote Config: em `campanhas`, pôr `"black_friday": true` dentro de `"pawta"` e **Publicar alterações**.
4. Conferir no site (pode levar até 5 minutos para quem já estava com a página aberta).
5. Depois do fim: desligar as duas chaves (o site já some sozinho pela data).
Menu do cabeçalho agora: Projetos · Wallpapers · Suporte (o "Sobre" segue acessível pela Home).

## Estúdio ✅ (5 out 2026)
- Menu: Projetos · **Estúdio** · Suporte. Endereços: `/estudio` (`/en/studio`), `/estudio/wallpapers` (`/en/studio/wallpapers`, antes `/wallpapers`) e `/estudio/temas` (`/en/studio/themes`).
- Página principal: cards de Wallpapers e Temas e a faixa do **Toski DS** (cores que copiam no clique, fonte, tokens, link para o GitHub).
- Temas: VS Code, iTerm2 e Oh My Zsh, com prévia clara/escura feita em HTML (troca só com CSS). Paletas e código de exemplo em `src/data/studio.ts`.
- **O que vai para o ar** é controlado por `studio.themes.ready` e `studio.ds.ready` em `src/data/studio.ts`. Enquanto estiverem `false`: no `npm run dev` aparece tudo; no site publicado o card de Temas e a faixa do DS somem, e `/estudio/temas` fica com noindex e fora do sitemap.
- Para publicar: preencher os links (Marketplace, Open VSX, `.itermcolors`, GitHub dos temas e do DS) e trocar `ready` para `true`.

## Pendências de conteúdo
- Política: data (5 out 2026), exclusão em 30 dias e rede de anúncios genérica preenchidos; **confirmar os 30 dias**, nomear a rede quando decidir, faixa etária e revisão jurídica.
- Suporte: resposta em até 2 dias úteis ✅.
- Preços em inglês: hoje "Local price" até ter os valores por país; link da App Store quando publicar.
- Wallpapers: 6 coleções (Minimal, Noturna, Padrão noturno, Linha, Halloween, Lick or Treat) em mobile 1320×2868 e desktop 5K, 4K, MacBook e ultrawide ✅. Downloads de desktop vêm da release mais recente de `Toski-Labs/toski-labs-wallpapers` (v2.1); nova coleção = nova release com todos os PNGs e os mesmos nomes de arquivo.
- Estúdio: temas no ar (VS Code no Marketplace e no Open VSX, namespace `toskilabs`). Toski DS: `ds.ready` quando o repositório tiver conteúdo.

## Situação em 6 out 2026

### Feito e conferido no código
- Fases 0 a 4 completas: starter removido, tokens e Outfit locais (sem Google Fonts), i18n em `src/i18n/ui.ts`, BaseLayout com canonical, `hreflang` (pt-BR, en, x-default), Open Graph, Twitter card e `theme-color` claro/escuro; componentes de UI e marca; 7 páginas em PT e EN + 404 com `noindex`; sitemap sem a 404 e sem páginas não publicadas; `robots.txt`; imagens OG.
- Novidades: menu de configurações (tema e idioma), aviso de idioma do navegador, campanhas por Remote Config, Estúdio com Wallpapers (6 coleções, release v2.1) e Temas (VS Code, iTerm2 e Oh My Zsh publicados, `themes.ready: true`), botão de voltar ao topo.
- No ar em `toski-labs.com.br` (as 14 páginas respondem; `/wallpapers` redireciona). `npm run deploy` publica.
- axe-core (6 out): nenhuma violação em 15 páginas, 1280/390 px, claro e escuro.
- PageSpeed no site publicado (6 out): 100 em desempenho, acessibilidade, práticas e SEO (Home, PetHealthTracker, Wallpapers, Temas; celular e computador).
- Também no ar em 6 out:
  - títulos no padrão "Toski Labs" (Home) e "Toski Labs: Página" (aba, Google e cards);
  - imagens de compartilhamento por seção (a da Home sem a foto da Paçoca) e tags `og:`/`twitter:` completas;
  - Suporte: "Escrever e-mail" abre um menu com Gmail, Outlook e o app de e-mail;
  - Wallpapers no celular em carrossel, com os cards na mesma altura;
  - Black Friday sem preços até a monetização (o card mostra só o desconto);
  - Política com a seção "Crianças";
  - Toski DS 0.4.1 e microinterações.

### Diferenças entre o plano e o código
- i18n ficou num arquivo só (`ui.ts`), não em `pt.ts`/`en.ts`.
- Rodapé: `© ano Toski Labs` sem "· Recife" (Recife aparece na Home).
- Menu do cabeçalho: Projetos · Estúdio · Suporte (a linha antiga "Projetos · Wallpapers · Suporte" vale só para antes do Estúdio).

### Falta
**Conteúdo e revisão**
1. Textos em PT e EN: primeira revisão feita (6 out); falta uma última leitura sua.
2. Preços: o site do Pawta mostra "Em breve" / "Soon" até a precificação ser decidida (o teste de 7 dias continua). Na Black Friday (`src/data/campaigns.ts`) os preços estão em branco em PT e EN e o card mostra só o desconto (−50% / −30%); preencher `price` e `old` quando a monetização for definida, **antes de 27/11**.
3. Política: exclusão em até 30 dias confirmada; seção "Crianças" (não é direcionado a menores de 13 anos) adicionada. Falta nomear a rede de anúncios quando for escolhida (o texto já diz que o nome entra antes de os anúncios começarem) e a revisão jurídica.

**App e anúncios**
4. Link da App Store: site do Pawta ("Em breve na App Store") e `appStoreUrl: '#'` em `campaigns.ts`.
5. `public/app-ads.txt` antes de os anúncios entrarem.
6. Black Friday (27–30/11): ofertas no App Store Connect, chave no Remote Config do app e do site; testar antes com `?campanha=pawta.black_friday`.

**Estúdio**
7. ~~Toski DS no Estúdio~~ ✅ (6 out): o site usa `@toski-labs/ds` como fonte única; a faixa está publicada (`ds.ready: true`) com Storybook, GitHub, npm e o comando de instalação.
8. ~~Open VSX~~ ✅ (6 out): Toski Theme 1.0.0 publicado em open-vsx.org/extension/toskilabs/toski-theme; namespace `toskilabs` concedido (EclipseFdn/open-vsx.org#13813).

**SEO e compartilhamento**
9. ~~Card de compartilhamento~~ ✅ (6 out): imagens OG próprias por seção (Home, PetHealthTracker, Estúdio, Wallpapers, Temas) em PT e EN, conferidas no site publicado.
10. ~~SEO~~ ✅ (6 out): títulos e descrições, dados estruturados (Organization, WebSite, MobileApplication, BreadcrumbList), Lighthouse 98–100. Search Console: ver a seção abaixo.

**Animações**
11. ~~Animações e microinterações~~ ✅ (6 out): proposta aprovada no canvas (página "Animações") e implementada em `src/scripts/motion.ts` + `global.css`: confirmação de cópia, menus abrindo e fechando, troca de tema com View Transitions, filtro que desliza, cards que levantam (botão principal cobre o card), botão afundando e abrir/fechar de menu (vêm do Toski DS 0.4.1), seções do PetHealthTracker aparecendo ao rolar e bolinha pulando no logo. Tudo respeita `prefers-reduced-motion`.

**Manutenção**
12. ~~Canvas de design~~ ✅ (6 out): Wallpapers v2, Estúdio, Suporte, PetHealthTracker e Privacidade iguais ao site.

**Opcionais**
13. ~~Domínio próprio~~ ✅ (12 out): `toski-labs.com.br`, ver "Domínio oficial". Deploy automático pelo GitHub Actions segue pendente.

## Domínio oficial: toski-labs.com.br ✅ (12 out 2026)
- O domínio já estava conectado no Firebase Hosting. O endereço oficial do site passou de `toski-labs.web.app` para `https://toski-labs.com.br`; o `web.app` continua funcionando.
- Mudou: `SITE` em `astro.config.mjs` (sitemap e hreflang do sitemap saem dele), fallback e comentário do `BaseLayout.astro` (canonical, hreflang pt-BR/en/x-default, `og:url`, `og:image` e JSON-LD saem de `site`), `Sitemap:` do `robots.txt`, texto das políticas de privacidade (PT e EN), README e este plano.
- Não mudou: a meta `google-site-verification` e `public/google1c343bc8814b41ea.html` (mantêm verificada a propriedade antiga), e os redirecionamentos do `firebase.json` (já apontam para os subdomínios).
- Falta fora deste repositório: ajustar o `@id` da Organization no `koti-web` e, depois do deploy, enviar o sitemap novo na propriedade de domínio do Search Console.

## Google Search Console (6 out 2026)
- **Nota (12 out):** propriedade antiga (`https://toski-labs.web.app`), mantida como histórico; a oficial agora é a propriedade de domínio `toski-labs.com.br` (verificada por TXT no Registro.br, a mesma dos subdomínios pethealth e koti), onde o sitemap novo deve ser enviado depois do deploy. As URLs antigas desta seção ficam como estavam.
- Propriedade **Prefixo do URL** `https://toski-labs.web.app`, na conta Google da Toski Labs. Verificada pela **Tag HTML** (`google-site-verification` no `<head>` do `BaseLayout.astro` — não remover, senão a verificação cai). O método "Arquivo HTML" não serve aqui: o `cleanUrls` do Firebase redireciona `/arquivo.html`.
- Sitemap enviado: `sitemap-index.xml` (aponta para `sitemap-0.xml`). O site serve os dois certinho; o status "Não foi possível buscar o sitemap" logo após o envio é provisório em propriedade nova. Se continuar depois de 2–3 dias: remover e reenviar, ou enviar `sitemap-0.xml`.
- Solicitar indexação (Inspeção de URL) de `/` e `/pethealthtracker` deu "cota excedida" no primeiro dia — limite comum em propriedade nova. Tentar de novo nos dias seguintes; se não der, o Google encontra as páginas pelo sitemap.
- Indexação por página (pedir em Inspeção de URL › Solicitar indexação, até ~5 por dia):
  - [x] https://toski-labs.web.app/ — indexada (6 out)
  - [x] https://toski-labs.web.app/pethealthtracker — pedida (6 out)
  - [x] https://toski-labs.web.app/estudio — pedida (6 out)
  - [x] https://toski-labs.web.app/estudio/wallpapers — pedida (6 out)
  - [x] https://toski-labs.web.app/suporte — pedida (6 out)
  - [x] https://toski-labs.web.app/en — pedida (6 out)
  - [ ] https://toski-labs.web.app/estudio/temas
  - [ ] https://toski-labs.web.app/privacidade
  - [ ] https://toski-labs.web.app/en/pethealthtracker
  - [ ] https://toski-labs.web.app/en/studio
  - [ ] https://toski-labs.web.app/en/studio/wallpapers
  - [ ] https://toski-labs.web.app/en/studio/themes
  - [ ] https://toski-labs.web.app/en/support
  - [ ] https://toski-labs.web.app/en/privacy
- Conferir se as pedidas em 6 out entraram mesmo (a partir de 8–9 out). Em Inspeção de URL, cada uma deve mostrar "O URL está no Google" e "A página está indexada"; também dá para buscar `site:toski-labs.web.app` no Google:
  - [ ] https://toski-labs.web.app/pethealthtracker
  - [ ] https://toski-labs.web.app/estudio
  - [ ] https://toski-labs.web.app/estudio/wallpapers
  - [ ] https://toski-labs.web.app/suporte
  - [ ] https://toski-labs.web.app/en
- Os relatórios de Desempenho e Páginas levam alguns dias para ter dados. Conferir no fim da semana.
- Se a Toski Labs tiver domínio próprio no futuro, cadastrar também uma propriedade do tipo **Domínio** (verificação por DNS).

## Pawta (24 out 2026)
O app PetHealthTracker passou a se chamar **Pawta** (plano pago: **Pawta Plus**); o site dele foi para `pawta.toski-labs.com.br` e o `pethealth.toski-labs.com.br` só redireciona (301). Aqui mudaram: o projeto em `projects.ts` (`id: 'pawta'`, nome, links e textos), o card, o rodapé e `/projetos`, `[data-product='pawta']` no `global.css`, os snapshots `pawta-calendario-*`, a política (link para a do Pawta), as prévias do Estúdio (`~/pawta`), a campanha (`project: 'pawta'`, chave `pawta.black_friday`, textos com "Pawta Plus") e os 301 (`/pethealthtracker` direto para o endereço novo, mais `/pawta` e `/en/pawta`). O histórico acima (auditorias, Search Console, OG) fica com o nome da época.

## Datas especiais (S.19, 24 out 2026)
Halloween e Natal também neste site, com o mesmo parâmetro e as mesmas datas do site do Pawta (S.8, S.15, S.18). Sem quadro no canvas: visual proposto e aprovado na Etapa 1.

**Decisões**
- Remote Config do projeto `toski-labs`, parâmetro `datas_especiais` (formato combinado com o `pethealth-web`): `ativo`, `forcar` e `temas.<tema>` com `inicio`/`fim` (MM-DD, Brasília, incluídos; fim menor que o início vira o ano), `enfeites`, `icone` e `sites` (`"pawta"`, `"toski"`). Um tema vale para os dois sites; cada site desenha o seu. JSON ausente, inválido ou lento: vale o padrão embutido (`PADRAO` em `src/lib/datas-especiais.mjs`).
- Ordem: `?tema=` (prévia até fechar a aba; `nenhum` esconde, `auto` volta) > `ativo: false` > `forcar` (respeita `sites`) > datas.
- Sem piscar: script inline no `<head>` (`src/lib/datas-script.mjs`, gerado das mesmas funções que os testes cobrem, minificado, ~2,5 KB, ~1 KB comprimido) lê a última resposta guardada (`toski-datas`) ou o padrão e marca o `<html>` com `data-tema`, `data-tema-enfeites`, `data-tema-icone`, `data-tema-faixa-fechada`; troca o favicon.
- O Remote Config (mesma busca da campanha, `src/lib/remote-config.ts`) só é baixado quando há uma data na janela ou um `forcar` guardado, e nunca na prévia. Por isso um `forcar` fora de qualquer janela não chega a este site (para ver fora da data, `?tema=`).
- O que entra: faixa no topo (PT e EN, X lembrado por temporada; desde o PR dos fantasminhas fala do laboratório e não tem link); enfeites em volta do círculo da Paçoca (nunca na coluna do texto); a bolinha da Paçoca vira abóbora ou bola de árvore (opção B, com o mesmo pulo); favicon da data (fundo café no Halloween, verde no Natal); ícone do Pawta da data no card da Home.
- Black Friday no mesmo dia: só a faixa da Black Friday; enfeites, favicon e ícone continuam.
- Tudo decorativo com `aria-hidden`, parado com "reduzir movimento", imagens como fundo só com o tema ativo (fora da data nada é baixado), claro e escuro, celular e computador. Open Graph de sempre.
- Testes trazidos do `pethealth-web`: `npm test` (lógica e script do `<head>` num navegador de mentira), `check:seo` (adaptado aos títulos daqui, mais as checagens das datas) e `check:axe` (15 páginas × claro/escuro × 390/1280 × sem data/Halloween/Natal, sobreposição, downloads, Black Friday e X). `npm run ci` roda tudo.

**Fantasminhas (24 out)**
- Halloween sem esperar o S.18: `public/datas/halloween/fantasminha.svg` recortado do quadro `SzSiteHalloween` (desenho e cores; SVG sem CSS, para o site do Pawta copiar) e `icone-pawta.svg` do quadro `SzIcones` (ícone do card). Três fantasminhas (grande, médio e pequeno, opacidade 1/0,9/0,8) com o movimento do canvas (`szFloat`: 3,2 s, sobe e balança ±4°); lugares separados no computador (cantos em volta do círculo) e no celular (menores, nos lados).
- Textos da faixa passam a falar do laboratório ("Feliz Halloween da Toski Labs! O laboratório está fantasiado até 31/10." / "Boas festas da Toski Labs! O laboratório já entrou no clima de Natal.", e os equivalentes em inglês), sem o link para o site do Pawta. O Pawta segue no ícone da data, no card dele.

**Enfeites de Natal (24 out)**
- Do S.18 (`public/datas/natal/` da branch `feat/datas-especiais` do `pethealth-web`, commit `1a7f00b`, PR #5 de lá): `bengalinha.svg` e o ícone do Pawta (`icone.svg`, aqui `icone-pawta.svg`, em todo lugar onde o ícone do Pawta aparece).
- Duas bengalinhas cruzadas em X em cima do círculo, acima da cabeça da Paçoca (o mesmo arquivo, uma espelhada, ganchos para fora).
- A guirlanda do S.18 é uma faixa reta para a largura da tela. Aqui, `guirlanda-toski.svg` usa as mesmas peças (folhas, bolinhas, bengalinhas e estrelas, mesmas formas e cores) em arco, abraçando a parte de baixo do círculo, abaixo da bolinha.
- Movimento do canvas para o Natal: `szSway` (balança ±1,2° em 4 s; a guirlanda gira em volta do centro do círculo), parado com "reduzir movimento". Cada enfeite pode ter `anim`, `rotate`, `flip` e `origem` em `src/data/datas.ts`.

**TODO(ds)**: levar para o Toski DS o script do `<head>`, a leitura das datas (`datas-especiais.mjs`) e os SVGs dos enfeites, para os dois sites não se separarem.

## Cache do HTML (24 out 2026)
- Problema: com `cleanUrls`, a regra `**/*.html` do `firebase.json` nunca casava (o endereço é `/projetos`, não `/projetos.html`), e as páginas saíam com o padrão do Firebase, `max-age=3600`. Depois de um deploy, quem tinha aberto o site na última hora ficava com o HTML antigo apontando para arquivos de `/_astro/` que já não existiam (imagens quebradas e nome antigo do projeto em `/projetos`, depois do deploy do #4). Sitemap e `robots.txt` também ficavam com 1 hora.
- Agora: `**` com `Cache-Control: no-cache` (o navegador confere a cada visita; com ETag, volta 304 sem baixar de novo) e `/_astro/**` (nome com hash) com `public, max-age=31536000, immutable`, por último. Quando duas regras definem o mesmo cabeçalho, o Firebase usa a de baixo (conferido no ar: as imagens de `/_astro/` saíam com os 7 dias da regra de imagens, não com o `immutable`).
- Favicon, `apple-touch-icon`, `/og/` e `/datas/` também passam a `no-cache` (não têm hash; trocar um desenho chega na hora).
- `npm run check:cache` (no `npm run ci`) confere os cabeçalhos pelo `serve.mjs`.

## Card do Koti na Home (S.20, bug, 28 out 2026)
- Problema: no tema escuro, o ícone do Koti aparecia como o desenho solto (teto, bolinha e porta), sem o quadrado arredondado com fundo; e os selos ("Em desenvolvimento" e "iPhone · iOS 18+ · navegador") desciam para baixo do ícone. O card do Pawta é a referência.
- Causa do ícone: o `ProductIcon.astro` mostra no escuro a variante `dark` do DS, que vem com fundo transparente de propósito (no iOS 18 o próprio sistema põe o fundo escuro). No site ninguém punha esse fundo. O Pawta só parecia certo por causa do ícone da data (Halloween), que já tem fundo; fora das datas ele tinha o mesmo problema.
- Causa dos selos: no `ProjectCard.astro`, a linha do ícone tinha `sm:flex-wrap` e o grupo de selos `sm:flex-none`. Com o texto de plataforma do Koti, mais longo, a linha quebrava e os selos iam para baixo do ícone.
- Correção: a camada `data-art="dark"` do `ProductIcon` ganha `bg-background` (token do DS, `#231B17` no escuro, o fundo da página), dentro do mesmo arredondado e `overflow-hidden`, como o iOS faz com os ícones escuros. Os SVGs do DS não mudam. O ícone da data continua por cima. Vale para a Home, `/projetos` e `/suporte`.
- Os selos ficam sempre na coluna da direita do ícone (`flex-1 min-w-0 flex-wrap justify-end`, sem os `sm:`); se não couberem numa linha, quebram entre si nessa coluna. O texto da plataforma do Koti não muda.
- Conferido lado a lado com o Pawta em 1280 e 390 px, claro e escuro, `/` e `/en/`, com Halloween e com `?tema=nenhum`; `/projetos` e `/suporte` nos dois temas. O claro não muda (o ícone claro já tem fundo).
