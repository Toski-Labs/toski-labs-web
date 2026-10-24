/**
 * Datas especiais (Halloween, Natal…): o mesmo parâmetro `datas_especiais` do Remote Config do projeto
 * toski-labs que o site do Pawta lê. Formato (combinado com o pethealth-web):
 *   {
 *     "ativo": true,
 *     "forcar": "",
 *     "temas": {
 *       "halloween": { "inicio": "10-24", "fim": "10-31", "enfeites": true, "icone": true, "sites": ["pawta", "toski"] }
 *     }
 *   }
 * - Datas em MM-DD no horário de Brasília, início e fim incluídos. Fim menor que o início = a data vira o ano.
 * - `sites`: em quais sites o tema aparece. Este site é o "toski".
 * - `enfeites`: enfeites do hero e bolinha da Paçoca. `icone`: favicon e ícone do Pawta no card.
 *   A faixa do topo aparece sempre que o tema está ativo.
 * - Ordem: `?tema=` (prévia, até fechar a aba) > `ativo: false` (nada) > `forcar` > datas.
 *   `?tema=nenhum` esconde tudo e `?tema=auto` volta ao normal.
 * - JSON inválido, ausente ou lento: vale o padrão embutido (PADRAO).
 *
 * As funções abaixo rodam no navegador (DatasEspeciais.astro), nos testes (node) e, convertidas em texto, no script
 * do <head> (datas-script.mjs). Por isso não usam nada de fora delas mesmas além dos argumentos.
 * TODO(ds): levar a leitura das datas e o script do <head> para o Toski DS, para os dois sites usarem o mesmo código.
 */

/** Este site, na lista `sites` de cada tema. */
export const SITE_ID = 'toski';

/** Temas que este site sabe desenhar. Um tema do JSON fora desta lista é ignorado aqui. */
export const TEMAS = ['halloween', 'natal'];

/** Chaves no navegador. */
export const CHAVES = {
  /** Última resposta válida do Remote Config (localStorage), lida pelo script do <head> na próxima visita. */
  cache: 'toski-datas',
  /** Prévia por ?tema= (sessionStorage, até fechar a aba). */
  previa: 'toski-tema-previa',
  /** Faixa fechada no X (localStorage): "<tema>-<ano da temporada>", para voltar na próxima temporada. */
  fechada: 'toski-data-fechada',
};

/** Padrão embutido: vale quando o Remote Config falha, demora ou manda um JSON inválido. */
export const PADRAO = {
  ativo: true,
  forcar: '',
  temas: {
    halloween: { inicio: '10-24', fim: '10-31', enfeites: true, icone: true, sites: ['pawta', 'toski'] },
    natal: { inicio: '12-01', fim: '01-06', enfeites: true, icone: true, sites: ['pawta', 'toski'] },
  },
};

/** Favicon de cada tema (deste site). */
export const faviconDe = (tema) => `/datas/${tema}/favicon-toski.svg`;

/** Confere o formato. Devolve o próprio objeto se estiver certo, ou null. */
export function validar(v) {
  var md = /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  if (!v || typeof v !== 'object' || typeof v.ativo !== 'boolean' || typeof v.forcar !== 'string') return null;
  if (!v.temas || typeof v.temas !== 'object' || Array.isArray(v.temas)) return null;
  for (var k in v.temas) {
    var t = v.temas[k];
    if (!t || typeof t !== 'object' || !md.test(t.inicio) || !md.test(t.fim)) return null;
    if (typeof t.enfeites !== 'boolean' || typeof t.icone !== 'boolean') return null;
    if (!Array.isArray(t.sites) || t.sites.some(function (s) { return typeof s !== 'string'; })) return null;
  }
  return v;
}

/** Dia de hoje em Brasília (UTC−3, sem horário de verão desde 2019): { md: "MM-DD", ano }. */
export function hojeBrasilia(agora) {
  var d = new Date(agora - 3 * 3600 * 1000);
  var p = function (n) { return (n < 10 ? '0' : '') + n; };
  return { md: p(d.getUTCMonth() + 1) + '-' + p(d.getUTCDate()), ano: d.getUTCFullYear() };
}

/** O dia `md` está na janela do tema? Início e fim incluídos; fim menor que o início vira o ano. */
export function naJanela(md, t) {
  return t.inicio <= t.fim ? md >= t.inicio && md <= t.fim : md >= t.inicio || md <= t.fim;
}

/**
 * Qual tema vale agora neste site. Devolve { tema, enfeites, icone, ano } ou null.
 * `ano` é o ano em que a temporada começou (o Natal de 2026 vai até 6/1/2027 e continua "2026").
 */
export function resolver(cfg, previa, agora, site, conhecidos) {
  var hoje = hojeBrasilia(agora);
  var anoDe = function (t) { return t.inicio > t.fim && hoje.md <= t.fim ? hoje.ano - 1 : hoje.ano; };
  var serve = function (id) {
    var t = cfg.temas[id];
    return t && conhecidos.indexOf(id) >= 0 && t.sites.indexOf(site) >= 0 ? t : null;
  };
  if (previa === 'nenhum') return null;
  if (previa && conhecidos.indexOf(previa) >= 0) return { tema: previa, enfeites: true, icone: true, ano: hoje.ano };
  if (!cfg.ativo) return null;
  if (cfg.forcar) {
    var f = serve(cfg.forcar);
    return f ? { tema: cfg.forcar, enfeites: f.enfeites, icone: f.icone, ano: anoDe(f) } : null;
  }
  for (var id in cfg.temas) {
    var t = serve(id);
    if (t && naJanela(hoje.md, t)) return { tema: id, enfeites: t.enfeites, icone: t.icone, ano: anoDe(t) };
  }
  return null;
}

/**
 * Lê prévia e cache do navegador, decide o tema e marca o <html>:
 * data-tema, data-tema-ano, data-tema-enfeites, data-tema-icone e data-tema-faixa-fechada.
 * Troca o favicon (link[rel=icon][data-favicon]) quando o tema tem ícone. Devolve o resultado de resolver().
 * Roda no <head>, antes da pintura (sem piscar), e de novo depois da resposta do Remote Config.
 */
export function aplicar(o, agora) {
  var d = document.documentElement;
  var ler = function (area, k) { try { return window[area].getItem(k); } catch (e) { return null; } };
  var q = null;
  try { q = new URLSearchParams(location.search).get('tema'); } catch (e) {}
  if (q !== null) {
    try { q === '' || q === 'auto' ? sessionStorage.removeItem(o.chaves.previa) : sessionStorage.setItem(o.chaves.previa, q); } catch (e) {}
  }
  var cfg = null;
  try { cfg = validar(JSON.parse(ler('localStorage', o.chaves.cache))); } catch (e) {}
  var r = resolver(cfg || o.padrao, ler('sessionStorage', o.chaves.previa), agora, o.site, o.conhecidos);
  var marcar = function (nome, valor) { valor == null || valor === false ? d.removeAttribute(nome) : d.setAttribute(nome, valor === true ? '' : valor); };
  marcar('data-tema', r && r.tema);
  marcar('data-tema-ano', r && String(r.ano));
  marcar('data-tema-enfeites', !!(r && r.enfeites));
  marcar('data-tema-icone', !!(r && r.icone));
  marcar('data-tema-faixa-fechada', !!r && ler('localStorage', o.chaves.fechada) === r.tema + '-' + r.ano);
  var icon = document.querySelector('link[rel="icon"][data-favicon]');
  if (icon) icon.setAttribute('href', r && r.icone ? '/datas/' + r.tema + '/favicon-toski.svg' : icon.getAttribute('data-favicon'));
  return r;
}

/** Opções do script deste site. */
export const OPCOES = { padrao: PADRAO, site: SITE_ID, conhecidos: TEMAS, chaves: CHAVES };
