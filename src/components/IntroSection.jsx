import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./IntroSection.css";

const IntroSection = React.forwardRef(({ scrollProgress }, ref) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const introSection = sectionRef.current;
    let introSectionOpacity = 0;
    const introSectionFadeStartScroll = 0.92;
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
      <div className="summary">
        <h2>Vice City, USA.</h2>
        <p>
          Jason and Lucia have always known the deck is stacked against them.
          But when an easy score goes wrong, they find themselves on the
          darkest side of the sunniest place in America, in the middle of a
          criminal conspiracy stretching across the state of Leonida — forced
          to rely on each other more than ever if they want to make it out
          alive.
        </p>
      </div>
    </section>
  );
});

export default IntroSection;