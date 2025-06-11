import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LuciaVideo from "./LuciaVideo";

gsap.registerPlugin(ScrollTrigger);

const LuciaVideoSection = () => {
  const sectionRef = useRef(null);  const [progress, setProgress] = useState(0);
  const [visibility, setVisibility] = useState(0); // Changed from boolean to number (0-1)
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
          // Set visibility based on scroll progress with gradual fade after 95%
        let calculatedVisibility;
        if (scrollProgress <= 0.95) {
          // Faster visibility mapping - reaches 1 at 60% instead of 95%
          const adjustedProgress = Math.min(scrollProgress / 0.5, 1);
          calculatedVisibility = Math.max(0, adjustedProgress);
        } else {
          // Gradual fade from 1 to 0 for the last 5% (95% to 100%)
          const fadeProgress = (scrollProgress - 0.95) / 0.05; // 0 to 1 for the fade range
          calculatedVisibility = Math.max(0, 1 - fadeProgress);
        }
        setVisibility(calculatedVisibility);
        
        // Control blur based on progress - less blur as we progress
        setIsBlurred(scrollProgress < 0.15);
      },      onEnter: () => {
        // Video will become visible based on scroll progress
      },
      onLeave: () => {
        // Only hide video if we haven't already faded it out naturally
        // The fade is handled in onUpdate for smooth transition
      },
      onEnterBack: () => {
        // Video will become visible based on scroll progress
      },
      onLeaveBack: () => {
        // Only hide when scrolling back up past the section
        // But respect the gradual fade logic
        setVisibility(0);
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
        {/* This section provides scrollable content for video frame animation */}      <LuciaVideo 
        show={visibility > 0} 
        isBlurred={isBlurred} 
        progress={progress}
        visibility={visibility}
      />
      </section>
    </>
  );
};

export default LuciaVideoSection;
