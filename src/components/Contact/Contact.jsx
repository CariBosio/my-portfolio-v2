import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Contact.scss";

gsap.registerPlugin(ScrollTrigger);

/**
 * Sub-componente para animar el texto de forma individual
 * Mantiene el estilo "big-link" pero añade el efecto hover.
 */
const WavyLink = ({ href, text, index, addRef, download }) => {
  const linkRef = useRef(null);

  useGSAP(
    () => {
      const visibleChars = linkRef.current.querySelectorAll(".visible .char");
      const hiddenChars = linkRef.current.querySelectorAll(".hidden .char");

      if (!visibleChars.length) return;

      gsap.set(hiddenChars, { yPercent: 100 });

      const tl = gsap.timeline({ paused: true });
      tl.to(visibleChars, {
        yPercent: -100,
        skewY: 10,
        duration: 0.3,
        stagger: 0.02,
        ease: "power2.inOut",
      }).to(
        hiddenChars,
        {
          yPercent: 0,
          skewY: 0,
          duration: 0.3,
          stagger: 0.02,
          ease: "power2.inOut",
        },
        "<",
      );

      const el = linkRef.current;
      const enter = () => tl.play();
      const leave = () => tl.reverse();

      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
      return () => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      };
    },
    { scope: linkRef },
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      // download={download}
      className="big-link wavy-link"
      ref={(el) => {
        linkRef.current = el;
        addRef(el, index);
      }}
    >
      <div
        className="text-wrapper"
        style={{ position: "relative", overflow: "hidden", display: "flex" }}
      >
        <span className="visible">
          {text.split("").map((char, i) => (
            <span key={i} className="char" style={{ display: "inline-block" }}>
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>
        <span
          className="hidden"
          aria-hidden="true"
          style={{ position: "absolute", top: 0, left: 0, width: "100%" }}
        >
          {text.split("").map((char, i) => (
            <span key={i} className="char" style={{ display: "inline-block" }}>
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>
      </div>
    </a>
  );
};

const Contact = ({ lenis }) => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const btnRef = useRef(null);
  const btnTextRef = useRef(null);
  const footerRef = useRef(null);

  const expanderRef = useRef(null);
  const overlayRef = useRef(null);
  const bigLinksRef = useRef([]);

  const closeBtnRef = useRef(null);
  const closeCircleRef = useRef(null);
  const closeX1Ref = useRef(null);
  const closeX2Ref = useRef(null);
  const microFooterRef = useRef(null);
  const easterEggRef = useRef(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const tlExpand = useRef(null);

  const addToLinksRef = (el, index) => {
    if (el) bigLinksRef.current[index] = el;
  };

  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden";
      if (lenis) lenis.stop();
    } else {
      document.body.style.overflow = "";
      if (lenis) lenis.start();
    }
  }, [isExpanded, lenis]);

useGSAP(
    () => {
      // 1. Timeline de entrada (Scroll)
      const tlEntry = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%", 
          toggleActions: "play none none reverse",
        },
      });

      tlEntry
        .from(".contact-title-line", {
          y: 150,
          skewY: 7,
          opacity: 0,
          duration: 1.5,
          stagger: 0.1,
          ease: "power4.out",
        })
        .from(
          btnRef.current,
          { 
            scale: 0, 
            opacity: 0, 
            duration: 1, 
            ease: "elastic.out(1, 0.5)" 
          },
          "-=0.7"
        )
        // CORRECCIÓN: Usamos fromTo para ignorar el opacity: 0 del CSS al final
        .fromTo(
          microFooterRef.current,
          { opacity: 0 }, // Inicio
          { 
            opacity: 0.4,    // Fin (Forzamos que aparezca)
            duration: 1.2, 
            ease: "power2.inOut" 
          },
          ">+=0.2" // Entra al final con un pequeño delay
        );

        const footer = microFooterRef.current;
      
      const onMouseEnter = () => gsap.to(footer, { opacity: 1, duration: 0.3 });
      const onMouseLeave = () => gsap.to(footer, { opacity: 0.4, duration: 0.3 });

      footer.addEventListener("mouseenter", onMouseEnter);
      footer.addEventListener("mouseleave", onMouseLeave);

      // 2. Timeline de expansión (Click)
      tlExpand.current = gsap.timeline({
        paused: true,
        onReverseComplete: () => setIsExpanded(false),
      });

      tlExpand.current
        .set(closeCircleRef.current, {
          strokeDasharray: 176,
          strokeDashoffset: 176,
          fill: "transparent",
        })
        .set([closeX1Ref.current, closeX2Ref.current], {
          strokeDasharray: 30,
          strokeDashoffset: 30,
        })
        .set(closeBtnRef.current, { autoAlpha: 1 })
        
        // Aquí ocultamos todo cuando se expande el overlay
        .to([titleRef.current, microFooterRef.current], {
          y: -50,
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
          stagger: 0.05,
        })
        .to(
          btnRef.current,
          { autoAlpha: 0, scale: 0.5, y: -50, duration: 0.4, ease: "power2.in" },
          "<"
        )
        .to(
          expanderRef.current,
          { scale: 100, duration: 1.2, ease: "expo.inOut" },
          "-=0.2",
        )
        .set(overlayRef.current, { pointerEvents: "all" }, "<")
        .fromTo(
          bigLinksRef.current.filter(Boolean),
          { y: 100, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power4.out" },
          "-=0.5",
        )
        .to(
          closeCircleRef.current,
          { strokeDashoffset: 0, duration: 0.5, ease: "power2.out" },
          ">",
        )
        .to(
          closeCircleRef.current,
          { fill: "var(--accent-color)", duration: 0.4, ease: "power2.in" },
          "-=0.2",
        )
        .to(
          [closeX1Ref.current, closeX2Ref.current],
          {
            strokeDashoffset: 0,
            duration: 0.4,
            ease: "back.out(1.5)",
            stagger: 0.1,
          },
          "-=0.1",
        );

        const wrapper = easterEggRef.current;
      if (!wrapper) return;

      const onEggEnter = () => {
        gsap.to(wrapper, {
          y: -20,            // Sube al slogan
          skewY: -2,         // Se inclina hacia arriba por la "velocidad"
          duration: 0.6,
          ease: "power4.out",
          onComplete: () => gsap.to(wrapper, { skewY: 0, duration: 0.3 }) // Vuelve a la normalidad
        });
      };

      const onEggLeave = () => {
        gsap.to(wrapper, {
          y: 0,              // Baja a la localización
          skewY: 2,          // Se inclina hacia abajo
          duration: 0.6,
          ease: "power4.out",
          onComplete: () => gsap.to(wrapper, { skewY: 0, duration: 0.3 })
        });
      };

      // Buscamos el padre (footer-center) para que el área de interacción sea cómoda
      const parent = wrapper.closest('.footer-center');
      parent.addEventListener("mouseenter", onEggEnter);
      parent.addEventListener("mouseleave", onEggLeave);

      return () => {
        parent.removeEventListener("mouseenter", onEggEnter);
        parent.removeEventListener("mouseleave", onEggLeave);
      };
    },
    { scope: containerRef },
  );

  useEffect(() => {
    if (isExpanded) return;
    const btn = btnRef.current;
    const text = btnTextRef.current;
    const expander = expanderRef.current;

    const moveButton = (e) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = btn.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      gsap.to([btn, expander], {
        x: x * 0.3,
        y: y * 0.3,
        rotation: x * 0.05,
        duration: 0.5,
        ease: "power3.out",
      });
      gsap.to(text, {
        x: x * 0.15,
        y: y * 0.15,
        duration: 0.5,
        ease: "power3.out",
      });
    };
    const resetButton = () => {
      gsap.to([btn, expander, text], {
        x: 0,
        y: 0,
        rotation: 0,
        duration: 1,
        ease: "elastic.out(1, 0.4)",
      });
    };
    btn.addEventListener("mousemove", moveButton);
    btn.addEventListener("mouseleave", resetButton);
    return () => {
      btn.removeEventListener("mousemove", moveButton);
      btn.removeEventListener("mouseleave", resetButton);
    };
  }, [isExpanded]);

  const handleCloseHover = () => {
    gsap.to(closeBtnRef.current, {
      rotation: 90,
      duration: 0.4,
      ease: "back.out(1.7)",
    });
  };
  const handleCloseHoverOut = () => {
    gsap.to(closeBtnRef.current, {
      rotation: 0,
      duration: 0.4,
      ease: "power2.out",
    });
  };
  const handleExpandClick = () => {
    setIsExpanded(true);
    tlExpand.current.play();
  };
  const handleCloseClick = () => {
    tlExpand.current.reverse();
  };

  const linksData = [
    { text: "Email", href: "mailto:caribosio72@gmail.com" },
    {
      text: "LinkedIn",
      href: "https://www.linkedin.com/in/carina-susana-bosio-73621215b/",
    },
    { text: "GitHub", href: "https://github.com/CariBosio" },
    { text: "CodePen", href: "https://codepen.io/CariBosio" },
    { text: "WhatsApp", href: "https://wa.me/5493512322922" },
    { text: "Resume", href: "/CARINA BOSIO - CV - 2026.pdf", isView: true },
  ];

  return (
    <section className="contact-section" id="contact" ref={containerRef}>
      <div className="contact-content">
        <div className="title-container" ref={titleRef}>
          <div className="mask">
            <h2 className="contact-title-line">Let’s start</h2>
          </div>
          <div className="mask">
            <h2 className="contact-title-line">a project</h2>
          </div>
          <div className="mask">
            <h2 className="contact-title-line">together</h2>
          </div>
        </div>
        <div className="btn-wrapper">
          <div className="expander-overlay" ref={expanderRef}></div>
          <div
            className="magnetic-btn"
            ref={btnRef}
            onClick={handleExpandClick}
          >
            <span ref={btnTextRef}>Get in touch</span>
          </div>
        </div>
      </div>

      <div className="contact-links-overlay" ref={overlayRef}>
        <div className="links-container">
          {linksData.map((link, i) => (
            <WavyLink
              key={i}
              index={i}
              text={link.text}
              href={link.href}
              addRef={addToLinksRef}
              download={link.isDownload ? "CV_Carina_Bosio.pdf" : undefined}
            />
          ))}

          <button
            className="close-btn"
            ref={closeBtnRef}
            onClick={handleCloseClick}
            onMouseEnter={handleCloseHover}
            onMouseLeave={handleCloseHoverOut}
          >
            <svg
              width="60"
              height="60"
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                ref={closeCircleRef}
                cx="30"
                cy="30"
                r="28"
                stroke="var(--accent-color)"
                strokeWidth="4"
              />
              <path
                ref={closeX1Ref}
                d="M20 20L40 40"
                stroke="var(--light-color)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                ref={closeX2Ref}
                d="M40 20L20 40"
                stroke="var(--light-color)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <footer className="micro-footer" ref={microFooterRef}>
        <div className="footer-left">
          <p>© 2026 Carina Bosio</p>
        </div>
        <div className="footer-center" onMouseEnter={() => {}}>
          <div className="easter-egg-wrapper" ref={easterEggRef}>
            <p className="location-text">
              <span className="dot">•</span>
              Based in Argentina
              <span className="dot">•</span>
            </p>
            <p className="slogan-text">Logic for machines, empathy for users</p>
          </div>
        </div>
        <div className="footer-right">
          <a
            href="https://www.linkedin.com/in/carina-susana-bosio-73621215b/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          <span className="separator">|</span>
          <a
            href="https://github.com/CariBosio"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <span className="separator">|</span>
          <a
            href="/CARINA BOSIO - CV - 2026.pdf"
            target="_blank"
            rel="noreferrer"
            className="cv-link"
          >
            Resume
          </a>
        </div>
      </footer>
    </section>
  );
};

export default Contact;
