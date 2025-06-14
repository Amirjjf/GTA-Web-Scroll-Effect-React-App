import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import JasonVideo from "./JasonVideo";

gsap.registerPlugin(ScrollTrigger);

const JasonVideoSection = () => {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0); // Add raw scroll progress
  const [visibility, setVisibility] = useState(0); // Changed from boolean to number (0-1)
  const [isBlurred, setIsBlurred] = useState(true);  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;    // Create ScrollTrigger for the video section
    // Start when section is at bottom of viewport for smooth fade-in effect
    const scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom center",
      pin: false,
      scrub: 1,
      onUpdate: (self) => {
        const rawScrollProgress = self.progress;
        setScrollProgress(rawScrollProgress); // Store raw scroll progress for zoom calculation
        
        // Compress frame animation to 60% of scroll distance for ultra-fast frame changes
        const frameProgress = Math.min(rawScrollProgress/0.8, 1);
        setProgress(frameProgress);        // Set visibility based on scroll progress with ultra-smooth fade-in but quick fade-out
        let calculatedVisibility;        if (rawScrollProgress <= 0.9) {
          // For forward scroll: Ultra gradual visibility mapping - slow fade in over first 80% of scroll
          const adjustedProgress = Math.min(rawScrollProgress / 0.8, 1);
          // Apply double smoothstep for ultra-smooth fade-in
          const smoothstep1 = adjustedProgress * adjustedProgress * (3.0 - 2.0 * adjustedProgress);
          const smoothstep2 = smoothstep1 * smoothstep1 * (3.0 - 2.0 * smoothstep1);
          calculatedVisibility = Math.max(0, smoothstep2);        } else {
          // Extended gradual fade from 1 to 0 for the last 10% (90% to 100%) - longer range for smoother fade-out
          const fadeProgress = (rawScrollProgress - 0.9) / 0.1; // 0 to 1 for the fade range
          // Use smoothstep for gentler fade-out
          const smoothFadeOut = fadeProgress * fadeProgress * (3.0 - 2.0 * fadeProgress);
          calculatedVisibility = Math.max(0, 1 - smoothFadeOut);
        }
        setVisibility(calculatedVisibility);        // Control blur based on progress - coordinate with the ultra-smooth visibility fade-in
        setIsBlurred(rawScrollProgress < 0.3);
      },
      onEnter: () => {
        // Video will become visible based on scroll progress
      },
      onLeave: () => {
        // Only hide video if we haven't already faded it out naturally
        // The fade is handled in onUpdate for smooth transition
      },
      onEnterBack: () => {
        // Video will become visible based on scroll progress
      },      onLeaveBack: () => {
        // Instantly hide when scrolling back up past the section
        setVisibility(0);
        setProgress(0);
        // Also ensure the show prop is set to false immediately
        // This will trigger instant opacity change in JasonVideo component
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
          height: "300vh", // Give enough height for scroll animation
          backgroundColor: "transparent", // Make background transparent to avoid any border effects
          position: "relative",
        }}
      >
        {/* This section provides scrollable content for video frame animation */}        <JasonVideo 
          show={visibility > 0} 
          isBlurred={isBlurred} 
          progress={progress}
          scrollProgress={scrollProgress}
          visibility={visibility}
        />
      </section>
    </>
  );
};

export default JasonVideoSection;