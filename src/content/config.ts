import { docsSchema } from '@astrojs/starlight/schema';
import { defineCollection, z } from 'astro:content';

export const collections = {
  docs: defineCollection({
    schema: docsSchema({
      extend: z.object({
        author: z.string().optional(),
        tags: z.string().array().optional(),
        ctime: z.string().optional(),
        mtime: z.string().optional(),
      }),
    }),
  }),
};
