import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./JasonSection.css";

gsap.registerPlugin(ScrollTrigger);

const JasonSection = ({ onImageLoaded }) => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const rightImagesRef = useRef(null);
  const [img1Loaded, setImg1Loaded] = useState(false);
  const [img2Loaded, setImg2Loaded] = useState(false);
  const [img3Loaded, setImg3Loaded] = useState(false);

  useEffect(() => {
    if (img1Loaded && img2Loaded && img3Loaded && typeof onImageLoaded === 'function') {
      onImageLoaded();
    }
  }, [img1Loaded, img2Loaded, img3Loaded, onImageLoaded]);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const rightImages = rightImagesRef.current;

    if (!section || !content) return;

    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;

    gsap.set(content, {
      opacity: 0,
      y: 50,
    });

    if (rightImages) {
      gsap.set(rightImages, {
        y: 0,
      });
    }

    const fadeInTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top 80%",
      end: "top 20%",
      pin: false,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.set(content, {
          opacity: progress,
          y: 50 - progress * 50,
        });
      },
    });

    const parallaxTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      pin: false,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        if (rightImages) {
          let parallaxDistance;
          if (isSmallMobile) {
            parallaxDistance = -80;
          } else if (isMobile) {
            parallaxDistance = -120;
          } else {
            parallaxDistance = -200;
          }
          gsap.set(rightImages, {
            y: progress * parallaxDistance,
          });
        }
      },
    });

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      fadeInTrigger.kill();
      parallaxTrigger.kill();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section ref={sectionRef} className="jason-section">
      <div ref={contentRef} className="jason-introduction">
        <div className="jason-text-content">
          <h1>Jason Duval</h1>
          <h3>Jason's always been good at finding opportunity in chaos.</h3>
          <p>
            A seasoned criminal with a knack for making the right connections and 
            wrong enemies. Jason knows the streets like the back of his hand, and 
            he's not afraid to get them dirty when the job calls for it.
          </p>
        </div>
        <img
          src="Jason_Duval_01.jpg"
          alt="Jason Duval Portrait 1"
          className="jason-image-left"
          onLoad={() => setImg1Loaded(true)}
        />
        <div className="jason-images-right" ref={rightImagesRef}>
          <img src="Jason_Duval_02.jpg" alt="Jason Duval Portrait 2" onLoad={() => setImg2Loaded(true)} />
          <img src="Jason_Duval_03.jpg" alt="Jason Duval Portrait 3" onLoad={() => setImg3Loaded(true)} />
        </div>
      </div>
    </section>
  );
};

export default JasonSection;