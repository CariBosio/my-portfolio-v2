// src/components/Marquee/Marquee.jsx
import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../../context/useLanguage';
import './Marquee.scss';

gsap.registerPlugin(ScrollTrigger);

const Marquee = () => {
  const { t } = useLanguage();
  const containerRef = useRef(null);
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);

  // Función para repetir el texto (asegura seamless loop)
  const repeatText = (text, count = 4) => Array(count).fill(text).join("");

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const duration = 150;

      // ANIMACIÓN FILA 1 (Hacia la IZQUIERDA)
      const tl1 = gsap.to(row1Ref.current, {
        xPercent: -50,
        ease: "none",
        duration: duration,
        repeat: -1,
      });

      // ANIMACIÓN FILA 2 (Hacia la DERECHA)
      gsap.set(row2Ref.current, { xPercent: -50 });
      const tl2 = gsap.to(row2Ref.current, {
        xPercent: 0,
        ease: "none",
        duration: duration,
        repeat: -1,
      });

      // EFECTO SHRINK (Ancho 100vw -> 80%)
      gsap.fromTo(
        containerRef.current,
        {
          width: "100vw",
          borderRadius: "0px",
        },
        {
          width: "80%",
          borderRadius: "30px",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 50%",
            end: "bottom top",
            scrub: 1,
          },
        }
      );

      // VELOCIDAD ASOCIADA AL SCROLL
      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const scrollVel = self.getVelocity();

          if (Math.abs(scrollVel) < 5) {
            gsap.to([tl1, tl2], { timeScale: 1, duration: 0.5 });
            return;
          }

          const timeScaleFactor = 1 + Math.abs(scrollVel * 0.005);
          const maxScale = 5;
          const targetScale = Math.min(timeScaleFactor, maxScale);

          gsap.to([tl1, tl2], {
            timeScale: targetScale,
            duration: 0.2,
            overwrite: true,
          });

          gsap.delayedCall(0.5, () => {
            gsap.to([tl1, tl2], { timeScale: 1, duration: 1 });
          });
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []); // Sin dependencia en language para evitar reseteos de scroll

  return (
    <section className="marquee-section" ref={containerRef}>
      <div className="marquee-track">
        <div className="marquee-content" ref={row1Ref}>
          <span>{repeatText(t.marquee.row1)}</span>
          <span>{repeatText(t.marquee.row1)}</span>
        </div>
      </div>

      <div className="marquee-track">
        <div className="marquee-content outline-text" ref={row2Ref}>
          <span>{repeatText(t.marquee.row2)}</span>
          <span>{repeatText(t.marquee.row2)}</span>
        </div>
      </div>
    </section>
  );
};

export default Marquee;