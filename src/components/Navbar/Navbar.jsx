import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import LanguageToggle from "../LanguageToggle/LanguageToggle";
import { useLanguage } from "../../context/useLanguage";
import "./Navbar.scss";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const Navbar = ({ startAnimation, lenis }) => {
  const { t } = useLanguage();
  const navRef = useRef(null);
  const linksRef = useRef(null);
  const burgerRef = useRef(null);
  const menuRef = useRef(null);

  // Ref para guardar la Línea de Tiempo del Menú
  const menuTl = useRef(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);

  useEffect(() => {
    if (startAnimation) {
      gsap.fromTo(
        navRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      );
    }
  }, [startAnimation]);

  const scrollToSection = (id) => {
    setIsMenuOpen(false); // Esto disparará el .reverse() automáticamente

    if (lenis) {
      lenis.scrollTo(`#${id}`, {
        offset: 0,
        duration: 1.5,
        lock: true,
      });
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // --- 1. CONFIGURACIÓN MAESTRA DEL MENÚ (SE CREA UNA VEZ) ---
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      menuTl.current = gsap
        .timeline({ paused: true })
        // A. Fondo Negro (Overlay)
        .to(menuRef.current, {
          autoAlpha: 1,
          duration: 0.6,
          ease: "power3.inOut",
        })

        // B. Transformación Hamburguesa -> X
        .to(
          line1Ref.current,
          { rotation: 45, y: 6, duration: 0.4, ease: "back.out(1.7)" },
          0,
        )
        .to(
          line2Ref.current,
          {
            rotation: -45,
            y: -6,
            width: "30px",
            duration: 0.4,
            ease: "back.out(1.7)",
          },
          0,
        )

        // C. Los Links aparecen (Stagger)
        .fromTo(
          ".menu-link-item",
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: "power2.out" },
          "-=0.3",
        );
    }, navRef);

    return () => ctx.revert();
  }, []);

  // --- 2. CONTROLADOR: ABRIR / CERRAR ---
  useEffect(() => {
    if (menuTl.current) {
      if (isMenuOpen) {
        menuTl.current.play();
      } else {
        menuTl.current.reverse();
      }
    }
  }, [isMenuOpen]);

  // --- 3. ANIMACIÓN RESPONSIVA (LINKS vs BURGER) ---
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        isMobile: "(max-width: 900px)",
        isDesktop: "(min-width: 901px)",
      },
      (context) => {
        let { isMobile } = context.conditions;

        if (isMobile) {
          gsap.set(linksRef.current, { autoAlpha: 0, display: "none" });
          gsap.set(burgerRef.current, {
            autoAlpha: 1,
            x: 0,
            rotation: 0,
            pointerEvents: "auto",
          });
        } else {
          gsap.set(linksRef.current, { autoAlpha: 1, display: "flex", x: 0 });
          gsap.set(burgerRef.current, {
            autoAlpha: 0,
            x: 20,
            rotation: -90,
            pointerEvents: "none",
          });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: "body",
              start: "50px top",
              end: "300px top",
              scrub: 1,
              onLeaveBack: () => setIsMenuOpen(false),
            },
          });

          tl.to(linksRef.current, {
            autoAlpha: 0,
            x: 50,
            pointerEvents: "none",
            duration: 0.5,
            ease: "power1.in",
          }).to(
            burgerRef.current,
            {
              autoAlpha: 1,
              x: 0,
              rotation: 0,
              pointerEvents: "auto",
              duration: 0.5,
              ease: "power1.out",
            },
            ">",
          );
        }
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <>
      <nav className="navbar" ref={navRef}>
        <div className="navbar-logo-placeholder"></div>

        <div className="nav-controls">
          <ul className="navbar-links" ref={linksRef}>
            <li onClick={() => scrollToSection("home")}>{t.nav.home}</li>
            <li onClick={() => scrollToSection("about")}>{t.nav.bio}</li>
            <li onClick={() => scrollToSection("projects")}>
              {t.nav.projects}
            </li>
            <li onClick={() => scrollToSection("contact")}>{t.nav.contact}</li>
            <li className="lang-item">
              <LanguageToggle />
            </li>
          </ul>

          {/* Botón Hamburguesa */}
          <div className="hamburger-btn" ref={burgerRef} onClick={toggleMenu}>
            <div className="line line-1" ref={line1Ref}></div>
            <div className="line line-2" ref={line2Ref}></div>
          </div>
        </div>
      </nav>

      {/* Menú Overlay */}
      <div className="menu-overlay" ref={menuRef}>
        <div className="menu-content">
          <ul>
            <li
              className="menu-link-item"
              onClick={() => scrollToSection("home")}
            >
              <span className="number">01</span>
              <span className="link-text">{t.nav.home}</span>
            </li>
            <li
              className="menu-link-item"
              onClick={() => scrollToSection("about")}
            >
              <span className="number">02</span>
              <span className="link-text">{t.nav.bio}</span>
            </li>
            <li
              className="menu-link-item"
              onClick={() => scrollToSection("projects")}
            >
              <span className="number">03</span>
              <span className="link-text">{t.nav.projects}</span>
            </li>
            <li
              className="menu-link-item"
              onClick={() => scrollToSection("contact")}
            >
              <span className="number">04</span>
              <span className="link-text">{t.nav.contact}</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
