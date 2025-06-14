import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import "./SlidingText.css";

gsap.registerPlugin(ScrollTrigger);

const SlidingText = ({ 
  leftText = " Why Are We Still Here ",
  rightText = " Metal Gear Solid Legacy ",
  title = "Experience the",
  highlightedText = "Metal Gear Legacy"
}) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  useEffect(() => {
    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const section = sectionRef.current;
      const title = titleRef.current;
      const leftSlider = section?.querySelector('.left-slider');
      const rightSlider = section?.querySelector('.right-slider');
      const textStrong = title?.querySelector('.text-strong');

      if (!section || !title || !leftSlider || !rightSlider || !textStrong) {
        console.log('Missing elements:', { section, title, leftSlider, rightSlider, textStrong });
        return;
      }

      // Create title fade and gradient animation
      const titleTimeline = gsap.timeline({ defaults: { ease: "none" } });
      titleTimeline
        .from(title, { opacity: 0, duration: 2 })
        .to(textStrong, { backgroundPositionX: "100%", duration: 1 });      const titleScrollTrigger = ScrollTrigger.create({
        trigger: section,
        start: "center bottom", 
        end: "center center",
        scrub: 0,
        animation: titleTimeline,
      });

      // Check for motion preference
      const hasMotionPreference = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
      
      let slidingScrollTrigger;
      if (hasMotionPreference) {
        // Create sliding animation with proper directions
        const slidingTimeline = gsap.timeline({ defaults: { ease: "none" } });
        const moveDistance = window.innerWidth < 768 ? 500 : 150;
        
        // Set initial positions
        gsap.set(rightSlider, { xPercent: -moveDistance });
        
        slidingTimeline
          .to(leftSlider, { xPercent: -moveDistance }) // Left slider moves left
          .to(rightSlider, { xPercent: 0 }, "<"); // Right slider moves from left to center

        slidingScrollTrigger = ScrollTrigger.create({
          trigger: section,
          start: "top bottom",
          end: "bottom top", 
          scrub: 0,
          animation: slidingTimeline,
        });
      }

      // Cleanup function
      return () => {
        titleScrollTrigger?.kill();
        slidingScrollTrigger?.kill();
      };
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const repeatedText = (text) => text.repeat(5);

  return (
    <section 
      ref={sectionRef} 
      className="sliding-section"
    >
      <p className="left-slider sliding-text">
        {repeatedText(leftText)}
      </p>
      
      <h1 ref={titleRef} className="title">
        {title} <span className="text-strong">{highlightedText}</span>
      </h1>
      
      <p className="right-slider sliding-text">
        {repeatedText(rightText)}
      </p>
    </section>
  );
};

export default SlidingText;