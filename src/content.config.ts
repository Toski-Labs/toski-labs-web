import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Textos legais em Markdown, um arquivo por idioma: legal/pt/privacidade.md, legal/en/privacy.md. */
const legal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/legal' }),
  schema: z.object({
    title: z.string(),
    lead: z.string(),
    /** Data da última atualização, como aparece na página. */
    updated: z.string(),
  }),
});

export const collections = { legal };
