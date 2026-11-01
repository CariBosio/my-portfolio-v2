// src/App.jsx
import React, { useState, useEffect, useLayoutEffect } from "react";
// 1. IMPORTAMOS LENIS Y GSAP
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Componentes
import SplashScreen from "./components/SplashScreen/SplashScreen";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Bio from "./components/Bio/Bio";
import Marquee from "./components/Marquee/Marquee";
import Projects from "./components/Projects/Projects";
import Contact from "./components/Contact/Contact";
import "./App.css";

// Registramos ScrollTrigger globalmente por seguridad
gsap.registerPlugin(ScrollTrigger);

function App() {
  const [introFinished, setIntroFinished] = useState(false);
  const [lenis, setLenis] = useState(null);

  // Forzar scroll al inicio al montar el componente
  useLayoutEffect(() => {
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // --- CONFIGURACIÓN DE LENIS (SMOOTH SCROLL) ---
  useEffect(() => {
    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    // Guardar en state en el siguiente frame para no bloquear el ciclo de montaje
    const frameId = requestAnimationFrame(() => {
      setLenis(lenisInstance);
    });

    lenisInstance.scrollTo(0, { immediate: true });

    // Sincronización con ScrollTrigger
    lenisInstance.on("scroll", ScrollTrigger.update);

    // Conexión GSAP Ticker
    const update = (time) => {
      lenisInstance.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      cancelAnimationFrame(frameId);
      gsap.ticker.remove(update);
      lenisInstance.destroy();
    };
  }, []);

  // --- BLOQUEO DE SCROLL DURANTE SPLASH ---
  useEffect(() => {
    if (!lenis) return;

    if (!introFinished) {
      document.body.style.overflowY = "hidden";
      lenis.stop();
    } else {
      document.body.style.overflowY = "auto";
      lenis.start();
    }
  }, [introFinished, lenis]);

  return (
    <div className="app-container">
      {/* Pasamos el estado al Splash para saber cuándo terminó */}
      <SplashScreen onComplete={() => setIntroFinished(true)} />

      {/* Pasamos lenis directamente sin acceder a refs */}
      <Navbar startAnimation={introFinished} lenis={lenis} />

      <main className="main-content">
        <Hero startAnimation={introFinished} />

        <Bio />

        <Marquee />

        <Projects lenis={lenis} />

        <Contact lenis={lenis} />
      </main>
    </div>
  );
}

export default App;