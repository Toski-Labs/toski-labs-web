// SEO básico do HTML gerado (npm run check:seo), adaptado do pethealth-web: título no padrão "Toski Labs" /
// "Toski Labs: Página" (até 60), descrição (70–160), únicos por idioma, canonical, hreflang, h1 único, níveis de título
// sem pular, Open Graph e Twitter, noindex da 404, robots.txt e sitemap (exatamente as 14 páginas).
// Datas especiais: o Open Graph continua o de sempre, o script do <head> está em todas as páginas logo depois do favicon,
// e nenhuma imagem de /datas/ é carregada pelo HTML (só como fundo, pelo CSS, quando a data está ativa).
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { dist, loadPages, pages as allPages, report, SITE } from './lib.mjs';
import { datasScript } from '../src/lib/datas-script.mjs';

const errors = [];
const pages = await loadPages();
const seen = { title: new Map(), description: new Map() };
const meta = (p, sel) => p.root.querySelector(sel)?.getAttribute('content');

for (const p of pages) {
  const title = p.root.querySelector('title')?.text ?? '';
  const description = meta(p, 'meta[name="description"]') ?? '';
  const w = p.url;
  if (!/^Toski Labs(: .+)?$/.test(title) || title.length > 60) errors.push(`${w}: título fora do padrão "Toski Labs: Página" (até 60): ${title}`);
  if (!p.noindex && (description.length < 70 || description.length > 160)) errors.push(`${w}: descrição com ${description.length} caracteres (70–160)`);
  for (const k of ['title', 'description']) {
    const v = `${p.lang}|${k === 'title' ? title : description}`;
    if (seen[k].has(v)) errors.push(`${w}: ${k} repetido no mesmo idioma (igual a ${seen[k].get(v)})`);
    seen[k].set(v, w);
  }
  const h1 = p.root.querySelectorAll('h1');
  if (h1.length !== 1) errors.push(`${w}: ${h1.length} <h1>`);
  let last = 0;
  for (const h of p.root.querySelectorAll('h1, h2, h3, h4, h5, h6')) {
    const level = Number(h.rawTagName[1]);
    if (last && level > last + 1) errors.push(`${w}: título pulou de h${last} para h${level} ("${h.text.trim().slice(0, 30)}")`);
    last = level;
  }
  for (const sel of ['header', 'nav', 'main', 'footer']) if (!p.root.querySelector(sel)) errors.push(`${w}: sem <${sel}>`);

  // Datas especiais.
  const head = p.root.querySelector('head');
  const icon = head.querySelector('link[rel="icon"]');
  if (icon?.getAttribute('href') !== '/favicon.svg' || icon?.getAttribute('data-favicon') !== '/favicon.svg') errors.push(`${w}: favicon sem data-favicon="/favicon.svg"`);
  const next = icon?.nextElementSibling;
  if (next?.rawTagName !== 'script' || next.text !== datasScript) errors.push(`${w}: o script das datas especiais precisa vir logo depois do <link rel="icon"> (e igual ao de src/lib/datas-script.mjs)`);
  for (const el of p.root.querySelectorAll('[src], [href], [srcset]'))
    for (const attr of ['src', 'href', 'srcset']) if (el.getAttribute(attr)?.includes('/datas/')) errors.push(`${w}: <${el.rawTagName} ${attr}> carrega ${el.getAttribute(attr)} direto`);
  for (const bar of p.root.querySelectorAll('.toski-date-bar')) {
    if (bar.getAttribute('role') !== 'region' || !bar.getAttribute('aria-label')) errors.push(`${w}: faixa da data sem role="region" e aria-label`);
    if (!bar.querySelector('a[href^="https://pawta.toski-labs.com.br"]')) errors.push(`${w}: faixa da data sem link para o site do Pawta`);
  }
  for (const el of p.root.querySelectorAll('.toski-enfeite, .toski-bolinha-data, .toski-icone-data'))
    if (el.getAttribute('aria-hidden') !== 'true') errors.push(`${w}: enfeite sem aria-hidden="true"`);

  const robots = meta(p, 'meta[name="robots"]');
  if (p.noindex) {
    if (!robots?.includes('noindex')) errors.push(`${w}: a 404 precisa de noindex`);
    continue;
  }
  if (robots) errors.push(`${w}: meta robots inesperada: ${robots}`);
  const canonical = p.root.querySelector('link[rel="canonical"]')?.getAttribute('href');
  if (canonical !== `${SITE}${p.url}`) errors.push(`${w}: canonical ${canonical} (esperado ${SITE}${p.url})`);
  const alt = Object.fromEntries(p.root.querySelectorAll('link[rel="alternate"][hreflang]').map((l) => [l.getAttribute('hreflang'), l.getAttribute('href')]));
  const pair = Object.fromEntries(pages.filter((x) => x.pair === p.pair).map((x) => [x.lang, `${SITE}${x.url}`]));
  if (alt['pt-BR'] !== pair.pt || alt.en !== pair.en || alt['x-default'] !== pair.pt) errors.push(`${w}: hreflang ${JSON.stringify(alt)} (esperado pt-BR ${pair.pt}, en ${pair.en}, x-default no PT)`);
  for (const prop of ['og:type', 'og:locale', 'og:locale:alternate', 'og:site_name', 'og:title', 'og:description', 'og:url', 'og:image', 'og:image:width', 'og:image:height', 'og:image:alt'])
    if (!meta(p, `meta[property="${prop}"]`)) errors.push(`${w}: falta ${prop}`);
  for (const name of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image', 'twitter:image:alt']) if (!meta(p, `meta[name="${name}"]`)) errors.push(`${w}: falta ${name}`);
  if (meta(p, 'meta[property="og:url"]') !== canonical) errors.push(`${w}: og:url diferente do canonical`);
  const og = meta(p, 'meta[property="og:image"]') ?? '';
  if (!new RegExp(`^${SITE}/og/[a-z]+-(pt|en)\\.png$`).test(og) || meta(p, 'meta[name="twitter:image"]') !== og) errors.push(`${w}: imagem de compartilhamento fora de /og/ (${og})`);
  if (p.root.querySelectorAll('meta[name="theme-color"]').length !== 2) errors.push(`${w}: precisa de 2 theme-color (claro e escuro)`);
  for (const rel of ['icon', 'apple-touch-icon']) if (!p.root.querySelector(`link[rel="${rel}"]`)) errors.push(`${w}: falta link ${rel}`);
}
const robotsTxt = await readFile(path.join(dist, 'robots.txt'), 'utf8');
if (!robotsTxt.includes(`Sitemap: ${SITE}/sitemap-index.xml`)) errors.push('robots.txt não aponta para o sitemap-index.xml');

// Sitemap: o índice aponta só para o sitemap-0.xml, e o sitemap-0.xml lista exatamente as páginas indexáveis, sem a 404.
const locs = async (file) => [...(await readFile(path.join(dist, file), 'utf8')).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const indexLocs = await locs('sitemap-index.xml');
if (indexLocs.join() !== `${SITE}/sitemap-0.xml`) errors.push(`sitemap-index.xml: esperado só ${SITE}/sitemap-0.xml, veio ${indexLocs.join(', ') || 'nada'}`);
const pageLocs = (await locs('sitemap-0.xml')).sort();
const expected = allPages.filter((p) => !p.noindex).map((p) => `${SITE}${p.url}`).sort();
if (pageLocs.join() !== expected.join()) errors.push(`sitemap-0.xml: esperado exatamente ${expected.join(', ')}; veio ${pageLocs.join(', ')}`);
report(`seo: ${pages.length} páginas (títulos, descrições, canonical, hreflang, Open Graph, h1, sitemap, datas especiais)`, errors);
