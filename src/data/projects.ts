import type { Lang, PageKey } from '../i18n/ui';

/** Projetos da Toski Labs. Um projeto novo entra aqui e aparece na Home. */
export interface Project {
  name: string;
  /** Página do projeto no site (em src/i18n/ui.ts › routes). */
  page: PageKey;
  status: Record<Lang, string>;
  platform: Record<Lang, string>;
  description: Record<Lang, string>;
  tags: Record<Lang, string[]>;
}

export const projects: Project[] = [
  {
    name: 'PetHealthTracker',
    page: 'pethealthtracker',
    status: { pt: 'Em desenvolvimento', en: 'In development' },
    platform: { pt: 'iPhone · iOS 18+', en: 'iPhone · iOS 18+' },
    description: {
      pt: 'Vacinas, remédios, banho, tosa e consultas do seu pet num lugar só, com lembretes na hora certa.',
      en: 'Your pet’s vaccines, medicines, baths, grooming and vet visits in one place, with reminders right on time.',
    },
    tags: {
      pt: ['Cachorro, gato e outros', 'Calendário', 'Tema claro e escuro', 'Português e inglês'],
      en: ['Dogs, cats and more', 'Calendar', 'Light and dark', 'English and Portuguese'],
    },
  },
];
