import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enTranslation from './locale/enus.json'
import zhchTranslation from './locale/zhch.json'
import zhhkTranslation from './locale/zhhk.json'

const LANGUAGE_STORAGE_KEY = 'selectedLanguage';

// Retrieve the selected language from localStorage or use the default language
const selectedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'zhhk';

// Initialize i18next
i18n.use(initReactI18next).init({
  resources: {
    enus: { translation: enTranslation },
    zhch: { translation: zhchTranslation },
    zhhk: { translation: zhhkTranslation }
  },
  //lng: 'zhhk', // Set the default language
  lng: selectedLanguage,
  fallbackLng: 'zhhk', // Fallback language if translation is missing for the current language
  interpolation: {
    escapeValue: false // Disable escaping of HTML characters
  }
})

export const setLanguage = (language: string) => {
  i18n.changeLanguage(language)
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
}

export default i18n
