# Site da Toski Labs — plano de desenvolvimento

Fonte da verdade visual: canvas "Toski Labs — Site" (Artifact de Design) + `../../design/` (tokens, SVGs da Paçoca, animações).
Stack: Astro 7 + TypeScript (strict) + Tailwind 4 (via `@tailwindcss/vite`). Hospedagem: Firebase Hosting, projeto `toski-labs` (Plano Spark), em `toski-labs.web.app`.
Regra: tudo gratuito. Site estático, sem cookies, sem SDK do Firebase, sem Google Analytics.

## Decisões
- E-mail de suporte e contato: **toskilabs@gmail.com** (site, política, App Store e Google).
- Idiomas: português em `/`, inglês em `/en/`. Sem redirecionamento automático pelo navegador; o botão PT/EN no cabeçalho troca para a página equivalente.
- Rotas: `/`, `/pethealthtracker`, `/privacidade`, `/suporte` · `/en/`, `/en/pethealthtracker`, `/en/privacy`, `/en/support`. Esses endereços vão para App Store Connect e Google: não mudar depois de cadastrados.
- Tema: claro e escuro automáticos pelo sistema (`prefers-color-scheme`), sem botão — igual ao app.
- Fonte: Outfit hospedada no site (`@fontsource-variable/outfit`), sem Google Fonts.
- Projetos vêm de uma lista de dados (`src/data/projects.ts`) para um novo projeto entrar sem mexer no layout.
- Privacidade e Suporte escritos em Markdown (content collections), um arquivo por idioma.
- Fotos da Paçoca já em `src/assets/fotos/` (`pacoca-sorrindo.jpg` com o fundo tratado é a padrão). Usar `<Image>` do Astro (gera WebP e tamanhos).

## Fase 0 — Fundação ✅ (5 out 2026)
Feita: tokens em `src/styles/global.css`, Outfit local, SVGs em `src/assets/brand/`, favicon e apple-touch-icon, i18n em `src/i18n/ui.ts` (rotas, textos, `SUPPORT_EMAIL`), `BaseLayout`, `Header`, `Footer`, 8 rotas com página provisória (`Placeholder.astro`, some na Fase 2). Build gera `/privacidade.html` etc. (`build.format: 'file'`).

1. Remover o starter (`Welcome.astro`, `src/assets/*.svg` do Astro, favicons padrão).
2. `src/styles/global.css`: `@theme` do Tailwind com os tokens de `../../design/tokens/tokens.json` — cores semânticas como variáveis CSS (claro em `:root`, escuro em `@media (prefers-color-scheme: dark)`), raios (chip 999, botão 14, card 18, seção 28), fonte Outfit. Classes resultantes: `bg-background`, `bg-surface`, `bg-tint`, `bg-hero`, `text-ink`, `text-muted`, `border-line`, `bg-accent`, `text-on-accent`, `text-critical`, `text-success`, `bg-footer`… Container das páginas: classe `page`.
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
2. PetHealthTracker: hero + `PhoneMock` · Recursos (6 cards) · Destaque PDF (PLUS) · Grátis × Plus com preços (EN: `[PRICE]` até definir) · Detalhes · CTA Suporte/Privacidade.
3. Privacidade: sumário lateral + seções numeradas (Markdown). Placeholders a preencher: data, prazos, rede de anúncios.
4. Suporte: contato, código de suporte, FAQ.
5. 404 com a Paçoca e a bolinha no chão (`pacoca-bolinha-chao-*.svg`).

## Fase 3 — Qualidade ✅ (5 out 2026)
Feita. `@astrojs/sitemap` com PT/EN ligados (`/sitemap-index.xml`, sem a 404), `public/robots.txt`, imagens de compartilhamento `public/og/og-pt.png` e `og-en.png` (1200×630) com Open Graph e Twitter card. Acessibilidade: token `accent-text` (#94481A no claro) para texto pequeno de destaque sobre tint/hero (o #A9541F não passava 4,5:1), links dentro de texto sublinhados, botão PT/EN com nome acessível que inclui o texto visível. axe-core sem nenhuma violação nas 9 páginas (1280/390, claro/escuro). Lighthouse: 100 em desempenho, acessibilidade, boas práticas e SEO.

- Acessibilidade: contraste 4,5:1, foco visível, alt nas imagens, alvos de toque ≥ 44 px, `prefers-reduced-motion`.
- Responsivo: conferir em 390 px e 1280 px, claro e escuro, comparando com os quadros do canvas.
- SEO: `@astrojs/sitemap`, `robots.txt`, descrições por página, `hreflang`.
- Performance: Lighthouse ≥ 95 em tudo; imagens via `<Image>`.

## Fase 4 — Publicação no Firebase
1. `firebase init hosting` nesta pasta → projeto `toski-labs`, public `dist`, SPA **não**, GitHub **não**.
2. `firebase.json`: `cleanUrls: true`, `trailingSlash: false`, cache longo para `/_astro/**`, `404.html`.
3. `npm run build && firebase deploy --only hosting` → `https://toski-labs.web.app`.
4. Mais tarde: `public/app-ads.txt` quando os anúncios entrarem; deploy automático pelo GitHub Actions se fizer falta.

## Novidades ✅ (5 out 2026)
Desenhadas no canvas (página "Novidades") e implementadas:
1. **Menu de configurações** (`SettingsMenu.astro`) no lugar do botão EN: tema Automático/Claro/Escuro (salvo em `localStorage` `toski-theme`; aplicado por script inline no `<head>` antes da pintura; CSS aceita `data-theme` além do `prefers-color-scheme`) e idioma PT/EN. Fecha com Esc e clique fora; setas trocam o tema.
2. **Aviso de idioma do navegador** (`LangBanner.astro`): só na primeira visita, sem redirecionar. Textos em `src/i18n/ui.ts › langNotice` (es, fr, de, it, en, pt e "other").
3. **Wallpapers**: `/wallpapers` e `/en/wallpapers`, link no menu e no rodapé. Dados em `src/data/wallpapers.ts`, PNGs em `src/assets/wallpapers/` (prévia WebP + download do original). Filtro iPhone/Mac só com CSS. Faltam versões iPhone do Padrão noturno e da Linha.
4. **Black Friday**: `src/data/campaigns.ts` (projeto, chave, `start`, `end`, textos, preços). Faixa no topo de todas as páginas (`CampaignBar`), selo no card do projeto na Home (`CampaignSeal`) e seção BLACK FRIDAY na página do PetHealthTracker (`BlackFridayOffer`), no visual da tela de Black Friday do app. Preencher `appStoreUrl`.

## Campanhas pelo Remote Config ✅ (5 out 2026)
- Quem liga e desliga é o **Remote Config do projeto Firebase `toski-labs`** (app Web "site"), parâmetro `campanhas` (JSON), uma entrada por projeto: `{ "pethealthtracker": { "black_friday": true } }`. Promoção de um projeto só = ligar só a chave dele.
- Uma campanha aparece quando **a data está dentro de `start`–`end`** e **a chave está ligada**. Fora das datas o site nem baixa o Firebase. Se o Remote Config falhar, nada aparece (padrão desligado). A última resposta fica guardada no navegador para a página não pular na volta.
- Controle: `src/components/campaign/CampaignFlags.astro`; configuração do app Web: `src/lib/firebase.ts` (valores públicos).
- Prévia sem ligar nada: abrir qualquer página com `?campanha=pethealthtracker.black_friday` (vale até fechar a aba).
- O app do iPhone continua com o Remote Config do próprio projeto. **São dois interruptores por campanha.**

### Passo a passo de uma campanha (ex.: Black Friday do PetHealthTracker)
1. App Store Connect: agendar as ofertas (introdutória/promocional do anual e preço temporário do vitalício).
2. Projeto Firebase do app: ligar a campanha no Remote Config do app.
3. Projeto Firebase `toski-labs` › Remote Config: em `campanhas`, pôr `"black_friday": true` dentro de `"pethealthtracker"` e **Publicar alterações**.
4. Conferir no site (pode levar até 5 minutos para quem já estava com a página aberta).
5. Depois do fim: desligar as duas chaves (o site já some sozinho pela data).
Menu do cabeçalho agora: Projetos · Wallpapers · Suporte (o "Sobre" segue acessível pela Home).

## Estúdio ✅ (5 out 2026)
- Menu: Projetos · **Estúdio** · Suporte. Endereços: `/estudio` (`/en/studio`), `/estudio/wallpapers` (`/en/studio/wallpapers`, antes `/wallpapers`) e `/estudio/temas` (`/en/studio/themes`).
- Página principal: cards de Wallpapers e Temas e a faixa do **Toski DS** (cores que copiam no clique, fonte, tokens, link para o GitHub).
- Temas: VS Code e iTerm2, com prévia clara/escura feita em HTML (troca só com CSS). Paletas e código de exemplo em `src/data/studio.ts`.
- **O que vai para o ar** é controlado por `studio.themes.ready` e `studio.ds.ready` em `src/data/studio.ts`. Enquanto estiverem `false`: no `npm run dev` aparece tudo; no site publicado o card de Temas e a faixa do DS somem, e `/estudio/temas` fica com noindex e fora do sitemap.
- Para publicar: preencher os links (Marketplace, Open VSX, `.itermcolors`, GitHub dos temas e do DS) e trocar `ready` para `true`.

## Pendências de conteúdo
- Política: data (5 out 2026), exclusão em 30 dias e rede de anúncios genérica preenchidos; **confirmar os 30 dias**, nomear a rede quando decidir, faixa etária e revisão jurídica.
- Suporte: resposta em até 2 dias úteis ✅.
- Preços em inglês: hoje "Local price" até ter os valores por país; link da App Store quando publicar.
- Wallpapers: 4 coleções com iPhone e Mac ✅. Downloads do Mac vêm da release mais recente de `Toski-Labs/toski-labs-wallpapers` (v1.1); nova coleção = nova release com os mesmos nomes de arquivo.
- Estúdio: temas no ar (VS Code no Marketplace; Open VSX em revisão + pedido do namespace `toskilabs`). Toski DS: `ds.ready` quando o repositório tiver conteúdo.
