import fs from 'node:fs/promises';
import type { CollectionEntry } from 'astro:content';

import wc from 'words-count';
import { trim, unique } from 'moderndash';
import { IS_DEV } from '@/utils/env.ts';

/**
 * get category from a slug or href
 * - /notes/example/ → /notes
 * - notes/example → /notes
 * - /notes → /
 * - / → /
 */
export function getCategory(slugOrHref?: string): `/${string}` | undefined {
  if (slugOrHref === undefined || slugOrHref === null)
    return;
  const slug = trim(slugOrHref, '/');
  const parts = slug.split('/');
  return parts.length > 1 ? `/${parts[0]}` : '/';
}

/**
 * get category from a slug or href
 * - /notes/example/ → /notes
 * - notes/example → /notes
 * - /notes → /notes
 * - / → /
 */
export function getLabel(slugOrHref?: string): `/${string}` | undefined {
  if (slugOrHref === undefined || slugOrHref === null)
    return;
  const slug = trim(slugOrHref, '/');
  const parts = slug.split('/');
  return parts.length > 1 ? `/${parts[0]}` : `/${slug}`;
}

/**
 * get only metadata of a content
 */
export async function getMetadata(content: CollectionEntry<'docs'>) {
  const path = `src/content/docs/${content.id}`;
  const ret = {
    title: content.data.title,
    tags: content.data?.tags,
    mtime: (await fs.stat(path)).mtime,
    slug: content.slug,
    // @ts-expect-error - mixed default export and named export
    words: wc.default(content.body),
  };
  if (IS_DEV) {
    type DevRet = typeof ret & { raw: typeof content };
    (ret as DevRet).raw = content;
  }
  return ret;
}

/**
 * get a tag list
 */
export function getAllTags(contents: CollectionEntry<'docs'>[]) {
  return unique(contents.flatMap(content => content.data.tags ?? []));
}
