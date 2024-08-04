import * as fs from 'node:fs';
import * as path from 'node:path';

import matter from 'gray-matter';

const POSTS_DIR = path.join(__dirname, '..', 'content/posts');
const NOTES_DIR = path.join(__dirname, '..', 'content/notes');
const SERIES_DIR = path.join(__dirname, '..', 'content/series');

const FILE_TYPE = /\.(?:md|mdx)$/;

const CMP_FNS = {
  created: (a: { created: Date }, b: { created: Date }) => b.created.getTime() - a.created.getTime(),
  name: (a: { file: string }, b: { file: string }) => a.file.localeCompare(b.file),
};

function collectDir(dir: string, orderBy: 'created' | 'name' = 'created') {
  return fs.readdirSync(dir)
    .filter(file => FILE_TYPE.test(file))
    .map((file) => {
      const content = matter.read(path.join(dir, file));
      return { file, created: new Date(content.data.created) ?? new Date() };
    })
    .sort(CMP_FNS[orderBy])
    .map(({ file }) => file);
}

// for content/posts and content/notes, collect all .md and .mdx files,
// sort them by created timestamp, and list them in _meta.json.
// for content/series, find all dir containing .md(x) files,
// sort them by name, and list them in _meta.json.
function main() {
  const posts = collectDir(POSTS_DIR);
  const notes = collectDir(NOTES_DIR);

  fs.writeFileSync(path.join(POSTS_DIR, '_meta.json'), JSON.stringify(posts, null, 2));
  fs.writeFileSync(path.join(NOTES_DIR, '_meta.json'), JSON.stringify(notes, null, 2));

  const seriesDirs = fs.readdirSync(SERIES_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory()
    && fs.readdirSync(path.join(SERIES_DIR, dirent.name)).some(file => FILE_TYPE.test(file)));

  for (const seriesDir of seriesDirs) {
    const series = collectDir(path.join(SERIES_DIR, seriesDir.name), 'name');
    fs.writeFileSync(path.join(SERIES_DIR, seriesDir.name, '_meta.json'), JSON.stringify(series, null, 2));
  }
}

main();
