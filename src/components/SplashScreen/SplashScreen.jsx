import React, { useLayoutEffect, useRef } from "react"; // Agregué useState por si acaso, aunque no lo usamos en este snippet específico, es buena práctica mantener imports limpios.
import gsap from "gsap";
import Logo from "../Logo/Logo";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import "./SplashScreen.scss";

gsap.registerPlugin(ScrollToPlugin);

const SplashScreen = ({ onComplete }) => {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const curtainRef = useRef(null);

  const handleLogoClick = () => {
    gsap.to(window, {
      duration: 2,
      scrollTo: { y: "#home" },
      ease: "power4.inOut",
    });
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. QUITAMOS el onComplete de aquí para tener control manual
      const tl = gsap.timeline();

      // SETUP
      const paths = document.querySelectorAll(".logo-svg path[stroke]");
      paths.forEach((path) => {
        const length = path.getTotalLength() + 30;
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
          autoAlpha: 0,
        });
      });

      gsap.set(".i-dot", {
        autoAlpha: 0,
        y: -200,
        scale: 3,
        transformOrigin: "center center",
      });
      gsap.set(".signature-part", { autoAlpha: 1 });

      const sigPaths = document.querySelectorAll(
        ".signature-part path[stroke]",
      );
      const bBodyPath = sigPaths[1];
      const bLength = bBodyPath.getTotalLength();

      // ANIMACIÓN (Tu secuencia original)
      tl.to(".geo-part", { autoAlpha: 1, duration: 0 })
        .to(".c-letter", { opacity: 1, duration: 1 })
        .to(
          ".geo-part path[stroke]",
          {
            strokeDashoffset: 0,
            autoAlpha: 1,
            duration: 1.2,
            ease: "power2.inOut",
            stagger: 0.2,
          },
          "<",
        )
        .to(sigPaths[0], {
          strokeDashoffset: 0,
          autoAlpha: 1,
          duration: 0.4,
          ease: "power1.out",
        })
        .to(sigPaths[1], {
          strokeDashoffset: 0,
          autoAlpha: 1,
          duration: 1.4,
          ease: "power1.out",
        })
        .to(
          sigPaths[2],
          {
            strokeDashoffset: 0,
            autoAlpha: 1,
            duration: 0.5,
            ease: "power1.out",
          },
          "-=0.1",
        )
        .to(
          sigPaths[3],
          { strokeDashoffset: 0, autoAlpha: 1, duration: 0.8, ease: "none" },
          "-=0.1",
        )
        .to(sigPaths[4], {
          strokeDashoffset: 0,
          autoAlpha: 1,
          duration: 1.2,
          ease: "none",
        })
        .to(
          ".i-dot",
          {
            duration: 1.5,
            autoAlpha: 1,
            y: 0,
            scale: 1.5,
            ease: "elastic.out(1, 0.4)",
          },
          "-=0.2",
        )
        .to({}, { duration: 0.8 }) // Pequeña pausa para leer

        // MOVER EL LOGO
        .to(
          [sigPaths[2], sigPaths[3], sigPaths[4], ".i-dot"],
          {
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
          },
          "start-move",
        )

        .to(
          bBodyPath,
          {
            strokeDasharray: `${bLength - 55} ${bLength + 30}`,
            duration: 0.8,
            ease: "power2.inOut",
          },
          "start-move",
        )

        .to(
          wrapperRef.current,
          {
            y: -window.innerHeight / 2 + 40,
            x: -window.innerWidth / 2 + 65,
            scale: 0.25,
            duration: 1.2,
            ease: "power3.inOut",
          },
          "start-move",
        )

        // DESVANECER EL TELÓN NEGRO
        .to(
          curtainRef.current,
          {
            opacity: 0,
            duration: 1.2,
            ease: "power2.inOut",
            onStart: () => {
              gsap.set(curtainRef.current, { pointerEvents: "none" });
            },
          },
          "-=1.0",
        )

        // --- AQUÍ ESTÁ EL TRUCO MATEMÁTICO ---
        // Usamos .call() para disparar la función onComplete()
        // El tercer parámetro "-=1.5" significa: "Ejecuta esto 1.5 segundos ANTES de que termine todo lo anterior"
        .call(
          () => {
            if (onComplete) onComplete();
          },
          null,
          "-=1.5",
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="splash-screen" ref={containerRef}>
      <div className="bg-curtain" ref={curtainRef}></div>
      <div className="logo-wrapper" ref={wrapperRef} onClick={handleLogoClick}>
        <Logo />
      </div>
    </div>
  );
};

export default SplashScreen;
