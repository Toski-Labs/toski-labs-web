// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import { unpublishedPaths } from './src/data/studio.ts';

const SITE = 'https://toski-labs.web.app';

// Mesma página em PT e EN (espelha src/i18n/ui.ts › routes). Usado no sitemap.
const pagePairs = [
  ['/', '/en'],
  ['/pethealthtracker', '/en/pethealthtracker'],
  ['/estudio', '/en/studio'],
  ['/estudio/wallpapers', '/en/studio/wallpapers'],
  ['/estudio/temas', '/en/studio/themes'],
  ['/privacidade', '/en/privacy'],
  ['/suporte', '/en/support'],
];

// https://astro.build/config
export default defineConfig({
  // Endereço público do site (Firebase Hosting, projeto toski-labs).
  site: SITE,
  // Gera /privacidade.html em vez de /privacidade/index.html.
  // O Firebase serve como /privacidade (cleanUrls) e sem barra no fim.
  trailingSlash: 'never',
  build: { format: 'file' },
  i18n: {
    defaultLocale: 'pt',
    locales: ['pt', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    // Componentes do Toski DS (React), renderizados só no servidor: sem diretiva client:, sem JS no navegador.
    react(),
    // Gera /sitemap-index.xml com as versões PT/EN ligadas (hreflang).
    // Ficam de fora a 404 e as páginas do Estúdio ainda não publicadas (src/data/studio.ts).
    sitemap({
      filter: (page) => !page.includes('/404') && !unpublishedPaths.includes(new URL(page).pathname),
      serialize(item) {
        const pair = pagePairs.find((p) => p.some((path) => new URL(item.url).pathname === path));
        if (pair) {
          item.links = [
            { lang: 'pt-BR', url: SITE + pair[0] },
            { lang: 'en', url: SITE + pair[1] },
          ];
        }
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
