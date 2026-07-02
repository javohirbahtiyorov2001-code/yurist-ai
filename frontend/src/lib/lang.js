// Global response-language preference (UZ default). Read at request time.
export const LANGS = [
  { value: 'uz', label: "O'zbek", flag: '🇺🇿' },
  { value: 'ru', label: 'Русский', flag: '🇷🇺' },
  { value: 'en', label: 'English', flag: '🇬🇧' },
]

const KEY = 'yurist_lang'
export function getLang() { return localStorage.getItem(KEY) || 'uz' }
export function setLang(l) { localStorage.setItem(KEY, l); window.dispatchEvent(new Event('yurist-lang-change')) }
