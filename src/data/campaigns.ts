import type { Lang } from '../i18n/ui';

/**
 * Campanhas promocionais. Aqui ficam textos, preços e a janela de datas de cada uma.
 *
 * Quem liga e desliga é o Remote Config do projeto Firebase toski-labs, no parâmetro
 * `campanhas` (JSON, uma entrada por projeto), por exemplo:
 *   { "pethealthtracker": { "black_friday": true } }
 *
 * Uma campanha aparece no navegador só quando as duas coisas valem ao mesmo tempo:
 * a data está entre `start` e `end` (horário de Brasília) e a chave está ligada.
 * Fora da janela o site nem carrega o Firebase. Se o Remote Config falhar, nada aparece.
 * Para conferir antes de ligar: abra qualquer página com ?campanha=pethealthtracker.black_friday
 * (vale até fechar a aba e ignora data e chave).
 *
 * Os preços são os da App Store (ver decisões de produto); o mensal nunca tem desconto.
 */
export interface CampaignPrice {
  name: string;
  price: string;
  /** Preço normal, riscado. Vazio quando não há desconto. */
  old: string;
  sub: string;
  /** Selo do desconto, ex. "−50%". */
  badge: string;
  featured: boolean;
}

export interface Campaign {
  id: string;
  /** Projeto da campanha: chave de primeiro nível no parâmetro `campanhas` do Remote Config. */
  project: string;
  /** Chave da campanha dentro do projeto, no Remote Config. */
  flag: string;
  start: string;
  end: string;
  copy: Record<
    Lang,
    {
      tag: string;
      bar: string;
      barCta: string;
      kicker: string;
      title: string;
      lead: string;
      until: string;
      sticker: string;
      /** Selo no card do projeto, na Home. */
      seal: string;
      cta: string;
      fine: string;
      endsIn: string;
      units: [string, string, string];
      close: string;
      prices: CampaignPrice[];
    }
  >;
  /** Link da App Store (preencher quando o app estiver publicado). */
  appStoreUrl: string;
}

export const blackFriday: Campaign = {
  id: 'black-friday-2026',
  project: 'pethealthtracker',
  flag: 'black_friday',
  start: '2026-11-27T00:00:00-03:00',
  // Mesma data da tela de Black Friday do app ("Só até 30 de novembro, 23:59").
  end: '2026-11-30T23:59:59-03:00',
  appStoreUrl: '#',
  copy: {
    pt: {
      tag: 'BLACK FRIDAY',
      bar: '50% no primeiro ano do PetHealthTracker Plus anual.',
      barCta: 'Ver oferta',
      kicker: 'PetHealthTracker Plus · App Store',
      title: 'O maior desconto do ano no PetHealthTracker Plus.',
      lead: 'Pets ilimitados, PDFs e sem anúncios. O anual sai pela metade no primeiro ano e depois renova pelo valor normal.',
      until: 'Só até 30 de novembro, 23:59',
      sticker: 'no anual',
      seal: 'Plus anual pela metade no primeiro ano. Até 30/11.',
      cta: 'Aproveitar a Black Friday',
      fine: 'Preços da App Store no Brasil. Vale de 27 a 30 de novembro para quem nunca assinou o anual e para ex-assinantes. O mensal não tem desconto.',
      endsIn: 'A oferta termina em',
      units: ['d', 'h', 'min'],
      close: 'Fechar',
      prices: [
        { name: 'Anual', price: 'R$ 29,90', old: 'R$ 59,90', sub: 'primeiro ano · R$ 2,49 por mês', badge: '−50%', featured: true },
        { name: 'Vitalício', price: 'R$ 104,90', old: 'R$ 149,90', sub: 'pague uma vez, é seu pra sempre', badge: '−30%', featured: false },
      ],
    },
    en: {
      tag: 'BLACK FRIDAY',
      bar: '50% off the first year of PetHealthTracker Plus (yearly).',
      barCta: 'See the offer',
      kicker: 'PetHealthTracker Plus · App Store',
      title: 'The biggest discount of the year on PetHealthTracker Plus.',
      lead: 'Unlimited pets, PDFs and no ads. Yearly is half price for the first year, then renews at the regular price.',
      until: 'Only until November 30, 11:59 PM',
      sticker: 'yearly plan',
      seal: 'Yearly Plus at half price for the first year. Until Nov 30.',
      cta: 'Get the Black Friday deal',
      fine: 'App Store prices. Valid from Nov 27 to 30 for people who never subscribed to the yearly plan and for former subscribers. Monthly has no discount.',
      endsIn: 'Offer ends in',
      units: ['d', 'h', 'min'],
      close: 'Close',
      prices: [
        { name: 'Yearly', price: '[PRICE]', old: '[PRICE]', sub: 'first year · 50% off', badge: '−50%', featured: true },
        { name: 'Lifetime', price: '[PRICE]', old: '[PRICE]', sub: 'pay once, yours forever', badge: '−30%', featured: false },
      ],
    },
  },
};
