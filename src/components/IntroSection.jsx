import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./IntroSection.css";

gsap.registerPlugin(ScrollTrigger);

const IntroSection = () => {
  const sectionRef = useRef(null);
  const summaryRef = useRef(null);
  useEffect(() => {
    const introSection = sectionRef.current;
    const summary = summaryRef.current;
    if (!introSection || !summary) return;

    // Reset all styles first
    const resetIntroSection = () => {
      gsap.set(introSection, {
        opacity: 0,
        position: "relative",
        pointerEvents: "none",
        clearProps: "top,left,width,height,zIndex",
      });
      gsap.set(summary, {
        opacity: 0,
        scale: 1.1,
        clipPath: "circle(20% at 50% 50%)",
      });
    };

    resetIntroSection();

    const heroScrollDistance = window.innerHeight * 5;
    const scrollTrigger = ScrollTrigger.create({
      trigger: "body",
      start: `${heroScrollDistance}px top`,
      end: `${heroScrollDistance + window.innerHeight * 3}px top`,
      pin: introSection,
      pinSpacing: false,
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress;

        let sectionOpacity = 0;
        if (progress < 0.9) {
          sectionOpacity = Math.min(1, Math.max(0, progress * 3));
        } else {
          sectionOpacity = Math.max(0, 1 - (progress - 0.9) * 10);
        }

        gsap.set(introSection, {
          opacity: sectionOpacity,
        });

        let contentOpacity = 0;
        let contentScale = 1.1;
        let contentClipPath = "circle(20% at 50% 50%)";

        if (progress >= 0.15 && progress < 0.85) {
          const contentProgress = Math.min(
            1,
            Math.max(0, (progress - 0.15) / 0.7)
          );
          contentOpacity = contentProgress;
          contentScale = 1.1 - contentProgress * 0.18;
          contentClipPath = `circle(${20 + contentProgress * 80}% at 50% 50%)`;
        } else if (progress >= 0.85) {
          const fadeOutProgress = (progress - 0.85) / 0.15;
          contentOpacity = Math.max(0, 1 - fadeOutProgress);
          contentScale = 0.92;
          contentClipPath = "circle(100% at 50% 50%)";
        }

        gsap.set(summary, {
          opacity: contentOpacity,
          scale: contentScale,
          clipPath: contentClipPath,
        });
      },
      onEnter: () => {
        if (introSection) {
          gsap.set(introSection, {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 150,
            pointerEvents: "auto",
          });
        }
      },
      onLeave: () => {
        if (introSection) {
          gsap.set(introSection, {
            opacity: 0,
            position: "relative",
            pointerEvents: "none",
            clearProps: "top,left,width,height,zIndex",
          });
        }
      },
      onEnterBack: () => {
        if (introSection) {
          gsap.set(introSection, {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 150,
            pointerEvents: "auto",
          });
        }
      },
      onLeaveBack: () => {
        if (introSection) {
          gsap.set(introSection, {
            opacity: 0,
            position: "relative",
            pointerEvents: "none",
            clearProps: "top,left,width,height,zIndex",
          });
        }
      },
    });
    return () => {
      scrollTrigger.kill();
      resetIntroSection();
    };
  }, []);
  return (
    <section
      className="intro"
      ref={sectionRef}
      style={{
        pointerEvents: "none",
        opacity: 0,
        height: "100vh",
        position: "relative",
      }}
    >
      <div className="summary" ref={summaryRef}>
        <h2>Vice City, USA.</h2>
        <p>
          Jason and Lucia have always known the deck is stacked against them.
          But when an easy score goes wrong, they find themselves on the darkest
          side of the sunniest place in America, in the middle of a criminal
          conspiracy stretching across the state of Leonida — forced to rely on
          each other more than ever if they want to make it out alive.
        </p>
      </div>
    </section>
  );
};

export default IntroSection;
