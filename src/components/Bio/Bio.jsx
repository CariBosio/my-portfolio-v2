// src/components/Bio/Bio.jsx
import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../../context/useLanguage";
import "./Bio.scss";

gsap.registerPlugin(ScrollTrigger);

const Bio = () => {
  const { t, language } = useLanguage();
  const containerRef = useRef(null);
  const quoteRef = useRef(null);
  const contentRef = useRef(null);

  const [activeMode, setActiveMode] = useState("dev");
  const hasAnimatedOnce = useRef(false);

  const modeColors = {
    dev: "#fff1f1",
    psych: "#f83b3b",
  };

  const currentBio = t.bio[activeMode];
  const currentColor = modeColors[activeMode];

  // --- 1. ANIMACIÓN "BLOCK REVEAL" DE LAS LÍNEAS (Corre una sola vez) ---
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const line1 = containerRef.current.querySelector(".line-1-text");
      const line2 = containerRef.current.querySelector(".line-2-text");
      const mask1 = containerRef.current.querySelector(".mask-1");
      const mask2 = containerRef.current.querySelector(".mask-2");

      // Estado inicial invisible
      gsap.set([line1, line2], { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: quoteRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
          onComplete: () => {
            hasAnimatedOnce.current = true;
          },
        },
      });

      // Animación Línea 1
      tl.fromTo(
        mask1,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 0.8, ease: "power3.inOut" }
      )
        .set(line1, { opacity: 1 })
        .to(mask1, {
          scaleX: 0,
          transformOrigin: "right center",
          duration: 0.8,
          ease: "power3.inOut",
        });

      // Animación Línea 2 (con ligero retraso de entrada)
      tl.fromTo(
        mask2,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 0.8, ease: "power3.inOut" },
        0.25
      )
        .set(line2, { opacity: 1 })
        .to(mask2, {
          scaleX: 0,
          transformOrigin: "right center",
          duration: 0.8,
          ease: "power3.inOut",
        });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // --- 2. TRANSICIÓN SUAVE AL CAMBIAR DE IDIOMA ---
  useEffect(() => {
    if (!hasAnimatedOnce.current) return;

    gsap.fromTo(
      quoteRef.current,
      { opacity: 0, y: 8, filter: "blur(4px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.45, ease: "power2.out" }
    );
  }, [language]);

  // --- 3. ANIMACIÓN AL CAMBIAR TABS (DEV / PSYCH) ---
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { autoAlpha: 0, y: 15 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [activeMode]);

  return (
    <section
      id="about"
      className={`bio-section ${activeMode}`}
      ref={containerRef}
    >
      <div className="bio-header">
        <h2 className="quote-container" ref={quoteRef}>
          {/* Línea 1 con su wrapper y máscara declarados en JSX */}
          <div className="line-wrapper">
            <span className="line-1-text">
              {language === "es" ? (
                <>
                  La <span className="highlight">tecnología</span> pone la{" "}
                  <span className="highlight">estructura</span>.
                </>
              ) : (
                <>
                  <span className="highlight">Technology</span> sets the{" "}
                  <span className="highlight">structure</span>.
                </>
              )}
            </span>
            <div className="line-mask mask-1"></div>
          </div>

          {/* Línea 2 con su wrapper y máscara declarados en JSX */}
          <div className="line-wrapper">
            <span className="line-2-text">
              {language === "es" ? (
                <>
                  La <span className="highlight">psicología</span> pone el{" "}
                  <span className="highlight">sentido</span>.
                </>
              ) : (
                <>
                  <span className="highlight">Psychology</span> gives the{" "}
                  <span className="highlight">meaning</span>.
                </>
              )}
            </span>
            <div className="line-mask mask-2"></div>
          </div>
        </h2>
      </div>

      {/* SWITCH */}
      <div className="switch-wrapper">
        <div className="switch-track">
          <button
            className={`switch-btn ${activeMode === "dev" ? "active" : ""}`}
            onClick={() => setActiveMode("dev")}
          >
            {t.bio.tabDev}
          </button>
          <button
            className={`switch-btn ${activeMode === "psych" ? "active" : ""}`}
            onClick={() => setActiveMode("psych")}
          >
            {t.bio.tabPsych}
          </button>
          <div className="switch-glider"></div>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="bio-content" ref={contentRef}>
        <div className="bio-card">
          <div className="card-header">
            <h3 className="card-title" style={{ color: currentColor }}>
              {currentBio.title}
            </h3>
            <span className="card-subtitle">
              {activeMode === "dev" ? (
                <span>&lt; {currentBio.subtitle} &gt;</span>
              ) : (
                <span>&#936; {currentBio.subtitle}</span>
              )}
            </span>
          </div>
          <p className="card-text">{currentBio.text}</p>
          <div className="tags-container">
            {currentBio.tags.map((tag, index) => (
              <span
                key={index}
                className="tag"
                style={{
                  borderColor: currentColor,
                  color: currentColor,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Bio;