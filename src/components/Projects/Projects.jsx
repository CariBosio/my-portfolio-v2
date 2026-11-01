import React, { useRef} from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Projects.scss";

gsap.registerPlugin(ScrollTrigger);

const roadmapData = [
  {
    id: 1,
    phase: "Phase #01",
    date: "May 15th",
    title: "Beta",
    highlight: "Launch",
    color: "#ecb74c",
    bgColor: "rgb(46, 42, 34)",
    borderColor: "rgba(236, 183, 76, 0.35)",
    rotation: 0,
    endRotation: -10
  },
  {
    id: 2,
    phase: "Phase #02",
    date: "July 1st",
    title: "Public",
    highlight: "Release",
    color: "#7dd8cd",
    bgColor: "rgb(33, 44, 43)",
    borderColor: "rgba(125, 216, 205, 0.35)",
    rotation: 5,
    endRotation: 0
  },
  {
    id: 3,
    phase: "Phase #03",
    date: "August 20th",
    title: "API",
    highlight: "Integration",
    color: "#e0ff57",
    bgColor: "rgb(49, 51, 38)",
    borderColor: "rgba(224, 255, 87, 0.35)",
    rotation: 0,
    endRotation: -5
  },
  {
    id: 4,
    phase: "Phase #04",
    date: "October 5th",
    title: "Pro",
    highlight: "Features",
    color: "#7dd8cd",
    bgColor: "rgb(27, 39, 38)",
    borderColor: "rgba(125, 216, 205, 0.35)",
    rotation: -5,
    endRotation: -2
  },
];

const Projects = ({ lenis }) => {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const progressBarContainerRef = useRef(null);
  const progressBarRef = useRef(null);
  const indicesContainerRef = useRef(null);
  
  const cardsRef = useRef([]);
  const indicesRef = useRef([]);
  const tlRef = useRef(null);

  useGSAP(() => {
    const cards = cardsRef.current;
    const indices = indicesRef.current;
    const mm = gsap.matchMedia();

    // --- SETTERS INICIALES ---
    gsap.set([progressBarContainerRef.current, indicesContainerRef.current], { autoAlpha: 0 });
    
    // Header centrado con xPercent/yPercent para consistencia en todos los monitores
    gsap.set(headerRef.current, {
      xPercent: -50,
      yPercent: -50,
      top: "50%",
      left: "50%",
      y: "50vh", // Empieza abajo
      scale: 1, 
      opacity: 0
    });

    roadmapData.forEach((data, i) => {
      if (cards[i]) {
        gsap.set(cards[i], { top: "150%", rotation: data.rotation });
      }
    });

   // --- 1. ANIMACIÓN DEL TÍTULO CON CONDICIONAL ---
  mm.add({
    isMobile: "(max-width: 900px)",
    isDesktop: "(min-width: 901px)"
  }, (context) => {
    let { isMobile } = context.conditions;

    gsap.to(headerRef.current, {
      // Si es mobile usa -300, si no usa 0
      y: isMobile ? -280 : 0, 
      scale: 0.5, 
      opacity: 1, 
      ease: "power2.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%", 
        end: "center 50%", 
        scrub: 1, 
      }
    });
  });

    // --- 2. TIMELINE DE CARDS (PINNED) ---
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top", 
        end: "+=4000",
        pin: true,
        scrub: 1,
      },
    });
    
    tlRef.current = tl;

    // BUCLE DE CARDS
    roadmapData.forEach((data, index) => {
      const positionTime = index === 0 ? 0 : "+=0.5";
      const card = cards[index];
      const indexItem = indices[index];

      // Mover Card
      tl.to(card, {
          top: "50%",
          rotation: data.endRotation,
          duration: 3,
          ease: "power2.out",
        }, positionTime
      );

      tl.addLabel("card-" + index);

      // UI Lateral
      if (index === 0) {
        tl.to([progressBarContainerRef.current, indicesContainerRef.current], {
            autoAlpha: 1,
            duration: 1,
          }, "<"
        );
      }

      // Progress Bar
      const progressPercentage = ((index + 1) / roadmapData.length) * 100;
      tl.to(progressBarRef.current, {
          height: `${progressPercentage}%`,
          backgroundColor: data.color,
          duration: 3,
        }, "<"
      );

      // Indices
      tl.to(indices, { opacity: 0.25, duration: 0.5 }, "<");
      tl.to(".index-text-p", { textDecoration: "line-through", duration: 0.1 }, "<");

      if (indexItem) {
        const currentTexts = indexItem.querySelectorAll("p");
        tl.to(currentTexts, { textDecoration: "none", duration: 0.1 }, "<");
        tl.to(indexItem, {
            opacity: 1,
            color: data.color,
            duration: 0.5,
          }, "<"
        );
      }
    });

    // --- EL FINAL SUAVE (LO QUE FALTABA) ---
    
    // 1. Tiempo muerto: El usuario sigue scrolleando pero NO pasa nada visualmente.
    // Esto te da tiempo de usar el menú si estás en la última tarjeta.
    tl.to({}, { duration: 2 }); 

    // 2. Desvanecer UI: Justo antes de que se "suelte" el Pin para ir a Contacto.
    tl.to([progressBarContainerRef.current, indicesContainerRef.current], {
      autoAlpha: 0, 
      duration: 1, 
      ease: "power1.in"
    });

  }, { scope: containerRef });

  const handleIndexClick = (index) => {
    if (!tlRef.current || !lenis) return;
    const labelName = "card-" + index;
    const targetScroll = tlRef.current.scrollTrigger.labelToScroll(labelName);
    if (targetScroll !== undefined) {
      lenis.scrollTo(targetScroll, { duration: 2, lock: true, force: true });
    }
  };

  return (
    <section className="projects-section pinned" ref={containerRef} id="projects">
      <div className="sticky-header" ref={headerRef}>
        <h1>Selected Works</h1>
      </div>

      <div className="progress-bar" ref={progressBarContainerRef}>
        <div className="progress" ref={progressBarRef}></div>
      </div>

      <div className="indices" ref={indicesContainerRef}>
        {roadmapData.map((item, i) => (
          <div 
            className="index" 
            key={item.id}
            ref={el => indicesRef.current[i] = el}
            onClick={() => handleIndexClick(i)}
          >
            <p className="index-text-p">{item.date}</p>
            <p className="index-text-p">{item.title} {item.highlight}</p>
          </div>
        ))}
      </div>

      {roadmapData.map((item, i) => (
        <div 
          className="card" 
          key={item.id}
          ref={el => cardsRef.current[i] = el}
          style={{ 
            backgroundColor: item.bgColor, 
            border: `2px solid ${item.borderColor}` 
          }}
        >
          <div className="card-phase" style={{ backgroundColor: item.color }}>
            <p>{item.phase}</p>
          </div>
          <div className="card-title" style={{ color: item.color }}>
            <p>From {item.date}</p>
            <h1>{item.title} <span>{item.highlight}</span></h1>
          </div>
        </div>
      ))}
<div className="section-glow-bridge"></div>
    </section>
  );
};

export default Projects;