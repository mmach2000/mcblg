const fs = require('node:fs');
const util = require('node:util');

const matter = require('gray-matter');
const dateFns = require('date-fns');

/**
 * Add a `created` field to the frontmatter of all MD / MDX files.
 * If the file doesn't exist, it is not an MD / MDX file, or already has a `created` field, do nothing.
 *
 * @param file {string} The file to add the `created` field to.
 */
function addCreatedToFrontmatter(file) {
  if (!fs.existsSync(file) || !(file.endsWith('.md') || file.endsWith('.mdx'))) {
    return;
  }

  const content = matter.read(file);
  if (content.data.created) {
    return;
  }

  content.data.created = dateFns.formatISO(new Date());
  fs.writeFileSync(file, matter.stringify(content.content, content.data));
}

const args = util.parseArgs({ strict: false });
args.positionals.forEach(addCreatedToFrontmatter);
