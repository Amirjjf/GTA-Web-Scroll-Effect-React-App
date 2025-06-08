import React, { useEffect, useRef, useState } from "react"; // Added useState
import { gsap } from "gsap";
import "./IntroSection.css";

const IntroSection = React.forwardRef(({ show }, ref) => {
  const sectionRef = useRef(null);
  const summaryRef = useRef(null);
  const [isActive, setIsActive] = useState(false); // State to control 'active' class for CSS transitions

  useEffect(() => {
    const introSection = sectionRef.current;
    const summary = summaryRef.current;

    if (show) {
      // Fade in IntroSection
      gsap.to(introSection, {
        opacity: 1,
        duration: 0.8, // Duration for fade-in
        onStart: () => {
          if (introSection) introSection.style.pointerEvents = "auto"; // Make it interactive
        },
        onComplete: () => {
          setIsActive(true); // Add active class for summary animation
        },
      });

      // Animate summary: reveal from center outwards, scale down
      // This will now be primarily controlled by the 'active' class in CSS,
      // but we can still use GSAP for initial setup or more complex parts if needed.
      // For simplicity, relying on CSS transition triggered by 'active' class.
      // If direct GSAP control is preferred over CSS transitions for summary:
      gsap.to(summary, {
        opacity: 1,
        scale: 0.92, // Final scale
        clipPath: "circle(100% at 50% 50%)", // Final clip-path
        duration: 0.8, // Duration for summary animation
        ease: "easeOut",
      });
    } else {
      // Fade out IntroSection
      gsap.to(introSection, {
        opacity: 0,
        duration: 0.8, // Duration for fade-out
        onStart: () => {
          setIsActive(false); // Remove active class
        },
        onComplete: () => {
          if (introSection) introSection.style.pointerEvents = "none"; // Make it non-interactive
          // Reset summary styles if needed when hiding
          gsap.set(summary, {
            opacity: 0,
            scale: 1.1, // Reset to initial scale
            clipPath: "circle(20% at 50% 50%)", // Reset to initial clip-path
          });
        },
      });
    }
  }, [show]); // Depend on the 'show' prop

  return (
    <section
      className={`intro ${isActive ? "active" : ""}`} // Dynamically add 'active' class
      ref={(el) => {
        sectionRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) ref.current = el;
      }}
      style={{ pointerEvents: "none", opacity: 0 }} // Initially hidden and non-interactive
    >
      <div
        className="summary"
        ref={summaryRef}
        style={{
          opacity: 0,
          transform: "scale(1.1)",
          clipPath: "circle(20% at 50% 50%)", // Initial styles for GSAP
        }}
      >
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