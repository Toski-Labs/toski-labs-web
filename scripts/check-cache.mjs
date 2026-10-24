// Cache do Firebase Hosting (npm run check:cache), pelos cabeçalhos do firebase.json servidos como no ar (serve.mjs).
// Tudo o que não tem hash no nome (páginas com URL limpa, sitemap, robots, favicon, /og/, /datas/) vem com no-cache:
// o navegador confere a cada visita e nunca fica com um HTML antigo apontando para arquivos de /_astro/ que já sumiram.
// Só /_astro/** (nome com hash) tem cache longo e immutable. Quando duas regras definem o mesmo cabeçalho, o Firebase
// usa a de baixo (conferido no ar em 24 out 2026): por isso /_astro/** vem por último no firebase.json.
import path from 'node:path';
import { dist, pages, report, walk } from './lib.mjs';
import { serve } from './serve.mjs';

const server = await serve(0);
const base = `http://127.0.0.1:${server.address().port}`;
const errors = [];
const head = async (url) => (await fetch(base + url, { method: 'HEAD', redirect: 'manual' })).headers.get('cache-control');

const astro = (await walk(path.join(dist, '_astro'))).map((f) => '/' + path.relative(dist, f));
const exemplos = {
  'no-cache': [
    ...pages.map((p) => p.url),
    '/nao-existe',
    '/sitemap-index.xml',
    '/sitemap-0.xml',
    '/robots.txt',
    '/favicon.svg',
    '/apple-touch-icon.png',
    '/og/og-pt.png',
    '/datas/halloween/fantasminha.svg',
  ],
  'public, max-age=31536000, immutable': ['.css', '.js', '.webp', '.woff2'].map((ext) => astro.find((f) => f.endsWith(ext))).filter(Boolean),
};
if (exemplos['public, max-age=31536000, immutable'].length < 4) errors.push('faltou exemplo de .css, .js, .webp ou .woff2 em dist/_astro');
for (const [esperado, urls] of Object.entries(exemplos))
  for (const url of urls) {
    const valor = await head(url);
    if (valor !== esperado) errors.push(`${url}: Cache-Control "${valor}" (esperado "${esperado}")`);
  }
server.close();
report(`cache: ${Object.values(exemplos).flat().length} endereços (HTML e sem hash com no-cache, /_astro/ com cache longo)`, errors);
