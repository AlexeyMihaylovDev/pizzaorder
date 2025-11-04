import { he } from './he';

export type Locale = 'he' | 'en';
export const locales: Locale[] = ['he', 'en'];

export const translations = {
  he,
  // en можно добавить позже
  en: {} as typeof he,
};

export const useTranslation = (locale: Locale = 'he') => {
  return translations[locale] || translations.he;
};

