import React, { useLayoutEffect, useRef, useCallback, useEffect } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";
import { useLanguage } from "../../context/useLanguage";
import "./Hero.scss";

gsap.registerPlugin(SplitText);

const Hero = ({ startAnimation }) => {
  const { t, language } = useLanguage();

  const comp = useRef(null);
  const imageRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  const introTimeline = useRef(null);
  const hasAnimatedOnce = useRef(false);

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesConfig = {
    fullScreen: { enable: false },
    background: { color: { value: "transparent" } },
    fpsLimit: 120,
    interactivity: {
      events: { onHover: { enable: true, mode: "grab" }, resize: true },
      modes: { grab: { distance: 200, links: { opacity: 0.5 } } },
    },
    particles: {
      color: { value: ["#fff1f1", "#fff1f1", "#fff1f1", "#f83b3b"] },
      links: {
        color: "#fff1f1",
        distance: 150,
        enable: true,
        opacity: 0.15,
        width: 1,
      },
      move: {
        enable: true,
        speed: 0.8,
        direction: "none",
        random: false,
        straight: false,
        outModes: { default: "bounce" },
      },
      number: { density: { enable: true, area: 800 }, value: 80 },
      opacity: {
        value: 0.5,
        anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false },
      },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  };

  // 1. ANIMACIÓN INICIAL DE ENTRADA (Corre una única vez tras el Splash)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      const splitTitle = new SplitText(titleRef.current, { type: "chars" });
      const splitSubtitle = new SplitText(subtitleRef.current, { type: "words" });

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
        onComplete: () => {
          hasAnimatedOnce.current = true;
          // Limpiamos los tags de SplitText para dejar el DOM limpio
          splitTitle.revert();
          splitSubtitle.revert();
        },
      });

      introTimeline.current = tl;

      mm.add(
        {
          isMobile: "(max-width: 768px)",
          isDesktop: "(min-width: 769px)",
        },
        (context) => {
          const { isMobile } = context.conditions;

          tl.fromTo(
            ".particles-bg",
            { opacity: 0 },
            { opacity: 1, duration: 3, ease: "power1.inOut" },
            "start"
          )
            .fromTo(
              ".hero-image-container",
              { width: "0%" },
              {
                width: isMobile ? "100%" : "50%",
                duration: 1.8,
                ease: "power4.out",
              },
              "start+=0.3"
            )
            .fromTo(
              imageRef.current,
              { scale: 1.3 },
              { scale: 1, duration: 2, ease: "power2.out" },
              "<"
            )
            .from(
              splitTitle.chars,
              {
                duration: 1,
                y: 10,
                stagger: 0.05,
                autoAlpha: 0,
                filter: "blur(10px)",
              },
              "-=0.5"
            )
            .from(
              splitSubtitle.words,
              {
                duration: 1,
                y: 10,
                stagger: 0.05,
                autoAlpha: 0,
                filter: "blur(5px)",
              },
              "-=0.5"
            )
            .fromTo(
              ".scroll-indicator",
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 1 },
              "-=0.5"
            );
        }
      );
    }, comp);

    return () => ctx.revert();
  }, []); // Se ejecuta solo al montar el componente

  // 2. DISPARAR LA ANIMACIÓN CUANDO TERMINA EL SPLASH
  useEffect(() => {
    if (startAnimation && introTimeline.current && !hasAnimatedOnce.current) {
      introTimeline.current.play();
    }
  }, [startAnimation]);

  // 3. TRANSICIÓN SUAVE DEL SUBTÍTULO AL CAMBIAR DE IDIOMA (Efecto Awwwards sutil)
  useEffect(() => {
    // Si todavía no corrió la intro inicial, no hacemos nada
    if (!hasAnimatedOnce.current) return;

    // Transición rápida y elegante para actualizar el texto
    gsap.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 6, filter: "blur(4px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.45, ease: "power2.out" }
    );
  }, [language]);

  return (
    <section id="home" className="hero-section" ref={comp}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesConfig}
        className="particles-bg"
      />

      <div className="hero-image-container">
        <picture>
          <source
            media="(max-width: 768px)"
            srcSet="/images/hero-portrait-responsive.png"
          />
          <img
            ref={imageRef}
            src="/images/hero-portrait.png"
            alt={t.hero.altPortrait}
          />
        </picture>
      </div>

      <div className="hero-content">
        <div className="title-wrapper">
          <h1 className="hero-title" ref={titleRef}>
            {t.hero.title}
          </h1>
        </div>
        <div className="subtitle-wrapper">
          <p className="hero-subtitle" ref={subtitleRef}>
            {t.hero.subtitle}
          </p>
        </div>
      </div>

      <div className="scroll-indicator">
        <span>{t.hero.scroll}</span>
        <div className="mouse">
          <div className="chevron"></div>
          <div className="chevron"></div>
          <div className="chevron"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;