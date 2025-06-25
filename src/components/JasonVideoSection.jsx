import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import JasonVideo from "./JasonVideo";

gsap.registerPlugin(ScrollTrigger);

const JasonVideoSection = ({ onLoaded = () => {}, setLoadingProgress = null }) => {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visibility, setVisibility] = useState(0);
  const [isBlurred, setIsBlurred] = useState(true);
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;    const scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top center", // Start when section reaches center of viewport
      end: "bottom center",
      pin: false,
      scrub: 1,
      onUpdate: (self) => {
        const rawScrollProgress = self.progress;
        setScrollProgress(rawScrollProgress);
        
        // Create a delayed start with smooth fade-in
        let calculatedVisibility = 0;
        let frameProgress = 0;
        
        if (rawScrollProgress >= 0.3) {
          // Start frame progression from 30% of scroll
          frameProgress = Math.min((rawScrollProgress - 0.3) / 0.55, 1);
          setProgress(frameProgress);
          
          // Calculate visibility with gradual fade-in
          if (rawScrollProgress <= 0.85) {
            const adjustedProgress = Math.min((rawScrollProgress - 0.3) / 0.4, 1);
            // Use a smoother easing curve
            const easedProgress = adjustedProgress * adjustedProgress * (3.0 - 2.0 * adjustedProgress);
            calculatedVisibility = Math.max(0, easedProgress);
          } else {
            // Fade out near the end
            const fadeProgress = (rawScrollProgress - 0.85) / 0.15;
            calculatedVisibility = Math.max(0, 1 - fadeProgress);
          }
        }
        
        setVisibility(calculatedVisibility);
        setIsBlurred(rawScrollProgress < 0.5); // Later blur removal
      },
      onEnter: () => {},
      onLeave: () => {},
      onEnterBack: () => {},
      onLeaveBack: () => {
        setVisibility(0);
        setProgress(0);
      },
    });

    return () => {
      scrollTrigger.kill();
    };
  }, []);

  return (
    <>      <section
        ref={sectionRef}
        style={{
          height: "300vh", // Increased height for better control
          backgroundColor: "transparent",
          position: "relative",
        }}
      >
        <JasonVideo
          show={visibility > 0}
          isBlurred={isBlurred}
          progress={progress}
          scrollProgress={scrollProgress}
          visibility={visibility}
          onLoaded={onLoaded}
          setLoadingProgress={setLoadingProgress}
        />
      </section>
    </>
  );
};

export default JasonVideoSection;
