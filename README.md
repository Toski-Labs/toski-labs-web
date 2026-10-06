# Toski Labs — site

Site da Toski Labs: projetos, Estúdio (wallpapers e temas), suporte e política de privacidade, em português e inglês.

No ar em **https://toski-labs.web.app**

## Stack

- [Astro 7](https://astro.build) + TypeScript (strict), site 100% estático
- Tailwind CSS 4 (via `@tailwindcss/vite`), tokens em `src/styles/global.css`
- Fonte Outfit servida pelo próprio site (`@fontsource-variable/outfit`)
- Firebase Hosting (plano Spark) e Remote Config só para ligar campanhas
- `@astrojs/sitemap` para o sitemap em PT e EN

Tudo gratuito: sem cookies, sem analytics e sem servidor.

## Rodando

Precisa de Node 22.12 ou mais novo.

| Comando           | O que faz                                          |
| :---------------- | :------------------------------------------------- |
| `npm install`     | Instala as dependências                            |
| `npm run dev`     | Servidor local em `localhost:4321`                 |
| `npm run build`   | Gera o site em `dist/`                             |
| `npm run preview` | Abre o `dist/` localmente, igual ao publicado      |
| `npm run deploy`  | Gera o site e publica no Firebase Hosting          |

## Publicando

```sh
npm run deploy
```

É o mesmo que `npm run build && firebase deploy --only hosting`.

A primeira vez: `npm install -g firebase-tools` e `firebase login`. O projeto Firebase é o `toski-labs` (`.firebaserc`); cache, URLs limpas e redirecionamentos ficam em `firebase.json`.

## Páginas

| Português              | Inglês                    |
| :--------------------- | :------------------------ |
| `/`                    | `/en`                     |
| `/pethealthtracker`    | `/en/pethealthtracker`    |
| `/estudio`             | `/en/studio`              |
| `/estudio/wallpapers`  | `/en/studio/wallpapers`   |
| `/estudio/temas`       | `/en/studio/themes`       |
| `/suporte`             | `/en/support`             |
| `/privacidade`         | `/en/privacy`             |

Os endereços de Suporte e Privacidade estão cadastrados na App Store e no Google: não mudar. `/wallpapers` redireciona para `/estudio/wallpapers`.

## Estrutura

```text
src/
├── assets/          marca (SVGs da Toski), fotos e prévias dos wallpapers
├── components/
│   ├── brand/       Mascot, PhoneMock, AppIcon, Wordmark…
│   ├── campaign/    faixa, selo e oferta de campanhas (Black Friday)
│   ├── pages/       uma página por arquivo, com os textos PT/EN
│   ├── studio/      prévias de editor e terminal, faixa do Toski DS
│   └── ui/          Button, Card, Pill, Icon, FaqItem…
├── content/legal/   política de privacidade em Markdown (pt e en)
├── data/            projetos, campanhas, wallpapers e Estúdio
├── i18n/ui.ts       rotas equivalentes PT↔EN e textos comuns
├── layouts/         BaseLayout (head, Open Graph, hreflang, tema)
├── lib/firebase.ts  configuração pública do app Web (Remote Config)
└── pages/           rotas finas que chamam os componentes de página
```

## Tarefas comuns

**Novo wallpaper**
1. Gere os arquivos na pasta `toskilabs/wallpapers` (`<nº>-<nome>-mobile.png` e `<nº>-<nome>-desktop-<5k|4k|macbook|ultrawide>.png`), faça o commit e crie uma release com **todos** os PNGs (`gh release create vX.Y mobile/*.png desktop/*/*.png`).
2. Copie o mobile e o 5K para `src/assets/wallpapers/` e adicione uma entrada em `src/data/wallpapers.ts` com o mesmo prefixo em `file`.

O botão Mobile baixa do próprio site; os de desktop baixam da release mais recente do GitHub.

**Novo projeto:** adicione em `src/data/projects.ts`.

**Ligar uma campanha:** datas e textos em `src/data/campaigns.ts`; a chave fica no Remote Config do projeto `toski-labs`, parâmetro `campanhas` (ex.: `{ "pethealthtracker": { "black_friday": true } }`). Para ver antes sem ligar nada: `?campanha=pethealthtracker.black_friday`.

**Publicar partes do Estúdio:** `themes.ready` e `ds.ready` em `src/data/studio.ts`. Com `false`, aparece no `npm run dev` mas fica fora do site publicado e do sitemap.

## Repositórios relacionados

- Wallpapers: [Toski-Labs/toski-labs-wallpapers](https://github.com/Toski-Labs/toski-labs-wallpapers)
- Tema VS Code: [Toski-Labs/toski-labs-vscode-theme](https://github.com/Toski-Labs/toski-labs-vscode-theme)
- Tema iTerm2: [Toski-Labs/toski-labs-iterm-theme](https://github.com/Toski-Labs/toski-labs-iterm-theme)
- Design system: [Toski-Labs/toski-ds](https://github.com/Toski-Labs/toski-ds)

Plano e decisões do projeto: [`docs/PLANO.md`](docs/PLANO.md).
