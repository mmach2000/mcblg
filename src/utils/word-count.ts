const REGEX_SPACE = /\s+/g;
const REGEX_EXCLUDE = /<OriginalText>.+?<\/OriginalText>/g;
const REGEX_WORD = /[\p{Ll}\p{Lu}\p{Lt}\p{Lo}\p{Nd}]+/gu;

export function countWords(text: string): number {
  return text
    .replace(REGEX_SPACE, ' ')
    .replace(REGEX_EXCLUDE, '')
    .replace(REGEX_WORD, '好')
    .replace(REGEX_SPACE, '')
    .length;
}
