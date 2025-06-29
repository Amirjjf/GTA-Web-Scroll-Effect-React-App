import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LogoVideo from "./LogoVideo";

gsap.registerPlugin(ScrollTrigger);

const LogoVideoSection = ({
  onLoaded = () => {},
  setLoadingProgress = null,
}) => {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [visibility, setVisibility] = useState(0);

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
          height: "300vh",
          backgroundColor: "#111117",
          position: "relative",
        }}
      >
        <LogoVideo
          show={visibility > 0}
          progress={progress}
          visibility={visibility}
          onLoaded={onLoaded}
          setLoadingProgress={setLoadingProgress}
        />
      </section>
    </>
  );
};

export default LogoVideoSection;
