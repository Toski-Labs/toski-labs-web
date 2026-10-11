import type { Lang } from '../i18n/ui';

/** Projetos da Toski Labs. Um projeto novo entra aqui e aparece na Home e em Projetos. Cada um tem o próprio site, num subdomínio. */
export type ProductId = 'pethealth' | 'koti';

export interface Feature {
  /** Caminho do desenho (viewBox 24, traço) do canvas aprovado. */
  icon: string;
  title: string;
  body: string;
}

export interface Project {
  id: ProductId;
  name: string;
  host: string;
  /** Site, privacidade e suporte do app, por idioma. */
  urls: Record<Lang, { site: string; privacy: string; support: string }>;
  status: Record<Lang, string>;
  platform: Record<Lang, string>;
  tagline: Record<Lang, string>;
  description: Record<Lang, string>;
  tags: Record<Lang, string[]>;
  /** Página de Projetos. */
  what: Record<Lang, string>;
  who: Record<Lang, string>;
  plans: Record<Lang, string>;
  features: Record<Lang, Feature[]>;
  /** Descrição da tela no celular (aria-label). */
  screenLabel: Record<Lang, string>;
}

const ICONS = {
  list: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01',
  cal: 'M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5ZM4 9.5h16M8.5 2.5v3M15.5 2.5v3',
  heart: 'M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z',
  doc: 'M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM14 3v5h5M9 13h6M9 17h4',
  cart: 'M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 8H6.2M10 20a1 1 0 1 0 0-.01M17 20a1 1 0 1 0 0-.01',
  repeat: 'M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3',
  coin: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18ZM15 9.5c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .9-3 2.2 0 3 6 1.6 6 4.6 0 1.3-1.3 2.2-3 2.2-1.4 0-2.6-.6-3-1.6M12 6v2M12 16v2',
  scale: 'M12 3v18M7 21h10M5 7h14M5 7l-3 7a3 3 0 0 0 6 0ZM19 7l-3 7a3 3 0 0 0 6 0Z',
} as const;

const features = (list: [keyof typeof ICONS, string, string][]): Feature[] => list.map(([i, title, body]) => ({ icon: ICONS[i], title, body }));

export const projects: Project[] = [
  {
    id: 'pethealth',
    name: 'PetHealthTracker',
    host: 'pethealth.toski-labs.com.br',
    urls: {
      pt: { site: 'https://pethealth.toski-labs.com.br', privacy: 'https://pethealth.toski-labs.com.br/privacidade', support: 'https://pethealth.toski-labs.com.br/suporte' },
      en: { site: 'https://pethealth.toski-labs.com.br/en', privacy: 'https://pethealth.toski-labs.com.br/en/privacy', support: 'https://pethealth.toski-labs.com.br/en/support' },
    },
    status: { pt: 'Em desenvolvimento', en: 'In development' },
    platform: { pt: 'iPhone · iOS 18+', en: 'iPhone · iOS 18+' },
    tagline: {
      pt: 'Vacinas, remédios e lembretes do seu pet, tudo num lugar só.',
      en: 'Your pet’s vaccines, medicines and reminders, all in one place.',
    },
    description: {
      pt: 'Calendário, histórico de saúde, lembretes que repetem do jeito da sua rotina e a carteirinha em PDF para o veterinário.',
      en: 'A calendar, a health history, reminders that repeat the way your routine does and a vaccine card PDF for the vet.',
    },
    tags: {
      pt: ['Cachorro, gato e outros', 'Calendário', 'Carteirinha em PDF', 'Português e inglês'],
      en: ['Dogs, cats and more', 'Calendar', 'Vaccine card PDF', 'English and Portuguese'],
    },
    what: {
      pt: 'Um app para iPhone que mostra o que fazer agora pelo seu pet. Vacinas, remédios, banho, tosa e consultas ficam no mesmo lugar, com lembretes que repetem do jeito da sua rotina e um histórico de saúde pronto para mostrar ao veterinário.',
      en: 'An iPhone app that shows what your pet needs right now. Vaccines, medicines, baths, grooming and vet visits live in one place, with reminders that repeat the way your routine does and a health history ready to show the vet.',
    },
    who: {
      pt: 'quem cuida de um ou de vários pets e quer parar de anotar em papel, no bloco de notas ou em planilha.',
      en: 'anyone looking after one pet or many who wants to stop keeping notes on paper, in a notes app or in a spreadsheet.',
    },
    plans: {
      pt: 'Grátis para 1 pet. Plus com pets ilimitados, PDF e calendários do iPhone e do Google; 7 dias de teste, sem cartão.',
      en: 'Free for 1 pet. Plus adds unlimited pets, PDFs and iPhone and Google calendars; 7-day trial, no card needed.',
    },
    features: {
      pt: features([
        ['list', 'O que fazer agora', 'Atrasados, hoje e próximos dias, de todos os pets ou de um só.'],
        ['cal', 'Calendário', 'Mês ou lista, com filtros por pet e por tipo.'],
        ['heart', 'Perfil de saúde', 'Vacinas, remédios, consultas, peso e contatos de cada pet.'],
        ['doc', 'Carteirinha em PDF', 'Para o veterinário, a creche ou o hotelzinho, direto do iPhone.'],
      ]),
      en: features([
        ['list', 'What to do now', 'Overdue, today and upcoming, for all your pets or just one.'],
        ['cal', 'Calendar', 'Month or list, filtered by pet and type.'],
        ['heart', 'Health profile', 'Each pet’s vaccines, medicines, vet visits, weight and contacts.'],
        ['doc', 'Vaccine card PDF', 'For the vet, daycare or pet hotel, straight from your iPhone.'],
      ]),
    },
    screenLabel: {
      pt: 'Calendário do PetHealthTracker: o mês com as bolinhas de cada pet e os cuidados do dia',
      en: 'PetHealthTracker calendar (the screen is in Portuguese): the month with each pet’s dots and the day’s care items',
    },
  },
  {
    id: 'koti',
    name: 'Koti',
    host: 'koti.toski-labs.com.br',
    urls: {
      pt: { site: 'https://koti.toski-labs.com.br', privacy: 'https://koti.toski-labs.com.br/privacidade', support: 'https://koti.toski-labs.com.br/suporte' },
      en: { site: 'https://koti.toski-labs.com.br/en', privacy: 'https://koti.toski-labs.com.br/en/privacy', support: 'https://koti.toski-labs.com.br/en/support' },
    },
    status: { pt: 'Em desenvolvimento', en: 'In development' },
    platform: { pt: 'iPhone · iOS 18+ · navegador', en: 'iPhone · iOS 18+ · browser' },
    tagline: { pt: 'Nossa casa, juntos.', en: 'Our home, together.' },
    description: {
      pt: 'O app para casal ou quem divide casa organizar listas, tarefas e contas. O que um marca, o outro vê na hora.',
      en: 'The app for couples and housemates to share lists, chores and bills. What one checks off, the other sees right away.',
    },
    tags: {
      pt: ['Lista de mercado', 'Tarefas com rodízio', 'Contas divididas', 'Português e inglês'],
      en: ['Grocery list', 'Chore rotation', 'Split bills', 'English and Portuguese'],
    },
    what: {
      pt: 'Um app para organizar a casa a dois ou com quem mora junto. A lista de mercado, as tarefas e as contas ficam num lugar só, e o que um marca o outro vê na hora.',
      en: 'An app for running a home together, as a couple or with housemates. The grocery list, chores and bills live in one place, and what one checks off, the other sees right away.',
    },
    who: {
      pt: 'casais e quem divide casa. Quem não tem iPhone entra pelo navegador, no Android ou no computador, por convite.',
      en: 'couples and housemates. Anyone without an iPhone joins from the browser, on Android or a computer, by invite.',
    },
    plans: {
      pt: 'Grátis para um casal, com o Koti inteiro. Plus para a casa que cresce: uma assinatura vale para todo mundo.',
      en: 'Free for a couple, with all of Koti. Plus for a growing household: one subscription covers everyone.',
    },
    features: {
      pt: features([
        ['cart', 'Lista de mercado', 'Quem vai compra; quem ficou em casa adiciona o que faltou, ao vivo.'],
        ['repeat', 'Tarefas com rodízio', 'Lixo, louça e plantas se repetem sozinhos e o Koti sabe de quem é a vez.'],
        ['coin', 'Contas com boleto e Pix', 'Cada conta guarda o código, lembra o vencimento e avisa quando alguém paga.'],
        ['scale', 'Dividir e acertar no Pix', 'Igual, por porcentagem ou valor fixo; o Koti mostra quem deve quanto.'],
      ]),
      en: features([
        ['cart', 'Grocery list', 'Whoever goes shops; whoever stays home adds what’s missing, live.'],
        ['repeat', 'Chore rotation', 'Trash, dishes and plants repeat on their own, and Koti knows whose turn it is.'],
        ['coin', 'Bills with boleto and Pix', 'Each bill keeps the code, reminds you of the due date and tells the home when someone pays.'],
        ['scale', 'Split and settle up', 'Evenly, by percentage or fixed amount; Koti shows who owes what.'],
      ]),
    },
    screenLabel: {
      pt: 'Aba Hoje do Koti: João no mercado, o que é para você hoje, as listas em andamento e a atividade da casa',
      en: 'Koti Today tab: João at the store, what’s on you today, lists in progress and home activity',
    },
  },
];

/** Textos da tela Hoje do Koti (componente KotiScreen). Estático e decorativo. */
export const kotiScreen = {
  pt: {
    home: 'Casa da Ana e João', title: 'Hoje', date: 'sexta, 9 de outubro',
    nowLabel: 'Agora', nowTitle: 'João está no Atacadão', nowSub: 'Compra do mês · 8 de 15', nowCta: 'Pedir mais alguma coisa',
    forYou: 'Pra você · 3', swipe: 'deslize para ver mais',
    task: { tag: 'Agenda · Tarefa', title: 'Limpar o banheiro', sub: 'Era ontem · sua vez no rodízio', ok: 'Feito', no: 'Hoje não consigo' },
    bill: { tag: 'Agenda · Conta', title: 'Luz · R$ 180', sub: 'Vence domingo · você paga · R$ 90 cada' },
    also: 'Também hoje: Levar o lixo, vez do João',
    lists: 'Listas em andamento', allLists: 'Todas as listas',
    cards: [
      { name: 'Compra do mês', sub: '8 de 15 · João no mercado', pct: 53, due: 'até 31 out', urgent: false },
      { name: 'Farmácia', sub: '1 de 4 · desde terça', pct: 25, due: 'vence amanhã', urgent: true },
    ],
    activity: 'Atividade da casa', activitySub: 'O que cada um fez, mesmo com o app fechado',
    feed: [
      { who: 'J', text: 'João marcou 5 itens', from: 'Lista · Compra do mês', when: 'agora', kind: 'list' },
      { who: 'J', text: 'João adicionou Pão de forma', from: 'Lista · Compra do mês', when: '10 min', kind: 'list' },
      { who: 'A', text: 'Você adicionou Dipirona', from: 'Lista · Farmácia', when: '1 h', kind: 'list' },
    ],
    tabs: ['Hoje', 'Listas', 'Agenda', 'Casa'],
  },
  en: {
    home: 'Ana and João’s home', title: 'Today', date: 'Friday, October 9',
    nowLabel: 'Now', nowTitle: 'João is at the store', nowSub: 'Monthly shop · 8 of 15', nowCta: 'Ask for something else',
    forYou: 'For you · 3', swipe: 'swipe for more',
    task: { tag: 'Calendar · Chore', title: 'Clean the bathroom', sub: 'Was yesterday · your turn in the rotation', ok: 'Done', no: 'Can’t today' },
    bill: { tag: 'Calendar · Bill', title: 'Power · R$ 180', sub: 'Due Sunday · you pay · R$ 90 each' },
    also: 'Also today: Take out the trash, João’s turn',
    lists: 'Lists in progress', allLists: 'All lists',
    cards: [
      { name: 'Monthly shop', sub: '8 of 15 · João at the store', pct: 53, due: 'by Oct 31', urgent: false },
      { name: 'Pharmacy', sub: '1 of 4 · since Tuesday', pct: 25, due: 'due tomorrow', urgent: true },
    ],
    activity: 'Home activity', activitySub: 'What everyone did, even with the app closed',
    feed: [
      { who: 'J', text: 'João checked off 5 items', from: 'List · Monthly shop', when: 'now', kind: 'list' },
      { who: 'J', text: 'João added Bread', from: 'List · Monthly shop', when: '10 min', kind: 'list' },
      { who: 'A', text: 'You added Painkillers', from: 'List · Pharmacy', when: '1 h', kind: 'list' },
    ],
    tabs: ['Today', 'Lists', 'Calendar', 'Home'],
  },
} as const;
