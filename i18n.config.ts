import en from './locales/en';
import bg from './locales/bg';

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  detectBrowserLanguage: {
    useCookie: true,
    cookieKey: 'i18n_redirected',
    redirectOn: 'root',
    alwaysRedirect: true,
    fallbackLocale: 'en',
    cookieExpires: 365,
  },
  messages: {
    en,
    bg,
  },
}));
