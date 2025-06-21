import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./JasonLuciaCover.css";

gsap.registerPlugin(ScrollTrigger);

const JasonLuciaCover = ({ onImageLoaded }) => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;

    const luciaSection = document.querySelector(".lucia-section");
    if (!luciaSection) return;
    const scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      pin: false,
      scrub: 1,
      onUpdate: (self) => {
        let yPosition;
        let maxMovement;
        if (isSmallMobile) {
          maxMovement = 3;
        } else if (isMobile) {
          maxMovement = 4;
        } else {
          maxMovement = 5;
        }
        if (self.progress <= 0.5) {
          yPosition = maxMovement * (self.progress * 2);
        } else if (self.progress <= 0.6) {
          const phase2Progress = (self.progress - 0.5) / 0.1;
          yPosition = maxMovement * (1 - phase2Progress);
        } else {
          const phase3Progress = (self.progress - 0.6) / 0.4;
          yPosition = -maxMovement * phase3Progress;
        }
        console.log("Progress:", self.progress, "yPosition:", yPosition);
        gsap.set(container, {
          y: -yPosition + "%",
          transformOrigin: "center center",
        });
      },
    });

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      scrollTrigger.kill();
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <section ref={sectionRef} className="jason-lucia-cover">
      <div ref={containerRef} className="cover-image">
        <img
          ref={imageRef}
          src="Jason_and_Lucia.jpg"
          alt="Jason and Lucia Cover"
          onLoad={onImageLoaded}
        />
      </div>
    </section>
  );
};

export default JasonLuciaCover;
