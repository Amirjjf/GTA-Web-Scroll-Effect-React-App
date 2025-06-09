import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./IntroSection.css";

gsap.registerPlugin(ScrollTrigger);

const IntroSection = () => {
  const sectionRef = useRef(null);
  const summaryRef = useRef(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const introSection = sectionRef.current;
    const summary = summaryRef.current;

    if (!introSection || !summary) return;

    // Create ScrollTrigger for the IntroSection
    const scrollTrigger = ScrollTrigger.create({
      trigger: introSection,
      start: "top center",
      end: "bottom center",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        
        // Fade in the section
        gsap.set(introSection, {
          opacity: progress,
        });
        
        // Control the active state for CSS transitions
        if (progress > 0.5 && !isActive) {
          setIsActive(true);
        } else if (progress <= 0.5 && isActive) {
          setIsActive(false);
        }

        // Animate summary based on progress
        gsap.set(summary, {
          opacity: progress,
          scale: 1.1 - (progress * 0.18), // From 1.1 to 0.92
          clipPath: `circle(${20 + (progress * 80)}% at 50% 50%)`, // From 20% to 100%
        });
      },
      onEnter: () => {
        if (introSection) introSection.style.pointerEvents = "auto";
      },
      onLeave: () => {
        if (introSection) introSection.style.pointerEvents = "none";
      },
      onEnterBack: () => {
        if (introSection) introSection.style.pointerEvents = "auto";
      },
      onLeaveBack: () => {
        if (introSection) introSection.style.pointerEvents = "none";
      },
    });

    return () => {
      scrollTrigger.kill();
    };
  }, [isActive]);

  return (
    <section
      className={`intro ${isActive ? "active" : ""}`}
      ref={sectionRef}
      style={{ 
        pointerEvents: "none", 
        opacity: 0,
        height: "100vh",
        position: "relative"
      }}
    >
      <div
        className="summary"
        ref={summaryRef}
        style={{
          opacity: 0,
          transform: "scale(1.1)",
          clipPath: "circle(20% at 50% 50%)",
        }}
      >
        <h2>Vice City, USA.</h2>
        <p>
          Jason and Lucia have always known the deck is stacked against them. But
          when an easy score goes wrong, they find themselves on the darkest side
          of the sunniest place in America, in the middle of a criminal
          conspiracy stretching across the state of Leonida — forced to rely on
          each other more than ever if they want to make it out alive.
        </p>
      </div>
    </section>
  );
};

export default IntroSection;