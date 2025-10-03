import styles from "./languageSettings.module.css";
import { useState, useEffect } from "react";
import CountryFlag from "react-country-flag";

// Supported languages (code, name, flag)
const languages = [
  { code: "en", name: "English", countryCode: "GB" },
  { code: "es", name: "Español", countryCode: "ES" },
  { code: "fr", name: "Français", countryCode: "FR" },
  { code: "de", name: "Deutsch", countryCode: "DE" },
  { code: "pt", name: "Português", countryCode: "PT" },
  { code: "it", name: "Italiano", countryCode: "IT" },
  { code: "zh", name: "中文", countryCode: "CN" },
  { code: "ar", name: "العربية", countryCode: "SA" },
  { code: "ru", name: "Русский", countryCode: "RU" },
  { code: "ja", name: "日本語", countryCode: "JP" },
];

// Preview translations
const previewText = {
  en: "Welcome to My Pocket Plan",
  es: "Bienvenido a My Pocket Plan",
  fr: "Bienvenue sur My Pocket Plan",
  de: "Willkommen bei My Pocket Plan",
  pt: "Bem-vindo ao My Pocket Plan",
  it: "Benvenuto su My Pocket Plan",
  zh: "欢迎来到 My Pocket Plan",
  ar: "مرحبًا بك في My Pocket Plan",
  ru: "Добро пожаловать в My Pocket Plan",
  ja: "My Pocket Plan へようこそ",
};

export default function LanguageSettings() {
  // Detect browser language on first load
  const browserLang = navigator.language?.slice(0, 2) || "en";
  const defaultLang =
    languages.find((l) => l.code === browserLang) || languages[0];
  // Selected language
  const [selected, setSelected] = useState(defaultLang);

  // Reset to default (browser or English)
  function handleReset() {
    setSelected(defaultLang);
  }

  // Save changes (UI only)
  function handleSave() {
    alert("Language settings saved! (UI only)");
  }

  // If browser language changes, update default
  useEffect(() => {
    setSelected(defaultLang);
    // eslint-disable-next-line
  }, []);

  return (
    <div className={styles.languageSettings}>
      {/* Header with sticker */}
      <div className={styles.headerRow}>
        <h2 className={styles.headerTitle}>Language Settings</h2>
        <span className={styles.sticker}>🌍</span>
      </div>
      <p className={styles.description}>Choose your preferred app language</p>

      {/* Language Selector Section */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Select Language</h3>
        <div className={styles.dropdownList}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={
                lang.code === selected.code
                  ? `${styles.dropdownItem} ${styles.selected}`
                  : styles.dropdownItem
              }
              onClick={() => setSelected(lang)}
            >
              <CountryFlag
                countryCode={lang.countryCode}
                svg
                style={{ width: "1.5em", height: "1.5em" }}
              />
              <span className={styles.langName}>{lang.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Preview Section */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Preview</h3>
        <div className={styles.previewCard}>
          <span className={styles.previewText}>
            {previewText[selected.code]}
          </span>
        </div>
      </section>

      {/* Save / Reset Section */}
      <section className={styles.section}>
        <div className={styles.buttonRow}>
          <button className={styles.saveBtn} onClick={handleSave}>
            Save Changes
          </button>
          <button className={styles.resetBtn} onClick={handleReset}>
            Reset to Default
          </button>
        </div>
      </section>
    </div>
  );
}
