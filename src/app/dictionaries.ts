import 'server-only';

const dictionaries = {
  en: () => import('@/locales/en.json').then(module => module.default),
  tr: () => import('@/locales/tr.json').then(module => module.default),
};

export const getDictionary = (locale: 'tr' | 'en') =>
  dictionaries[locale]();
