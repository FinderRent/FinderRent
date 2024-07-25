import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../locales/en.json";
import he from "../locales/he.json";
import ru from "../locales/ru.json";
import ar from "../locales/ar.json";

export const languageResources = {
  en: { translation: en },
  he: { translation: he },
  ru: { translation: ru },
  ar: { translation: ar },
};

i18next.use(initReactI18next).init({
  compatibilityJSON: "v3",
  resources: languageResources,
  lng: "en", // Default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
