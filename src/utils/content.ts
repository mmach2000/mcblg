import fs from 'node:fs/promises';
import type { CollectionEntry } from 'astro:content';

import wc from 'words-count';
import { trim, unique } from 'moderndash';

/**
 * get category from a slug or href
 * - /notes/example/ → notes
 * - notes/example → notes
 * - /notes → undefined
 */
export function getCategory(slugOrHref?: string): `/${string}` | undefined {
  if (!slugOrHref)
    return;
  const slug = trim(slugOrHref, '/');
  const parts = slug.split('/');
  return parts.length > 1 ? `/${parts[0]}` : '/';
}

/**
 * get only metadata of a content
 */
export async function getMetadata(content: CollectionEntry<'docs'>) {
  const path = `src/content/docs/${content.id}`;
  return {
    title: content.data.title,
    tags: content.data?.tags,
    mtime: (await fs.stat(path)).mtime,
    slug: content.slug,
    // @ts-expect-error - mixed default export and named export
    words: wc.default(content.body),
    raw: content,
  };
}

/**
 * get a tag list
 */
export function getAllTags(contents: CollectionEntry<'docs'>[]) {
  return unique(contents.flatMap(content => content.data.tags ?? []));
}
