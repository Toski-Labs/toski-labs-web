/**
 * Estúdio: wallpapers, temas (VS Code e iTerm2) e o Toski DS.
 *
 * `ready` controla o que vai para o ar. Enquanto um item não estiver pronto
 * (links de verdade preenchidos), ele aparece só no `npm run dev`; no site publicado
 * o card some da página do Estúdio e a página fica fora do Google (noindex + fora do sitemap).
 */
export const studio = {
  themes: {
    ready: true,
    vscode: {
      /** Página da extensão no Marketplace da Microsoft. */
      marketplaceUrl: 'https://marketplace.visualstudio.com/items?itemName=toskilabs.toski-theme',
      /** Página no Open VSX (Cursor, VSCodium…). */
      openVsxUrl: 'https://open-vsx.org/extension/toskilabs/toski-theme',
      /** ID da extensão: publicador.nome. */
      extensionId: 'toskilabs.toski-theme',
      version: '1.0.0',
      githubUrl: 'https://github.com/Toski-Labs/toski-labs-vscode-theme',
    },
    iterm: {
      githubUrl: 'https://github.com/Toski-Labs/toski-labs-iterm-theme',
      /** Os .itermcolors saem da release mais recente do repositório (anexos com estes nomes). */
      downloadBase: 'https://github.com/Toski-Labs/toski-labs-iterm-theme/releases/latest/download/',
      /**
       * name: como aparece no iTerm2. asset: nome do anexo na release (o GitHub troca espaço por ponto).
       * O ☯ Toski troca sozinho com o tema do Mac.
       */
      files: [
        { asset: 'Toski.itermcolors', name: '☯ Toski', detail: { pt: 'Claro e escuro · recomendado', en: 'Light and dark · recommended' } },
        { asset: 'Toski.Dark.itermcolors', name: 'Toski Dark', detail: { pt: 'Só escuro', en: 'Dark only' } },
        { asset: 'Toski.Light.itermcolors', name: 'Toski Light', detail: { pt: 'Só claro', en: 'Light only' } },
      ],
    },
  },
  ds: {
    ready: false,
    githubUrl: 'https://github.com/Toski-Labs/toski-ds',
  },
};

/** Endereços das páginas que só entram no sitemap quando prontas (usado no astro.config). */
export const unpublishedPaths = studio.themes.ready ? [] : ['/estudio/temas', '/en/studio/themes'];

/** Cores da Toski mostradas na seção do DS (mesmos valores de src/styles/global.css). */
export const swatches = [
  { id: 'caramelo', hex: '#DB9A5B', name: { pt: 'Caramelo', en: 'Caramel' } },
  { id: 'ferrugem', hex: '#A9541F', name: { pt: 'Ferrugem', en: 'Rust' } },
  { id: 'creme', hex: '#F4E4CC', name: { pt: 'Creme', en: 'Cream' } },
  { id: 'papel', hex: '#F7F1E8', name: { pt: 'Papel', en: 'Paper' } },
  { id: 'carvao', hex: '#231B17', name: { pt: 'Carvão', en: 'Charcoal' } },
] as const;

/** Paletas dos temas Toski (prévia do editor e do terminal), iguais a Toski-Labs/toski-labs-vscode-theme v1.0.0. */
export type ThemeId = 'escuro' | 'claro';
export const themePalettes = {
  escuro: {
    name: 'Toski Dark', bg: '#231B17', panel: '#1B1511', side: '#2A201A', line: '#43352B', text: '#F1E6D8', muted: '#AA9481', lineNo: '#A08A78',
    accent: '#DB9A5B', status: '#1B1511', statusText: '#AA9481', current: '#2E241D', active: '#3A2D23',
    k: '#DB9A5B', f: '#F4D3A8', t: '#8FB8C9', s: '#A9C98F', n: '#E39A8E', p: '#CDA6D0', c: '#B5A496', u: '#C2AE98', x: '#F1E6D8',
    red: '#E0705E', green: '#A9C98F', yellow: '#E8C26B', blue: '#8FB8C9', magenta: '#CDA6D0', cyan: '#8CC7BA',
  },
  claro: {
    name: 'Toski Light', bg: '#FBF6EE', panel: '#EFE5D6', side: '#F5ECDF', line: '#E2D3BE', text: '#231B17', muted: '#6E5A4B', lineNo: '#7A6556',
    accent: '#A9541F', status: '#EFE5D6', statusText: '#6E5A4B', current: '#F7EFE3', active: '#EBDAC2',
    k: '#994C1C', f: '#7A4A12', t: '#2F6185', s: '#3D6B39', n: '#A23B3B', p: '#7A4E8C', c: '#705D4F', u: '#6B5648', x: '#231B17',
    red: '#B23A2E', green: '#3F6E3B', yellow: '#8A6A00', blue: '#2F6185', magenta: '#7A4E8C', cyan: '#2E7468',
  },
} as const;
export type Palette = (typeof themePalettes)[ThemeId];

/** Papéis de cor: k palavra-chave, f função, t tipo, s texto, n número, p propriedade, c comentário, u pontuação, x normal, v parâmetro (itálico). */
type Role = 'k' | 'f' | 't' | 's' | 'n' | 'p' | 'c' | 'u' | 'x' | 'v';
export const sampleCode: [string, Role][][] = [
  [['// A Paçoca aprova (ou não) cada lembrete.', 'c']],
  [['import', 'k'], [' { ', 'u'], ['agendar', 'x'], [' } ', 'u'], ['from', 'k'], [" './lembretes'", 's'], [';', 'u']],
  [],
  [['const', 'k'], [' pacoca', 'x'], [' = { ', 'u'], ['nome', 'p'], [': ', 'u'], ["'Paçoca'", 's'], [', ', 'u'], ['idade', 'p'], [': ', 'u'], ['4', 'n'], [' };', 'u']],
  [],
  [['export function', 'k'], [' proximaVacina', 'f'], ['(', 'u'], ['pet', 'v'], [': ', 'u'], ['Pet', 't'], ['): ', 'u'], ['Date', 't'], [' {', 'u']],
  [['  return', 'k'], [' agendar', 'f'], ['(', 'u'], ['pet', 'v'], [', { ', 'u'], ['tipo', 'p'], [': ', 'u'], ["'V10'", 's'], [', ', 'u'], ['emDias', 'p'], [': ', 'u'], ['30', 'n'], [' });', 'u']],
  [['}', 'u']],
];

/** Terminal: [texto, cor, negrito?]. 'cursor' desenha o cursor. */
type TermColor = 'x' | 'muted' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'cursor';
export const sampleTerminal: [string, TermColor, boolean?][][] = [
  [['paçoca', 'yellow', true], ['@toski ', 'muted'], ['~/pethealthtracker ', 'blue', true], ['(main) ', 'magenta'], ['$ ', 'muted'], ['git status', 'x']],
  [['On branch ', 'x'], ['main', 'cyan']],
  [['Changes to be committed:', 'x']],
  [['        modified:   Sources/Home/HomeView.swift', 'green']],
  [['Changes not staged for commit:', 'x']],
  [['        modified:   Sources/Pets/PetCard.swift', 'red']],
  [],
  [['paçoca', 'yellow', true], ['@toski ', 'muted'], ['~/pethealthtracker ', 'blue', true], ['(main) ', 'magenta'], ['$ ', 'muted'], [' ', 'cursor']],
];
