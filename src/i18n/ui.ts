export const languages = { pt: 'Português', en: 'English' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'pt';

/** Páginas do site. A chave é a mesma nos dois idiomas; o endereço muda. */
export type PageKey = 'home' | 'pethealthtracker' | 'studio' | 'wallpapers' | 'themes' | 'privacy' | 'support';

/**
 * Endereços públicos. Privacidade e Suporte vão para a App Store e o Google:
 * não mudar depois de cadastrados.
 */
export const routes: Record<Lang, Record<PageKey, string>> = {
  pt: {
    home: '/',
    pethealthtracker: '/pethealthtracker',
    studio: '/estudio',
    wallpapers: '/estudio/wallpapers',
    themes: '/estudio/temas',
    privacy: '/privacidade',
    support: '/suporte',
  },
  en: {
    home: '/en',
    pethealthtracker: '/en/pethealthtracker',
    studio: '/en/studio',
    wallpapers: '/en/studio/wallpapers',
    themes: '/en/studio/themes',
    privacy: '/en/privacy',
    support: '/en/support',
  },
};

/** Textos compartilhados (cabeçalho, rodapé, metadados). Textos de cada página ficam na própria página. */
export const ui = {
  pt: {
    'site.name': 'Toski Labs',
    'site.tagline': 'Laboratório de tecnologia para o ecossistema Apple.',
    'nav.label': 'Principal',
    'nav.projects': 'Projetos',
    'nav.about': 'Sobre',
    'nav.support': 'Suporte',
    'nav.privacy': 'Privacidade',
    'nav.wallpapers': 'Wallpapers',
    'nav.studio': 'Estúdio',
    'settings.button': 'Configurações: tema e idioma',
    'settings.title': 'Configurações',
    'settings.theme': 'Tema',
    'settings.theme.auto': 'Automático',
    'settings.theme.light': 'Claro',
    'settings.theme.dark': 'Escuro',
    'settings.hint.auto': 'Segue o tema do seu aparelho.',
    'settings.hint.light': 'Sempre claro, mesmo à noite.',
    'settings.hint.dark': 'Sempre escuro, mesmo de dia.',
    'settings.language': 'Idioma',
    'settings.saved': 'Suas escolhas ficam salvas neste navegador.',
    'footer.projects': 'Projetos',
    'footer.help': 'Ajuda',
    'footer.place': 'Recife, Brasil',
    'skip': 'Pular para o conteúdo',
    'backToTop': 'Voltar ao topo',
  },
  en: {
    'site.name': 'Toski Labs',
    'site.tagline': 'A technology lab for the Apple ecosystem.',
    'nav.label': 'Main',
    'nav.projects': 'Projects',
    'nav.about': 'About',
    'nav.support': 'Support',
    'nav.privacy': 'Privacy',
    'nav.wallpapers': 'Wallpapers',
    'nav.studio': 'Studio',
    'settings.button': 'Settings: theme and language',
    'settings.title': 'Settings',
    'settings.theme': 'Theme',
    'settings.theme.auto': 'Automatic',
    'settings.theme.light': 'Light',
    'settings.theme.dark': 'Dark',
    'settings.hint.auto': 'Follows your device’s theme.',
    'settings.hint.light': 'Always light, even at night.',
    'settings.hint.dark': 'Always dark, even during the day.',
    'settings.language': 'Language',
    'settings.saved': 'Your choices are saved in this browser.',
    'footer.projects': 'Projects',
    'footer.help': 'Help',
    'footer.place': 'Recife, Brazil',
    'skip': 'Skip to content',
    'backToTop': 'Back to top',
  },
} as const;

export type UiKey = keyof (typeof ui)['pt'];

export function useTranslations(lang: Lang) {
  return (key: UiKey): string => ui[lang][key] ?? ui[defaultLang][key];
}

/** Idioma a partir do locale atual do Astro (Astro.currentLocale). */
export function getLang(locale: string | undefined): Lang {
  return locale === 'en' ? 'en' : 'pt';
}

export function otherLang(lang: Lang): Lang {
  return lang === 'pt' ? 'en' : 'pt';
}

/** Mesma página no outro idioma (usado no botão PT/EN e no hreflang). */
export function alternatePath(page: PageKey, lang: Lang): string {
  return routes[otherLang(lang)][page];
}

/** Atalho para montar links internos: href(lang, 'support') → '/suporte' ou '/en/support'. */
export function href(lang: Lang, page: PageKey, hash?: string): string {
  const path = routes[lang][page];
  return hash ? `${path}#${hash}` : path;
}

/** E-mail de suporte e contato (site, política, App Store e Google). */
export const SUPPORT_EMAIL = 'toskilabs@gmail.com';

/** Chaves do localStorage (tudo fica só no navegador da pessoa; nada vai para servidor). */
export const STORAGE = {
  theme: 'toski-theme', // 'light' | 'dark' (ausente = automático)
  lang: 'toski-lang', // idioma escolhido no menu ou no aviso
  langNotice: 'toski-lang-aviso', // '1' depois que o aviso de idioma foi fechado
} as const;

/**
 * Aviso de idioma do navegador. Cada mensagem fica no idioma de quem lê.
 * es/fr/de/it oferecem o inglês; "other" é o padrão para os demais idiomas.
 */
export const langNotice = {
  es: { lang: 'es', title: 'Aún no hablamos español', body: 'Estamos trabajando para traducir el sitio. Mientras tanto, está disponible en inglés.', go: 'Ver en inglés', stay: 'Seguir en portugués', close: 'Cerrar', region: 'Aviso de idioma' },
  fr: { lang: 'fr', title: 'Pas encore de version française', body: 'Nous travaillons à la traduction du site. En attendant, il est disponible en anglais.', go: 'Voir en anglais', stay: 'Rester en portugais', close: 'Fermer', region: 'Langue' },
  de: { lang: 'de', title: 'Noch keine deutsche Version', body: 'Wir arbeiten an einer Übersetzung. Bis dahin gibt es die Seite auf Englisch.', go: 'Auf Englisch ansehen', stay: 'Auf Portugiesisch bleiben', close: 'Schließen', region: 'Sprache' },
  it: { lang: 'it', title: 'Non c’è ancora la versione italiana', body: 'Stiamo lavorando alla traduzione. Nel frattempo il sito è disponibile in inglese.', go: 'Vedi in inglese', stay: 'Resta in portoghese', close: 'Chiudi', region: 'Lingua' },
  en: { lang: 'en', title: 'This site is also in English', body: 'Your browser is set to English. Want to switch?', go: 'View in English', stay: 'Stay in Portuguese', close: 'Close', region: 'Language' },
  pt: { lang: 'pt-BR', title: 'Este site também está em português', body: 'Seu navegador está em português. Quer trocar?', go: 'Ver em português', stay: 'Continuar em inglês', close: 'Fechar', region: 'Idioma' },
  other: { lang: 'en', title: 'Your language isn’t available yet', body: 'We’re working on more languages. For now, the site is in Portuguese and English.', go: 'View in English', stay: 'Stay in Portuguese', close: 'Close', region: 'Language' },
} as const;
