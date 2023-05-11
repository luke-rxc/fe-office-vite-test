import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  kr: {
    translation: {
      'Welcome to React': 'Welcome to React and react-i18next',
    },
  },
  en: {
    translation: {
      'Welcome to React': 'Welcome to React and react-i18next',
    },
  },
  fr: {
    translation: {
      'Welcome to React': 'Bienvenue à React et react-i18next',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'kr',
  fallbackLng: 'kr',
  interpolation: {
    escapeValue: false,
  },
});
