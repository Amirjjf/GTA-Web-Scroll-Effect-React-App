import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LuciaVideo from "./LuciaVideo";

gsap.registerPlugin(ScrollTrigger);

const LuciaVideoSection = () => {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isBlurred, setIsBlurred] = useState(true);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;    // Create ScrollTrigger for the video section
    const scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom center",
      pin: false,
      scrub: 1,      onUpdate: (self) => {
        const scrollProgress = self.progress;
        setProgress(scrollProgress);

        // Match the calculation used in LuciaVideo.jsx
        const targetFrame = scrollProgress * (45 - 1); // 0-44 range
        const actualFrame = Math.round(targetFrame) + 1; // Convert to 1-45 range for display
        console.log("LuciaVideoSection progress:", scrollProgress, "| targetFrame:", targetFrame, "| actualFrame:", actualFrame);
        
        // Show video when we're in the section
        setIsVisible(scrollProgress > 0);
        
        // Control blur based on progress - less blur as we progress
        setIsBlurred(scrollProgress < 0.15);
      },
      onEnter: () => {
        setIsVisible(true);
      },      onLeave: () => {
        // Hide video when completely leaving the section
        setIsVisible(false);
      },
      onEnterBack: () => {
        setIsVisible(true);
      },
      onLeaveBack: () => {
        setIsVisible(false); // Only hide when scrolling back up past the section
      },
    });

    return () => {
      scrollTrigger.kill();
    };
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        style={{
          height: "300vh", // Give enough height for scroll animation
          backgroundColor: "#111117",
          position: "relative",
        }}
      >
        {/* This section provides scrollable content for video frame animation */}
      <LuciaVideo 
        show={isVisible} 
        isBlurred={isBlurred} 
        progress={progress}
      />
      </section>
    </>
  );
};

export default LuciaVideoSection;
