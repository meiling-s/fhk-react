import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locale/enus.json'
import zhchTranslation from './locale/zhch.json';
import zhhkTranslation from './locale/zhhk.json';



// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      enus: { translation: enTranslation },
      zhch: { translation: zhchTranslation },
      zhhk: { translation: zhhkTranslation },
    },
    lng: 'zhhk', // Set the default language
    fallbackLng: 'zhhk', // Fallback language if translation is missing for the current language
    interpolation: {
      escapeValue: false, // Disable escaping of HTML characters
    },
  });

export default i18n;


