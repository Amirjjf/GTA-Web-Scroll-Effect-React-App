import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import JasonVideo from "./JasonVideo";

gsap.registerPlugin(ScrollTrigger);

const JasonVideoSection = () => {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visibility, setVisibility] = useState(0);
  const [isBlurred, setIsBlurred] = useState(true);
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom center",
      pin: false,
      scrub: 1,
      onUpdate: (self) => {
        const rawScrollProgress = self.progress;
        setScrollProgress(rawScrollProgress);
        const frameProgress = Math.min(rawScrollProgress / 0.8, 1);
        setProgress(frameProgress);
        let calculatedVisibility;
        if (rawScrollProgress <= 0.9) {
          const adjustedProgress = Math.min(rawScrollProgress / 0.8, 1);
          const smoothstep1 =
            adjustedProgress *
            adjustedProgress *
            (3.0 - 2.0 * adjustedProgress);
          const smoothstep2 =
            smoothstep1 * smoothstep1 * (3.0 - 2.0 * smoothstep1);
          calculatedVisibility = Math.max(0, smoothstep2);
        } else {
          const fadeProgress = (rawScrollProgress - 0.9) / 0.1;
          const smoothFadeOut =
            fadeProgress * fadeProgress * (3.0 - 2.0 * fadeProgress);
          calculatedVisibility = Math.max(0, 1 - smoothFadeOut);
        }
        setVisibility(calculatedVisibility);
        setIsBlurred(rawScrollProgress < 0.3);
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
    <>
      <section
        ref={sectionRef}
        style={{
          height: "300vh",
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
        />
      </section>
    </>
  );
};

export default JasonVideoSection;
