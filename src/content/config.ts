import { SUPPORT_LICENSES } from '@/utils/constants.ts';
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
        license: z.enum(SUPPORT_LICENSES).optional(),
        from: z.object({
          fu: z.boolean().optional(),
          title: z.string().optional(),
          url: z.string().optional(),
        }).optional(),
      }),
    }),
  }),
};
