// src/context/LanguageProvider.jsx
import React, { useState, useEffect } from "react";
import { LanguageContext } from "./LanguageContext";
import { translations } from "../data/translations";

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const savedLang = localStorage.getItem("portfolio_lang");
    if (savedLang === "es" || savedLang === "en") return savedLang;

    const browserLang = navigator.language || navigator.userLanguage || "es";
    return browserLang.toLowerCase().startsWith("es") ? "es" : "en";
  });

  useEffect(() => {
    localStorage.setItem("portfolio_lang", language);
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "es" ? "en" : "es"));
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};