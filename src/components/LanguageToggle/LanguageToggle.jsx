// src/components/LanguageToggle/LanguageToggle.jsx
import React from "react";
import { useLanguage } from "../../context/useLanguage";
import "./LanguageToggle.scss";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="lang-toggle" role="group" aria-label="Language selector">
      <button
        type="button"
        className={`lang-btn ${language === "es" ? "active" : ""}`}
        onClick={() => setLanguage("es")}
      >
        ES
      </button>
      <span className="lang-divider">/</span>
      <button
        type="button"
        className={`lang-btn ${language === "en" ? "active" : ""}`}
        onClick={() => setLanguage("en")}
      >
        EN
      </button>
    </div>
  );
}