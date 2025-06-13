import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./JasonLuciaCover.css";

gsap.registerPlugin(ScrollTrigger);

const JasonLuciaCover = () => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    // Check if user is on mobile device
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;

    // Find the LuciaSection element (by class name)
    const luciaSection = document.querySelector(".lucia-section");
    if (!luciaSection) return; // Pin JasonLuciaCover until LuciaSection enters
    const scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      pin: false,
      scrub: 1,
      onUpdate: (self) => {
        // console.log("JasonLuciaCover progress:", self.progress);
        let yPosition;
        
        // Adjust movement range based on device
        let maxMovement;
        if (isSmallMobile) {
          maxMovement = 3; // Reduced movement for small mobile
        } else if (isMobile) {
          maxMovement = 4; // Medium movement for tablet
        } else {
          maxMovement = 5; // Full movement for desktop
        }
        
        if (self.progress <= 0.5) {
          // Phase 1: 0 to 0.5 progress -> yPosition 0 to +maxMovement
          yPosition = maxMovement * (self.progress * 2);
        } else if (self.progress <= 0.6) {
          // Phase 2: 0.5 to 0.6 progress -> yPosition +maxMovement to 0
          const phase2Progress = (self.progress - 0.5) / 0.1; // normalize 0.5-0.6 to 0-1
          yPosition = maxMovement * (1 - phase2Progress); // maxMovement to 0
        } else {
          // Phase 3: 0.6 to 1.0 progress -> yPosition 0 to -maxMovement
          const phase3Progress = (self.progress - 0.6) / 0.4; // normalize 0.6-1.0 to 0-1
          yPosition = -maxMovement * phase3Progress; // 0 to -maxMovement
        }
        console.log("Progress:", self.progress, "yPosition:", yPosition);
        gsap.set(container, {
          y: -yPosition + "%",
          transformOrigin: "center center",
        });
      },
    });

    // Handle window resize to update mobile detection and refresh ScrollTrigger
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      scrollTrigger.kill(); // Cleanup on unmount
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <section ref={sectionRef} className="jason-lucia-cover">
      <div ref={containerRef} className="cover-image">
        <img
          ref={imageRef}
          src="Jason_and_Lucia.jpg"
          alt="Jason and Lucia Cover"
        />
      </div>
    </section>
  );
};

export default JasonLuciaCover;
