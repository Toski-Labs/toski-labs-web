// Utilitários dos scripts de checagem (copiados do pethealth-web): lista as páginas em dist/ e as URLs públicas.
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

export const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
export const dist = path.join(root, 'dist');
export const SITE = 'https://toski-labs.com.br';

/** As 15 páginas: arquivo em dist/ → endereço público. `pair` liga a mesma página nos dois idiomas. */
export const pages = [
  { file: 'index.html', url: '/', lang: 'pt', pair: 'home' },
  { file: 'en.html', url: '/en', lang: 'en', pair: 'home' },
  { file: 'projetos.html', url: '/projetos', lang: 'pt', pair: 'projects' },
  { file: 'en/projects.html', url: '/en/projects', lang: 'en', pair: 'projects' },
  { file: 'estudio.html', url: '/estudio', lang: 'pt', pair: 'studio' },
  { file: 'en/studio.html', url: '/en/studio', lang: 'en', pair: 'studio' },
  { file: 'estudio/wallpapers.html', url: '/estudio/wallpapers', lang: 'pt', pair: 'wallpapers' },
  { file: 'en/studio/wallpapers.html', url: '/en/studio/wallpapers', lang: 'en', pair: 'wallpapers' },
  { file: 'estudio/temas.html', url: '/estudio/temas', lang: 'pt', pair: 'themes' },
  { file: 'en/studio/themes.html', url: '/en/studio/themes', lang: 'en', pair: 'themes' },
  { file: 'privacidade.html', url: '/privacidade', lang: 'pt', pair: 'privacy' },
  { file: 'en/privacy.html', url: '/en/privacy', lang: 'en', pair: 'privacy' },
  { file: 'suporte.html', url: '/suporte', lang: 'pt', pair: 'support' },
  { file: 'en/support.html', url: '/en/support', lang: 'en', pair: 'support' },
  { file: '404.html', url: '/404', lang: 'pt', noindex: true },
];

export async function loadPages() {
  return Promise.all(
    pages.map(async (p) => {
      const html = await readFile(path.join(dist, p.file), 'utf8');
      return { ...p, html, root: parse(html, { comment: false }) };
    }),
  );
}

export async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

export function report(name, errors) {
  if (errors.length) {
    console.error(`✗ ${name}: ${errors.length} problema(s)`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  console.log(`✓ ${name}`);
}
