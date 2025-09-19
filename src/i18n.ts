import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Main translations
import en from "./locales/en/translations.json";
import no from "./locales/no/translations.json";

// About page translations
import enAbout from "./locales/en/about_translations.json";
import noAbout from "./locales/no/about_translations.json";

// Privacy page translations
import enPrivacy from "./locales/en/privacy_translations.json";
import noPrivacy from "./locales/no/privacy_translations.json";

// Terms page translations
import enTerms from "./locales/en/terms_translations.json";
import noTerms from "./locales/no/terms_translations.json";

// Support page translations
import enSupport from "./locales/en/support_translations.json";
import noSupport from "./locales/no/support_translations.json";

// Feedback page translations
import enFeedback from "./locales/en/feedback_translations.json";
import noFeedback from "./locales/no/feedback_translations.json";

// Bookmark page translations
import enBookmark from "./locales/en/bookmark_translations.json";
import noBookmark from "./locales/no/bookmark_translations.json";

// Admin translations
import enAdmin from "./locales/en/admin_translations.json";
import noAdmin from "./locales/no/admin_translations.json";

const resources = {
  en: {
    translation: {
      ...en,
      ...enAbout,
      ...enPrivacy,
      ...enTerms,
      ...enSupport,
      ...enFeedback,
      ...enAdmin
    },
    bookmark_translations: enBookmark,
  },
  no: {
    translation: {
      ...no,
      ...noAbout,
      ...noPrivacy,
      ...noTerms,
      ...noSupport,
      ...noFeedback,
      ...noAdmin,
    },
    bookmark_translations: noBookmark,
  },
};

// GDPR Compliance: Don't access localStorage on module load
// Instead, initialize with default language and update later when consent is given
i18n.use(initReactI18next).init({
  resources,
  lng: "no", // Default to Norwegian, will be updated after consent check
  fallbackLng: "en",

  ns: ["translation", "bookmark_translations"],
  defaultNS: "translation",

  keySeparator: ".",

  interpolation: {
    escapeValue: false,
  },
});

// Function to update language after consent is checked
export const updateLanguageFromStorage = (consentStorage: any) => {
  const savedLanguage = consentStorage.functional.getItem("blizbi-language") || "no";
  i18n.changeLanguage(savedLanguage);
};

export default i18n;
