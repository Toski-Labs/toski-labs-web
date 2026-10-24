// axe-core nas 15 páginas (npm run check:axe), adaptado do pethealth-web: claro e escuro, 390 e 1280 px, sem data e com
// cada data especial (?tema=), o que cobre o contraste das faixas. Tema escuro pelo localStorage, o mesmo caminho do
// menu de configurações; na Home o menu também é testado aberto.
// Datas especiais, além do axe: sem data nada de /datas/ é baixado; com data o favicon troca e todo arquivo de /datas/
// existe; enfeites e bolinha não cobrem texto nem botões e ficam parados com "reduzir movimento"; a Black Friday
// ganha a faixa; o X da faixa é lembrado; onde o ícone do Pawta aparece (Home, /projetos, /suporte), o da data entra.
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { pages, report } from './lib.mjs';
import { serve } from './serve.mjs';
import { TEMAS } from '../src/lib/datas-especiais.mjs';

const server = await serve(0);
const base = `http://127.0.0.1:${server.address().port}`;
const errors = [];
const browser = await chromium.launch();
const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];
let runs = 0;
/** Páginas que mostram o ícone do Pawta (card da Home, bloco em Projetos, lista de apps no Suporte). */
const PAGINAS_COM_PAWTA = new Set(['/', '/en', '/projetos', '/en/projects', '/suporte', '/en/support']);

/** Contexto novo (sessionStorage limpo) no tema e na largura pedidos, sem rede externa (o Remote Config não é usado na prévia). */
async function contexto(theme, width) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
  await ctx.route((url) => !url.href.startsWith(base), (route) => route.abort());
  await ctx.addInitScript((t) => localStorage.setItem('toski-theme', t), theme);
  const page = await ctx.newPage();
  const datas = [];
  page.on('response', (r) => {
    if (new URL(r.url()).pathname.startsWith('/datas/')) datas.push({ url: r.url(), status: r.status() });
  });
  return { ctx, page, datas };
}

/** Enfeites visíveis que encostam em texto ou botão do topo da Home. */
const sobreposicoes = () => {
  const visiveis = (sel) => [...document.querySelectorAll(sel)].filter((el) => getComputedStyle(el).display !== 'none');
  const enfeites = visiveis('.toski-enfeite, .toski-bolinha-data');
  const alvos = visiveis('#conteudo > section:first-of-type :is(h1, p, a, button)');
  const out = [];
  for (const e of enfeites) {
    const a = e.getBoundingClientRect();
    for (const t of alvos) {
      const b = t.getBoundingClientRect();
      if (a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top) out.push(`${e.className} × ${t.tagName} "${t.textContent.trim().slice(0, 20)}"`);
    }
  }
  return { out, enfeites: enfeites.length, animados: enfeites.filter((e) => getComputedStyle(e).animationName !== 'none').length };
};

for (const theme of ['light', 'dark']) {
  for (const width of [390, 1280]) {
    for (const tema of ['nenhum', ...TEMAS]) {
      const { ctx, page, datas } = await contexto(theme, width);
      for (const p of pages) {
        const where = `${p.url} ${width}px ${theme} tema=${tema}`;
        const before = datas.length;
        await page.goto(`${base}${p.url}?tema=${tema}`, { waitUntil: 'networkidle' });
        if ((await page.evaluate(() => document.documentElement.dataset.theme)) !== theme) errors.push(`${where}: tema ${theme} não aplicado`);
        const html = await page.evaluate(() => ({ tema: document.documentElement.dataset.tema ?? 'nenhum', favicon: document.querySelector('link[rel="icon"]').getAttribute('href') }));
        if (html.tema !== tema) errors.push(`${where}: data-tema=${html.tema}`);
        if (tema === 'nenhum') {
          if (datas.length > before) errors.push(`${where}: baixou ${datas.slice(before).map((d) => d.url).join(', ')} sem data ativa`);
          if (html.favicon !== '/favicon.svg') errors.push(`${where}: favicon ${html.favicon} sem data ativa`);
        } else {
          if (html.favicon !== `/datas/${tema}/favicon-toski.svg`) errors.push(`${where}: favicon ${html.favicon}`);
          const bar = page.locator(`.toski-date-bar[data-para="${tema}"]`);
          if (!(await bar.isVisible())) errors.push(`${where}: faixa da data não apareceu`);
          if ((await page.locator('.toski-date-bar:visible').count()) !== 1) errors.push(`${where}: mais de uma faixa de data visível`);
        }
        // Ícone do Pawta da data: em toda página com o ícone do Pawta, visível só com o tema que tem ícone.
        const icones = await page.evaluate(() => [...document.querySelectorAll('.toski-icone-data')].map((el) => ({ para: el.dataset.para, visivel: getComputedStyle(el).display !== 'none' })));
        if (PAGINAS_COM_PAWTA.has(p.url) && !icones.length) errors.push(`${where}: sem o ícone do Pawta da data`);
        for (const i of icones) if (i.visivel !== (i.para === tema)) errors.push(`${where}: ícone do Pawta de ${i.para} ${i.visivel ? 'visível' : 'escondido'}`);
        if (p.url === '/' || p.url === '/en') {
          const s = await page.evaluate(sobreposicoes);
          for (const o of s.out) errors.push(`${where}: enfeite em cima de ${o}`);
          if (s.animados) errors.push(`${where}: ${s.animados} enfeite(s) animado(s) com "reduzir movimento"`);
          if (tema !== 'nenhum' && s.enfeites === 0) errors.push(`${where}: bolinha da data não apareceu`);
        }
        const states = p.url === '/' && tema === 'nenhum' ? [['', null], ['menu aberto', '.toski-settings-trigger']] : [['', null]];
        for (const [label, open] of states) {
          if (open) await page.click(open);
          const { violations } = await new AxeBuilder({ page }).withTags(tags).analyze();
          runs++;
          for (const v of violations) errors.push(`${where} ${label}: ${v.id} (${v.nodes.length}) ${v.nodes[0].target.join(' ')}`);
        }
      }
      for (const d of datas) if (d.status !== 200) errors.push(`${d.url}: ${d.status}`);
      await ctx.close();
    }
  }
}

// Black Friday e data no mesmo dia: só a faixa da Black Friday. Depois, o X da faixa da data é lembrado.
{
  const { ctx, page } = await contexto('light', 1280);
  await page.goto(`${base}/?tema=halloween&campanha=pawta.black_friday`, { waitUntil: 'networkidle' });
  if (!(await page.locator('.toski-campaign-bar').isVisible())) errors.push('Black Friday + Halloween: faixa da Black Friday não apareceu');
  if (await page.locator('.toski-date-bar:visible').count()) errors.push('Black Friday + Halloween: a faixa da data também apareceu');
  await ctx.close();
}
{
  const { ctx, page } = await contexto('dark', 390);
  await page.goto(`${base}/?tema=natal`, { waitUntil: 'networkidle' });
  await page.click('.toski-date-bar[data-para="natal"] [data-data-fechar]');
  if (await page.locator('.toski-date-bar:visible').count()) errors.push('X da faixa: a faixa não sumiu');
  await page.goto(`${base}/projetos`, { waitUntil: 'networkidle' });
  if (await page.locator('.toski-date-bar:visible').count()) errors.push('X da faixa: a faixa voltou na página seguinte');
  if ((await page.evaluate(() => document.documentElement.dataset.tema)) !== 'natal') errors.push('X da faixa: o tema sumiu junto com a faixa');
  await ctx.close();
}

await browser.close();
server.close();
report(`axe: ${runs} varreduras (15 páginas × claro/escuro × 390/1280 × sem data/${TEMAS.join('/')}, com o menu aberto) e checagens das datas`, errors);
