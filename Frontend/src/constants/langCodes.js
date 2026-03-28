/**
 * Maps UI labels (see App.jsx LANGUAGES) to `lang` codes for POST /api/translate/.
 * Align these with your upstream translation API; `en-gaa` matches Backend/rest.http.
 */
export const LANG_CODE_BY_LABEL = Object.freeze({
  English: 'en',
  Twi: 'en-tw',
  Ga: 'en-gaa',
  Ewe: 'en-ee',
  Fante: 'en-fat',
  Dagbani: 'en-dag',
  Gurene: 'en-gur',
  Yoruba: 'en-yo',
  Kikuyu: 'en-ki',
  Luo: 'en-luo',
  Kimeru: 'en-mer',
})

export function getLangCodeForTarget(displayLabel) {
  return LANG_CODE_BY_LABEL[displayLabel] ?? 'en'
}
