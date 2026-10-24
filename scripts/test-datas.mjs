// Datas especiais (npm test): a lógica de src/lib/datas-especiais.mjs e o script do <head> já minificado, rodando num
// navegador de mentira (vm). Mesmos casos do site do Pawta (S.15): datas, virada do ano, ativo, forcar, sites,
// ?tema=, JSON inválido, armazenamento bloqueado e favicon.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { faviconDe, hojeBrasilia, naJanela, PADRAO, resolver, SITE_ID, TEMAS, validar } from '../src/lib/datas-especiais.mjs';
import { datasScript } from '../src/lib/datas-script.mjs';

/** Instante a partir da data e hora de Brasília. */
const brt = (iso) => Date.parse(`${iso}-03:00`);
const copia = () => structuredClone(PADRAO);
const tema = (cfg, agora, previa = null) => resolver(cfg, previa, agora, SITE_ID, TEMAS);

test('validar aceita o padrão e recusa formatos errados', () => {
  assert.equal(validar(PADRAO), PADRAO);
  const casos = [
    null,
    'texto',
    [],
    { ...copia(), ativo: 'sim' },
    { ...copia(), forcar: null },
    { ...copia(), temas: [] },
    { ...copia(), temas: { halloween: { ...PADRAO.temas.halloween, inicio: '13-01' } } },
    { ...copia(), temas: { halloween: { ...PADRAO.temas.halloween, fim: '10-32' } } },
    { ...copia(), temas: { halloween: { ...PADRAO.temas.halloween, inicio: '1-24' } } },
    { ...copia(), temas: { halloween: { ...PADRAO.temas.halloween, enfeites: 1 } } },
    { ...copia(), temas: { halloween: { ...PADRAO.temas.halloween, icone: undefined } } },
    { ...copia(), temas: { halloween: { ...PADRAO.temas.halloween, sites: 'toski' } } },
    { ...copia(), temas: { halloween: { ...PADRAO.temas.halloween, sites: [1] } } },
  ];
  for (const c of casos) assert.equal(validar(c), null, JSON.stringify(c));
});

test('janela com início e fim incluídos, e virando o ano', () => {
  const h = PADRAO.temas.halloween;
  assert.ok(naJanela('10-24', h) && naJanela('10-31', h));
  assert.ok(!naJanela('10-23', h) && !naJanela('11-01', h));
  const n = PADRAO.temas.natal;
  for (const md of ['12-01', '12-25', '12-31', '01-01', '01-06']) assert.ok(naJanela(md, n), md);
  for (const md of ['11-30', '01-07', '06-15']) assert.ok(!naJanela(md, n), md);
});

test('o dia é o de Brasília', () => {
  assert.deepEqual(hojeBrasilia(Date.parse('2026-11-01T02:59:59Z')), { md: '10-31', ano: 2026 });
  assert.deepEqual(hojeBrasilia(Date.parse('2026-11-01T03:00:00Z')), { md: '11-01', ano: 2026 });
  assert.deepEqual(hojeBrasilia(Date.parse('2027-01-01T02:00:00Z')), { md: '12-31', ano: 2026 });
});

test('datas do padrão embutido', () => {
  assert.equal(tema(PADRAO, brt('2026-10-23T23:59')), null);
  assert.deepEqual(tema(PADRAO, brt('2026-10-24T00:00')), { tema: 'halloween', enfeites: true, icone: true, ano: 2026 });
  assert.equal(tema(PADRAO, brt('2026-10-31T23:59'))?.tema, 'halloween');
  assert.equal(tema(PADRAO, brt('2026-11-01T00:00')), null);
  assert.deepEqual(tema(PADRAO, brt('2026-12-01T00:00')), { tema: 'natal', enfeites: true, icone: true, ano: 2026 });
  // O Natal de 2026 vai até 6/1/2027 e continua sendo a temporada 2026 (para o X da faixa).
  assert.deepEqual(tema(PADRAO, brt('2027-01-06T23:59')), { tema: 'natal', enfeites: true, icone: true, ano: 2026 });
  assert.equal(tema(PADRAO, brt('2027-01-07T00:00')), null);
});

test('ativo: false desliga tudo, menos a prévia', () => {
  const cfg = { ...copia(), ativo: false };
  assert.equal(tema(cfg, brt('2026-10-28T12:00')), null);
  assert.equal(tema(cfg, brt('2026-10-28T12:00'), 'natal')?.tema, 'natal');
});

test('forcar passa por cima das datas, respeitando sites', () => {
  const cfg = { ...copia(), forcar: 'natal' };
  assert.equal(tema(cfg, brt('2026-10-28T12:00'))?.tema, 'natal');
  assert.equal(tema(cfg, brt('2026-07-10T12:00'))?.tema, 'natal');
  cfg.temas.natal.sites = ['pawta'];
  assert.equal(tema(cfg, brt('2026-10-28T12:00')), null);
  assert.equal(tema({ ...copia(), forcar: 'pascoa' }, brt('2026-10-28T12:00')), null);
  assert.equal(tema({ ...copia(), ativo: false, forcar: 'natal' }, brt('2026-10-28T12:00')), null);
});

test('sites, temas desconhecidos e enfeites/icone', () => {
  const cfg = copia();
  cfg.temas.halloween.sites = ['pawta'];
  assert.equal(tema(cfg, brt('2026-10-28T12:00')), null);
  const novo = { ...copia(), temas: { pascoa: { inicio: '10-01', fim: '10-31', enfeites: true, icone: true, sites: ['toski'] }, ...copia().temas } };
  assert.equal(tema(novo, brt('2026-10-28T12:00'))?.tema, 'halloween');
  const leve = copia();
  Object.assign(leve.temas.halloween, { enfeites: false, icone: false });
  assert.deepEqual(tema(leve, brt('2026-10-28T12:00')), { tema: 'halloween', enfeites: false, icone: false, ano: 2026 });
});

test('prévia: tema conhecido, nenhum, ou desconhecido (ignorada)', () => {
  assert.deepEqual(tema(PADRAO, brt('2026-07-10T12:00'), 'halloween'), { tema: 'halloween', enfeites: true, icone: true, ano: 2026 });
  assert.equal(tema(PADRAO, brt('2026-10-28T12:00'), 'nenhum'), null);
  assert.equal(tema(PADRAO, brt('2026-10-28T12:00'), 'pascoa')?.tema, 'halloween');
});

/** Roda o script do <head> num navegador de mentira e devolve os atributos do <html> e o favicon. */
function rodar({ agora, search = '', local = {}, session = {}, bloqueado = false }) {
  const attrs = new Map();
  const icon = new Map([['href', '/favicon.svg'], ['data-favicon', '/favicon.svg']]);
  const area = (dados) => {
    const mapa = new Map(Object.entries(dados));
    return {
      getItem: (k) => {
        if (bloqueado) throw new Error('bloqueado');
        return mapa.has(k) ? mapa.get(k) : null;
      },
      setItem: (k, v) => {
        if (bloqueado) throw new Error('bloqueado');
        mapa.set(k, String(v));
      },
      removeItem: (k) => mapa.delete(k),
      mapa,
    };
  };
  const localStorage = area(local);
  const sessionStorage = area(session);
  class FakeDate extends Date {
    static now() {
      return agora;
    }
  }
  const document = {
    documentElement: {
      setAttribute: (k, v) => attrs.set(k, String(v)),
      removeAttribute: (k) => attrs.delete(k),
    },
    querySelector: (sel) =>
      sel === 'link[rel="icon"][data-favicon]' ? { getAttribute: (k) => icon.get(k) ?? null, setAttribute: (k, v) => icon.set(k, v) } : null,
  };
  const ctx = { document, localStorage, sessionStorage, location: { search }, URLSearchParams, Date: FakeDate };
  ctx.window = ctx;
  vm.runInNewContext(datasScript, ctx);
  return { attrs: Object.fromEntries(attrs), favicon: icon.get('href'), session: sessionStorage.mapa };
}

const OUT = brt('2026-10-28T12:00');

test('script: Halloween pelo padrão, com enfeites, ícone e favicon', () => {
  const r = rodar({ agora: OUT });
  assert.deepEqual(r.attrs, { 'data-tema': 'halloween', 'data-tema-ano': '2026', 'data-tema-enfeites': '', 'data-tema-icone': '' });
  assert.equal(r.favicon, faviconDe('halloween'));
});

test('script: fora das datas não marca nada', () => {
  const r = rodar({ agora: brt('2026-11-15T12:00') });
  assert.deepEqual(r.attrs, {});
  assert.equal(r.favicon, '/favicon.svg');
});

test('script: usa a última resposta guardada e cai no padrão se ela for inválida', () => {
  assert.deepEqual(rodar({ agora: OUT, local: { 'toski-datas': JSON.stringify({ ...copia(), ativo: false }) } }).attrs, {});
  assert.equal(rodar({ agora: OUT, local: { 'toski-datas': '{quebrado' } }).attrs['data-tema'], 'halloween');
  assert.equal(rodar({ agora: OUT, local: { 'toski-datas': JSON.stringify({ ativo: true }) } }).attrs['data-tema'], 'halloween');
  const leve = copia();
  leve.temas.halloween.icone = false;
  const r = rodar({ agora: OUT, local: { 'toski-datas': JSON.stringify(leve) } });
  assert.equal(r.attrs['data-tema-icone'], undefined);
  assert.equal(r.favicon, '/favicon.svg');
});

test('script: ?tema= guarda a prévia na aba; auto limpa; nenhum esconde', () => {
  const a = rodar({ agora: brt('2026-07-10T12:00'), search: '?tema=natal' });
  assert.equal(a.attrs['data-tema'], 'natal');
  assert.equal(a.session.get('toski-tema-previa'), 'natal');
  assert.equal(rodar({ agora: brt('2026-07-10T12:00'), session: { 'toski-tema-previa': 'natal' } }).attrs['data-tema'], 'natal');
  const b = rodar({ agora: OUT, search: '?tema=auto', session: { 'toski-tema-previa': 'natal' } });
  assert.equal(b.attrs['data-tema'], 'halloween');
  assert.equal(b.session.has('toski-tema-previa'), false);
  assert.deepEqual(rodar({ agora: OUT, search: '?tema=nenhum' }).attrs, {});
});

test('script: faixa fechada vale só para a mesma temporada', () => {
  assert.equal(rodar({ agora: OUT, local: { 'toski-data-fechada': 'halloween-2026' } }).attrs['data-tema-faixa-fechada'], '');
  assert.equal(rodar({ agora: OUT, local: { 'toski-data-fechada': 'halloween-2025' } }).attrs['data-tema-faixa-fechada'], undefined);
  assert.equal(rodar({ agora: brt('2027-01-03T12:00'), local: { 'toski-data-fechada': 'natal-2026' } }).attrs['data-tema-faixa-fechada'], '');
});

test('script: armazenamento bloqueado não quebra (vale o padrão)', () => {
  const r = rodar({ agora: OUT, search: '?tema=natal', bloqueado: true });
  assert.equal(r.attrs['data-tema'], 'halloween');
});
