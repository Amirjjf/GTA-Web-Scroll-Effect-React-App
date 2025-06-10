import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./IntroSection.css";

gsap.registerPlugin(ScrollTrigger);

const IntroSection = () => {
  const sectionRef = useRef(null);
  const summaryRef = useRef(null);

  useEffect(() => {
    const introSection = sectionRef.current;
    const summary = summaryRef.current;    if (!introSection || !summary) return;

    // Initialize the summary element with GSAP to prevent double appearance
    gsap.set(summary, {
      opacity: 0,
      scale: 1.1,
      clipPath: "circle(20% at 50% 50%)",
    });

    // Calculate the hero scroll distance (5 viewport heights from HeroSection)
    const heroScrollDistance = window.innerHeight * 5;// Create ScrollTrigger for the IntroSection that starts after hero completes
    const scrollTrigger = ScrollTrigger.create({
      trigger: "body", // Use body as trigger to get global scroll position
      start: `${heroScrollDistance}px top`,
      end: `${heroScrollDistance + window.innerHeight * 3}px top`, // Give 3 viewport heights for intro animation
      pin: introSection,
      pinSpacing: false, // Don't add spacing since we want it to overlay
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        
        // Initially hide the section, then fade it in smoothly, then fade it out
        let sectionOpacity = 0;
        if (progress < 0.9) {
          sectionOpacity = Math.min(1, Math.max(0, progress * 3)); // Fade in
        } else {
          sectionOpacity = Math.max(0, 1 - ((progress - 0.9) * 10)); // Fade out quickly at the end
        }
        
        gsap.set(introSection, {
          opacity: sectionOpacity,
        });

        // Animate summary based on progress - more gradual timing with fade out
        let contentOpacity = 0;
        let contentScale = 1.1;
        let contentClipPath = "circle(20% at 50% 50%)";
        
        if (progress >= 0.15 && progress < 0.85) {
          const contentProgress = Math.min(1, Math.max(0, (progress - 0.15) / 0.7)); // Normalize between 0.15 and 0.85
          contentOpacity = contentProgress;
          contentScale = 1.1 - (contentProgress * 0.18); // From 1.1 to 0.92
          contentClipPath = `circle(${20 + (contentProgress * 80)}% at 50% 50%)`; // From 20% to 100%
        } else if (progress >= 0.85) {
          // Fade out content
          const fadeOutProgress = (progress - 0.85) / 0.15;
          contentOpacity = Math.max(0, 1 - fadeOutProgress);
          contentScale = 0.92;
          contentClipPath = "circle(100% at 50% 50%)";
        }
        
        gsap.set(summary, {
          opacity: contentOpacity,
          scale: contentScale,
          clipPath: contentClipPath,
        });
      },onEnter: () => {
        if (introSection) {
          introSection.style.pointerEvents = "auto";
          introSection.style.position = "fixed";
          introSection.style.top = "0";
          introSection.style.left = "0";
          introSection.style.width = "100vw";
          introSection.style.height = "100vh";
          introSection.style.zIndex = "100";
        }
      },
      onLeave: () => {
        if (introSection) introSection.style.pointerEvents = "none";
      },      onEnterBack: () => {
        if (introSection) {
          introSection.style.pointerEvents = "auto";
          introSection.style.position = "fixed";
          introSection.style.top = "0";
          introSection.style.left = "0";
          introSection.style.width = "100vw";
          introSection.style.height = "100vh";
          introSection.style.zIndex = "100";
        }
      },
      onLeaveBack: () => {
        if (introSection) {
          introSection.style.pointerEvents = "none";
          // Reset positioning when leaving back
          introSection.style.position = "relative";
          introSection.style.zIndex = "10";
        }
      },
    });    return () => {
      scrollTrigger.kill();
    };
  }, []);  return (
    <section
      className="intro"
      ref={sectionRef}
      style={{ 
        pointerEvents: "none", 
        opacity: 0,
        height: "100vh",
        position: "relative",
        zIndex: 10
      }}
    >      <div
        className="summary"
        ref={summaryRef}
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