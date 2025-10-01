import en from '@/locales/en.json';
import tr from '@/locales/tr.json';

const dictionaries = {
  en,
  tr,
};

export const getDictionary = (locale: 'tr' | 'en') => {
    return dictionaries[locale] || dictionaries.tr;
}
