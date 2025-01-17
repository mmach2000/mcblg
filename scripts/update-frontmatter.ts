import { writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';

import { formatISO } from 'date-fns';
import grayMatter from 'gray-matter';
import { trimStart } from 'moderndash';

const now = formatISO(new Date());

function updateFrontmatter(path: string) {
  const file = grayMatter.read(path);

  file.data.mtime = now;
  if (!file.data.ctime) {
    file.data.ctime = now;
  }

  if (!file.data.license) {
    file.data.license = 'CC0-1.0';
  }

  const updated = grayMatter.stringify(trimStart(file.content, '\n'), file.data);
  writeFileSync(path, updated);
}

const { positionals } = parseArgs({ strict: false });
positionals.forEach(file => updateFrontmatter(file));
