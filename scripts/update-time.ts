import { writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';

import grayMatter from 'gray-matter';
import { formatISO } from 'date-fns';

const now = formatISO(new Date());

function updateTime(path: string) {
  const file = grayMatter.read(path);

  file.data.mtime = now;
  if (!file.data.ctime) {
    file.data.ctime = now;
  }

  const updated = grayMatter.stringify(file.content, file.data);
  writeFileSync(path, updated);
}

const { positionals } = parseArgs({ strict: false });
positionals.forEach(file => updateTime(file));
