import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./IntroSection.css";

const IntroSection = React.forwardRef(({ scrollProgress }, ref) => {
  const sectionRef = useRef(null);
  const summaryRef = useRef(null);

  useEffect(() => {
    const introSection = sectionRef.current;
    const summary = summaryRef.current;
    // Make intro section last longer: fade out starts later, ends later
    const introSectionFadeStartScroll = 0.87; // changed from 0.96
    let introSectionOpacity = 0;
    if (scrollProgress > introSectionFadeStartScroll) {
      const fadeProgress =
        (scrollProgress - introSectionFadeStartScroll) /
        (1.0 - introSectionFadeStartScroll);
      introSectionOpacity = Math.pow(fadeProgress, 2);
    }
    gsap.set(introSection, {
      opacity: Math.min(1, Math.max(0, introSectionOpacity)),
    });
    if (introSectionOpacity > 0.05 && introSection) {
      introSection.classList.add("active");
    } else if (introSection) {
      introSection.classList.remove("active");
    }

    // Animate summary: reveal from center outwards, scale down as we scroll
    // summaryRevealProgress: 0 (hidden) to 1 (fully visible)
    let summaryRevealProgress = 0;
    if (introSectionOpacity > 0.05) {
      summaryRevealProgress = Math.min(1, (introSectionOpacity - 0.05) / 0.95);
    }
    // Scale from 1.1 (start) to 0.92 (end)
    const summaryScale = 1.1 - 0.18 * summaryRevealProgress;
    // Use clip-path to reveal from center outwards
    const clipRadius = 20 + 80 * summaryRevealProgress; // percent
    gsap.set(summary, {
      opacity: summaryRevealProgress,
      scale: summaryScale,
      clipPath: `circle(${clipRadius}% at 50% 50%)`,
    });
  }, [scrollProgress]);

  return (
    <section
      className="intro"
      ref={(el) => {
        sectionRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) ref.current = el;
      }}
    >
      <div className="summary" ref={summaryRef}>
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
});

export default IntroSection;