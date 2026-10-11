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
  /** Preço com desconto. Vazio enquanto a precificação não estiver definida: aí o card mostra só o desconto (badge). */
  price: string;
  /** Preço normal, riscado. Vazio quando não há desconto ou sem preço definido. */
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
  /** Para onde a faixa e o selo levam: a Home do site do app (subdomínio), por idioma. */
  url: Record<Lang, string>;
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
  url: { pt: 'https://pethealth.toski-labs.com.br', en: 'https://pethealth.toski-labs.com.br/en' },
  appStoreUrl: '#',
  copy: {
    pt: {
      tag: 'BLACK FRIDAY',
      bar: '50% no primeiro ano do PetHealthTracker Plus anual.',
      barCta: 'Ver oferta',
      kicker: 'PetHealthTracker Plus · App Store',
      title: 'O maior desconto do ano no PetHealthTracker Plus.',
      lead: 'Pets ilimitados, PDFs e sem anúncios. O anual sai pela metade no primeiro ano e depois renova pelo valor normal.',
      until: 'Só até 30 de novembro, 23:59 (horário de Brasília)',
      sticker: 'no anual',
      seal: 'Plus anual pela metade no primeiro ano. Até 30/11.',
      cta: 'Aproveitar a Black Friday',
      fine: 'Desconto aplicado na própria App Store. Vale de 27 a 30 de novembro para quem nunca assinou o anual e para ex-assinantes. O mensal não tem desconto.',
      endsIn: 'A oferta termina em',
      units: ['d', 'h', 'min'],
      close: 'Fechar',
      prices: [
        // Preços em branco até a monetização ser definida (o card mostra só o desconto).
        { name: 'Anual', price: '', old: '', sub: 'no primeiro ano', badge: '−50%', featured: true },
        { name: 'Vitalício', price: '', old: '', sub: 'pague uma vez, é seu pra sempre', badge: '−30%', featured: false },
      ],
    },
    en: {
      tag: 'BLACK FRIDAY',
      bar: '50% off the first year of PetHealthTracker Plus (yearly).',
      barCta: 'See the offer',
      kicker: 'PetHealthTracker Plus · App Store',
      title: 'The biggest discount of the year on PetHealthTracker Plus.',
      lead: 'Unlimited pets, PDFs and no ads. Yearly is half price for the first year, then renews at the regular price.',
      until: 'Only until November 30, 11:59 PM (Brasília time)',
      sticker: 'yearly plan',
      seal: 'Yearly Plus at half price for the first year. Until Nov 30.',
      cta: 'Get the Black Friday deal',
      fine: 'Discount applied in the App Store. Valid from Nov 27 to 30 for people who never subscribed to the yearly plan and for former subscribers. Monthly has no discount.',
      endsIn: 'Offer ends in',
      units: ['d', 'h', 'min'],
      close: 'Close',
      prices: [
        // Prices left blank until monetization is decided (the card shows only the discount).
        { name: 'Yearly', price: '', old: '', sub: 'for the first year', badge: '−50%', featured: true },
        { name: 'Lifetime', price: '', old: '', sub: 'pay once, yours forever', badge: '−30%', featured: false },
      ],
    },
  },
};
