import * as fs from 'node:fs';
import { parseArgs } from 'node:util';

import matter from 'gray-matter';
import { formatISO } from 'date-fns';
import { readingTime } from 'reading-time-estimator';

const addingFields = ['created', 'readTime'];

/**
 * Add `created`, `readTime` fields to the front matter of a file.
 * If the file doesn't exist, it is not an MD / MDX file, or already has such fields, do nothing.
 * So, if you want to update some fields, you should remove them first.
 *
 * @param file {string} The file to add the `created` field to.
 */
function addFrontMatter(file: string) {
  if (!fs.existsSync(file) || !(file.endsWith('.md') || file.endsWith('.mdx'))) {
    return;
  }

  const content = matter.read(file);

  if (addingFields.every(field => content.data?.[field])) {
    return;
  }

  if (!content.data?.created) {
    content.data.created = formatISO(new Date());
  }

  if (!content.data?.readTime) {
    content.data.readTime = readingTime(content.content, 400, 'cn');
  }

  fs.writeFileSync(file, matter.stringify(content.content, content.data));
}

const args = parseArgs({ strict: false });
args.positionals.forEach(addFrontMatter);
