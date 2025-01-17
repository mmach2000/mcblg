import type { CollectionEntry } from 'astro:content';

import { countWords } from '@/utils/word-count.ts';
import { trim, unique } from 'moderndash';

export interface PostMetadata {
  slug: string;
  title: string;
  tags?: string[];
  words: number;
  ctime: Date;
  mtime: Date;
}

/**
 * Get ‘continuum’ label from a slug or href.
 * Pages with the same continuum label are considered to be in the same series,
 * and are linked together by footer navigation.
 *
 * - /notes/example/ → /notes
 * - notes/example → /notes
 * - /series/example → /example
 * - /notes → undefined
 * - / → undefined
 */
export function getContinuum(slugOrHref?: string): `/${string}` | undefined {
  if (slugOrHref === undefined || slugOrHref === null)
    return;
  const slug = trim(slugOrHref, '/');
  const parts = slug.split('/');
  if (parts.length <= 1) {
    return undefined;
  } else if (parts[0] === 'series') {
    return `/${parts[1]}`;
  } else {
    return `/${parts[0]}`;
  }
}

/**
 * Get the top route from a slug or href
 * - /notes/example/ → /notes
 * - notes/example → /notes
 * - /notes → /notes
 * - / → /
 */
export function getTopRoute(slugOrHref?: string): `/${string}` | undefined {
  if (slugOrHref === undefined || slugOrHref === null)
    return;
  const slug = trim(slugOrHref, '/');
  const parts = slug.split('/');
  return `/${parts?.[0] ?? ''}`;
}

/**
 * Get series of a series page
 * - /series/example → example
 * - /series/a/b → a
 * - /notes/example → undefined
 * - /series → undefined
 * - / → undefined
 */
export function getSeries(slugOrHref?: string): string | undefined {
  if (slugOrHref === undefined || slugOrHref === null)
    return;
  const slug = trim(slugOrHref, '/');
  const parts = slug.split('/');
  if (parts.length >= 2 && parts[0] === 'series') {
    return parts[1];
  }
}

/**
 * Get only metadata of a content
 */
export async function getMetadata(content: CollectionEntry<'docs'>): Promise<PostMetadata> {
  return {
    title: content.data.title,
    tags: content.data?.tags,
    ctime: content.data?.ctime ? new Date(content.data.ctime) : new Date(),
    mtime: content.data?.mtime ? new Date(content.data.mtime) : new Date(),
    slug: content.slug,
    words: countWords(content.body),
  };
}

/**
 * Get a tag list
 */
export function getAllTags(contents: CollectionEntry<'docs'>[]) {
  return unique(contents.flatMap(content => content.data.tags ?? []));
}
