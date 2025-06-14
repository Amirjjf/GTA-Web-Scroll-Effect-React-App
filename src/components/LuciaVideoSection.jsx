import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LuciaVideo from "./LuciaVideo";

gsap.registerPlugin(ScrollTrigger);

const LuciaVideoSection = () => {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [visibility, setVisibility] = useState(0); // Changed from boolean to number (0-1)
  const [isBlurred, setIsBlurred] = useState(true);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return; // Create ScrollTrigger for the video section
    const scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom center",
      pin: false,
      scrub: 1,
      onUpdate: (self) => {
        const scrollProgress = self.progress;
        setProgress(scrollProgress);
        let calculatedVisibility;
        if (scrollProgress <= 0.95) {
          const adjustedProgress = Math.min(scrollProgress / 0.5, 1);
          calculatedVisibility = Math.max(0, adjustedProgress);
        } else {
          const fadeProgress = (scrollProgress - 0.95) / 0.05;
          calculatedVisibility = Math.max(0, 1 - fadeProgress);
        }
        setVisibility(calculatedVisibility);
        setIsBlurred(scrollProgress < 0.15);
      },
      onEnter: () => {},
      onLeave: () => {},
      onEnterBack: () => {},
      onLeaveBack: () => {
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
        {/* This section provides scrollable content for video frame animation */}{" "}
        <LuciaVideo
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
