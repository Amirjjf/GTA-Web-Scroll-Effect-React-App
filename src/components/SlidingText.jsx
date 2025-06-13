import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import "./SlidingText.css";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const SLIDING_TEXT_STYLE = {
  SLIDING_TEXT: "opacity-20 text-5xl md:text-7xl font-bold whitespace-nowrap",
  SECTION:
    "w-full relative select-none py-24 md:py-30 section-container flex flex-col",
  TITLE: "mt-6 md:mt-8 font-medium text-4xl md:text-5xl text-center",
};

// Utility function to check if screen is small
const isSmallScreen = () => window.innerWidth < 768;

// Motion preference query
const NO_MOTION_PREFERENCE_QUERY = "(prefers-reduced-motion: no-preference)";

const SlidingText = ({ 
  leftText = " Gaming Adventure Action Stealth ",
  rightText = " Metal Gear Solid Legacy ",
  title = "Experience the",
  highlightedText = "Metal Gear Legacy"
}) => {
  const quoteRef = useRef(null);
  const targetSection = useRef(null);
  const [willChange, setWillChange] = useState(false);
  const initTextGradientAnimation = (targetSection) => {
    const timeline = gsap.timeline({ defaults: { ease: "none" } });
    const textStrongElement = quoteRef.current?.querySelector(".text-strong");
    
    if (quoteRef.current && textStrongElement) {
      timeline
        .from(quoteRef.current, { opacity: 0, duration: 2 })
        .to(textStrongElement, {
          backgroundPositionX: "100%",
          duration: 1,
        });
    }

    return ScrollTrigger.create({
      trigger: targetSection.current,
      start: "center bottom",
      end: "center center",
      scrub: 0,
      animation: timeline,
      onToggle: (self) => setWillChange(self.isActive),
    });
  };
  const initSlidingTextAnimation = (targetSection) => {
    const slidingTl = gsap.timeline({ defaults: { ease: "none" } });
    const leftElement = targetSection.current?.querySelector(".ui-left");
    const rightElement = targetSection.current?.querySelector(".ui-right");

    if (leftElement && rightElement) {
      slidingTl
        .to(leftElement, {
          xPercent: isSmallScreen() ? -500 : -150,
        })
        .from(
          rightElement,
          { xPercent: isSmallScreen() ? -500 : -150 },
          "<"
        );
    }

    return ScrollTrigger.create({      trigger: targetSection.current,
      start: "top bottom",
      end: "bottom top",
      scrub: 0,
      animation: slidingTl,
    });
  };

  useEffect(() => {
    let textBgAnimation;
    let slidingAnimation;

    // Small delay to ensure DOM elements are rendered
    const timeoutId = setTimeout(() => {
      textBgAnimation = initTextGradientAnimation(targetSection);

      const { matches } = window.matchMedia(NO_MOTION_PREFERENCE_QUERY);

      if (matches) {
        slidingAnimation = initSlidingTextAnimation(targetSection);
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      textBgAnimation?.kill();
      slidingAnimation?.kill();
    };
  }, []);

  const renderSlidingText = (text, layoutClasses) => (
    <p className={`${layoutClasses} ${SLIDING_TEXT_STYLE.SLIDING_TEXT}`}>
      {Array(5)
        .fill(text)
        .reduce((str, el) => str.concat(el), "")}
    </p>
  );

  const renderTitle = () => (
    <h1
      ref={quoteRef}
      className={`${SLIDING_TEXT_STYLE.TITLE} ${
        willChange ? "will-change-opacity" : ""
      }`}
    >
      {title} <span className="text-strong font-bold">{highlightedText}</span>
    </h1>
  );

  return (
    <section className={SLIDING_TEXT_STYLE.SECTION} ref={targetSection}>
      {renderSlidingText(leftText, "ui-left")}
      {renderTitle()}
      {renderSlidingText(rightText, "mt-6 md:mt-8 ui-right")}
    </section>
  );
};

export default SlidingText;