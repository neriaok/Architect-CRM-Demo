// Hebrew Unicode block - used to deterministically pick a response language
// instead of asking a model to infer it, which proved inconsistent in practice.
const HEBREW_CHARACTERS = /[֐-׿]/;

export function isHebrewText(text: string): boolean {
  return HEBREW_CHARACTERS.test(text);
}
