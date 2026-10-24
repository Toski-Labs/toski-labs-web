// Serve dist/ como o Firebase Hosting (cleanUrls, sem barra no fim, 404.html com status 404). Copiado do pethealth-web.
// Uso: node scripts/serve.mjs [porta]   (npm run check:axe sobe este servidor)
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
import { dist, root } from './lib.mjs';

// Cabeçalhos do firebase.json (cache e segurança), para os testes verem o site como no ar.
const { hosting } = JSON.parse(await readFile(path.join(root, 'firebase.json'), 'utf8'));
const rules = hosting.headers.map((h) => ({
  re: new RegExp(
    '^' +
      h.source
        .replace(/[.+^${}()|[\]\\]/g, (c) => (c === '(' || c === ')' || c === '|' ? c : '\\' + c))
        .replace(/@\(/g, '(?:')
        .replace(/\*\*\//g, '(?:.*/)?')
        .replace(/\*\*/g, '.*')
        .replace(/(?<!\.)\*/g, '[^/]*') +
      '$',
  ),
  headers: Object.fromEntries(h.headers.map((x) => [x.key.toLowerCase(), x.value])),
}));
const headersFor = (url) => Object.assign({}, ...rules.filter((r) => r.re.test(url)).map((r) => r.headers));
const compressible = /\.(html|css|js|svg|json|webmanifest|xml|txt)$/;

const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.xml': 'application/xml', '.txt': 'text/plain' };

export function serve(port = 4322) {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost').pathname;
    const clean = url === '/' ? '/index' : url.replace(/\/$/, '');
    for (const candidate of [clean, `${clean}.html`]) {
      if (path.extname(candidate) === '' && candidate === clean) continue;
      try {
        const file = path.join(dist, candidate);
        if (!file.startsWith(dist)) break;
        const body = await readFile(file);
        const gz = compressible.test(file) && /gzip/.test(req.headers['accept-encoding'] ?? '');
        res.writeHead(200, { 'content-type': types[path.extname(file)] ?? 'application/octet-stream', ...headersFor(url), ...(gz ? { 'content-encoding': 'gzip', vary: 'accept-encoding' } : {}) });
        return res.end(gz ? gzipSync(body) : body);
      } catch {}
    }
    const body = await readFile(path.join(dist, '404.html'));
    const gz = /gzip/.test(req.headers['accept-encoding'] ?? '');
    res.writeHead(404, { 'content-type': types['.html'], ...headersFor(url), ...(gz ? { 'content-encoding': 'gzip', vary: 'accept-encoding' } : {}) });
    res.end(gz ? gzipSync(body) : body);
  });
  return new Promise((resolve) => server.listen(port, '127.0.0.1', () => resolve(server)));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.argv[2] ?? 4322);
  await serve(port);
  console.log(`dist/ em http://127.0.0.1:${port}`);
}
