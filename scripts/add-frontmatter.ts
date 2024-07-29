import * as fs from 'node:fs';
import { parseArgs } from 'node:util';

import matter from 'gray-matter';
import { formatISO } from 'date-fns';
import { readingTime } from 'reading-time-estimator';

import { CATEGORIES } from '@/constants';

const addingFields = ['created', 'readTime'];

/**
 * Add `created`, `readTime` fields to the front matter of a file.
 * If the file doesn't exist, it is not an MD / MDX file, or already has such fields, do nothing.
 * So, if you want to update some fields, you should remove them first.
 *
 * @param file The file to add the fields to.
 * @param force Whether to force adding the fields even if they already exist.
 */
function addFrontMatter(file: string, force: boolean = false) {
  if (!fs.existsSync(file)
    || !CATEGORIES.some(path => file.includes(`${path}/`))
    || !(file.endsWith('.md') || file.endsWith('.mdx'))) {
    return;
  }

  const content = matter.read(file);

  if (content.data.pageType === 'home') {
    return;
  }

  if (!force && addingFields.every(field => content.data?.[field])) {
    return;
  }

  if (!content.data?.created) {
    content.data.created = formatISO(new Date());
  }

  if (force || !content.data?.readTime) {
    content.data.readTime = readingTime(content.content, 400, 'cn');
    content.data.readTime.text = content.data.readTime.text.replace('小于一', '1 ');
  }

  fs.writeFileSync(file, matter.stringify(content.content, content.data));
}

const { positionals, values } = parseArgs({ strict: false });
const force = values.force;
positionals.forEach(file => addFrontMatter(file, Boolean(force)));
