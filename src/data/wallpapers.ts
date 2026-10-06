import type { ImageMetadata } from 'astro';
import type { Lang } from '../i18n/ui';

import minimalIphone from '../assets/wallpapers/toski-minimal-iphone.png';
import minimalMac from '../assets/wallpapers/toski-minimal-mac.png';
import noturnaIphone from '../assets/wallpapers/toski-noturna-iphone.png';
import noturnaMac from '../assets/wallpapers/toski-noturna-mac.png';
import padraoIphone from '../assets/wallpapers/toski-padrao-noturno-iphone.png';
import padraoMac from '../assets/wallpapers/toski-padrao-noturno-mac.png';
import linhaIphone from '../assets/wallpapers/toski-linha-iphone.png';
import linhaMac from '../assets/wallpapers/toski-linha-mac.png';
import halloweenIphone from '../assets/wallpapers/toski-halloween-iphone.png';
import halloweenMac from '../assets/wallpapers/toski-halloween-mac.png';
import lickIphone from '../assets/wallpapers/toski-lick-or-treat-iphone.png';
import lickMac from '../assets/wallpapers/toski-lick-or-treat-mac.png';

/**
 * Wallpapers da Toski Labs (originais em toskilabs/wallpapers; aqui ficam o mobile 1320 × 2868 e o desktop 5K, usados na prévia).
 * A prévia é gerada em WebP pelo <Image>; o botão baixa o PNG original (image.src).
 * Para incluir um novo: copie o PNG para src/assets/wallpapers e adicione aqui.
 */
export interface Wallpaper {
  id: string;
  name: Record<Lang, string>;
  description: Record<Lang, string>;
  iphone?: ImageMetadata;
  mac?: ImageMetadata;
  /** Prefixo dos arquivos na release do GitHub (ex.: '01-minimal' → 01-minimal-desktop-5k.png). */
  file: string;
}

/** Tamanhos de desktop publicados na release (pastas desktop/<id> em toskilabs/wallpapers). */
export const desktopSizes = [
  { id: '5k', label: '5K', width: 5120, height: 2880, hint: { pt: 'Studio Display, iMac 27″', en: 'Studio Display, iMac 27″' } },
  { id: '4k', label: '4K', width: 3840, height: 2160, hint: { pt: 'Monitores 4K e 16:9', en: '4K and 16:9 displays' } },
  { id: 'macbook', label: 'MacBook', width: 3456, height: 2234, hint: { pt: 'MacBook Pro e Air', en: 'MacBook Pro and Air' } },
  { id: 'ultrawide', label: 'Ultrawide', width: 5120, height: 2160, hint: { pt: 'Monitores 21:9', en: '21:9 displays' } },
] as const;

/**
 * Downloads de desktop (os arquivos mais pesados, em 4 tamanhos) saem das releases do GitHub,
 * para não gastar o limite diário do Firebase. O mobile continua baixando do site:
 * assim a imagem abre no Safari e dá para tocar em Compartilhar › Salvar imagem (vai para Fotos).
 * Enquanto `ready` for false, o desktop baixa o 5K do próprio site.
 */
export const wallpaperRelease = {
  ready: true,
  repoUrl: 'https://github.com/Toski-Labs/toski-labs-wallpapers',
  /** "latest" sempre aponta para a release mais recente; os nomes dos anexos seguem <file>-desktop-<tamanho>.png. */
  downloadBase: 'https://github.com/Toski-Labs/toski-labs-wallpapers/releases/latest/download/',
};

export const wallpapers: Wallpaper[] = [
  {
    id: 'halloween',
    name: { pt: 'Halloween', en: 'Halloween' },
    description: { pt: 'A Toski entre abóboras, teias e fantasminhas.', en: 'Toski among pumpkins, webs and little ghosts.' },
    iphone: halloweenIphone,
    mac: halloweenMac,
    file: '06-halloween',
  },
  {
    id: 'lick-or-treat',
    name: { pt: 'Lick or Treat', en: 'Lick or Treat' },
    description: { pt: 'Estampa lilás com fantasminhas, doces e “woof!”.', en: 'A lilac pattern with ghosts, treats and “woof!”.' },
    iphone: lickIphone,
    mac: lickMac,
    file: '07-lick-or-treat',
  },
  {
    id: 'minimal',
    name: { pt: 'Minimal', en: 'Minimal' },
    description: { pt: 'A Toski e o nome sobre o papel, bem discreto.', en: 'Toski and the name on paper, nice and subtle.' },
    iphone: minimalIphone,
    mac: minimalMac,
    file: '01-minimal',
  },
  {
    id: 'noturna',
    name: { pt: 'Noturna', en: 'Night' },
    description: { pt: 'A Toski grande, com a bolinha, no fundo escuro.', en: 'A big Toski with her ball on a dark background.' },
    iphone: noturnaIphone,
    mac: noturnaMac,
    file: '02-noturna',
  },
  {
    id: 'padrao-noturno',
    name: { pt: 'Padrão noturno', en: 'Night pattern' },
    description: { pt: 'Estampa de Toskis e bolinhas em fileiras.', en: 'Rows of little Toskis and balls.' },
    iphone: padraoIphone,
    mac: padraoMac,
    file: '03-padrao-noturna',
  },
  {
    id: 'linha',
    name: { pt: 'Linha', en: 'Line' },
    description: { pt: 'A Toski só no traço, sobre o creme.', en: 'Toski as a single line on cream.' },
    iphone: linhaIphone,
    mac: linhaMac,
    file: '05-linha',
  },
];
