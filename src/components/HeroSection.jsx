import React, { useEffect, useRef, useState } from "react";
import { logoData } from "./logo.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "./HeroSection.css";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = ({ onImageLoaded }) => {
  const heroRef = useRef(null);
  const heroImgContainerRef = useRef(null);
  const heroImgLogoRef = useRef(null);
  const heroImgCopyRef = useRef(null);
  const fadeOverlayRef = useRef(null);
  const svgOverlayRef = useRef(null);
  const overlayCopyRef = useRef(null);
  const logoMaskRef = useRef(null);
  const lenisRef = useRef(null);
  const blackTransitionRef = useRef(null);
  const [bgLoaded, setBgLoaded] = useState(false);
  const [charactersLoaded, setCharactersLoaded] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.8,
      easing: "easeInOutQuad",
      smoothWheel: true,
      smoothTouch: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
    const heroImgContainer = heroImgContainerRef.current;
    const heroImgLogo = heroImgLogoRef.current;
    const heroImgCopy = heroImgCopyRef.current;
    const fadeOverlay = fadeOverlayRef.current;
    const svgOverlay = svgOverlayRef.current;
    const overlayCopy = overlayCopyRef.current;
    const blackTransition = blackTransitionRef.current;

    const initialOverlayScale = 350;
    const logoMask = logoMaskRef.current;
    logoMask.setAttribute("d", logoData);

    function updateLogoPosition() {
      const svgEl = svgOverlay.querySelector("svg");
      if (!svgEl) return;

      const vb = svgEl.viewBox.baseVal;
      if (!vb || vb.width === 0 || vb.height === 0) return;

      const vbWidth = vb.width;
      const vbHeight = vb.height;
      const fixedCenterX = vbWidth / 2;
      const fixedCenterY = vbHeight * 0.12;

      const logoBoundingBox = logoMask.getBBox();
      if (
        !logoBoundingBox ||
        logoBoundingBox.width === 0 ||
        logoBoundingBox.height === 0
      ) {
        logoMask.removeAttribute("transform");
        return;
      }
      const targetWidth = Math.min(200, vbWidth * 0.2);
      const targetHeight = Math.min(150, vbHeight * 0.15);

      const horizontalScaleRatio = targetWidth / logoBoundingBox.width;
      const verticalScaleRatio = targetHeight / logoBoundingBox.height;

      let logoScaleFactor = Math.min(horizontalScaleRatio, verticalScaleRatio);

      if (!isFinite(logoScaleFactor) || logoScaleFactor < 0) {
        logoScaleFactor = 0;
      }

      const logoCenterX =
        (logoBoundingBox.x + logoBoundingBox.width / 2) * logoScaleFactor;
      const logoCenterY =
        (logoBoundingBox.y + logoBoundingBox.height / 2) * logoScaleFactor;
      const horizontalPosition = fixedCenterX - logoCenterX;
      const verticalPosition = fixedCenterY - logoCenterY;

      logoMask.setAttribute(
        "transform",
        `translate(${horizontalPosition}, ${verticalPosition}) scale(${logoScaleFactor})`
      );
    }

    updateLogoPosition();
    window.addEventListener("resize", updateLogoPosition);
    let prevScrollProgress = 0;
    let isScrollingUp = false;
    ScrollTrigger.create({
      trigger: heroRef.current,
      start: "top top",
      end: `${window.innerHeight * 5}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const scrollProgress = self.progress;
        isScrollingUp = scrollProgress < prevScrollProgress;
        prevScrollProgress = scrollProgress;
        const fadeOpacity = 1 - scrollProgress * (1 / 0.15);
        if (scrollProgress < 0.15) {
          gsap.set([heroImgLogo, heroImgCopy], {
            opacity: fadeOpacity,
          });
        } else {
          gsap.set([heroImgLogo, heroImgCopy], {
            opacity: 0,
          });
        }
        if (scrollProgress < 0.85) {
          const normalizedProgress = scrollProgress * (1 / 0.85);
          const heroImgContainerScale = 1.5 - 0.5 * normalizedProgress;
          const overlayScale =
            initialOverlayScale *
            Math.pow(1 / initialOverlayScale, normalizedProgress);
          let fadeoverlayOpacity = 0;
          gsap.set(heroImgContainer, {
            scale: heroImgContainerScale,
            opacity: 1,
          });
          gsap.set(svgOverlay, {
            scale: overlayScale,
            opacity: 1,
          });
          if (scrollProgress > 0.25) {
            fadeoverlayOpacity = Math.min(
              1,
              (scrollProgress - 0.25) * (1 / 0.4)
            );
          }
          gsap.set(fadeOverlay, {
            opacity: fadeoverlayOpacity,
          });
        }

        if (scrollProgress > 0.7 && scrollProgress < 0.85) {
          const overlayCopyRevealProgress = Math.min(
            1,
            (scrollProgress - 0.7) * (1 / 0.1)
          );
          const overlayCopyScaleProgress = (scrollProgress - 0.7) * (1 / 0.15);
          const overlayCopyScale = 1.25 - 0.25 * overlayCopyScaleProgress;
          const createDynamicGradient = (progress) => {
            const normalizedProgress = (progress - 0.7) / 0.15;
            const baseColors = [
              { r: 255, g: 68, b: 168 },
              { r: 255, g: 119, b: 169 },
              { r: 255, g: 20, b: 147 },
              { r: 255, g: 105, b: 180 },
              { r: 255, g: 215, b: 0 },
              { r: 255, g: 223, b: 0 },
              { r: 255, g: 140, b: 0 },
              { r: 255, g: 68, b: 168 },
            ];
            const movement = normalizedProgress * 40;
            const angle = 45 + normalizedProgress * 90;

            const colorShiftFactor = normalizedProgress * 1.5;

            const shiftColor = (color, factor) => {
              const brightnessBoost = 1 + factor * 0.8;
              const saturationBoost = 1 + factor * 0.5;

              return {
                r: Math.min(255, Math.round(color.r * brightnessBoost)),
                g: Math.min(255, Math.round(color.g * saturationBoost)),
                b: Math.min(255, Math.round(color.b * brightnessBoost)),
              };
            };

            const shiftedColors = baseColors.map((color) =>
              shiftColor(color, colorShiftFactor)
            );
            return `linear-gradient(${angle}deg,
              rgb(${shiftedColors[0].r}, ${shiftedColors[0].g}, ${
              shiftedColors[0].b
            }) ${-movement + 0}%, 
              rgb(${shiftedColors[1].r}, ${shiftedColors[1].g}, ${
              shiftedColors[1].b
            }) ${-movement + 12}%, 
              rgb(${shiftedColors[2].r}, ${shiftedColors[2].g}, ${
              shiftedColors[2].b
            }) ${-movement + 24}%, 
              rgb(${shiftedColors[3].r}, ${shiftedColors[3].g}, ${
              shiftedColors[3].b
            }) ${-movement + 36}%, 
              rgb(${shiftedColors[4].r}, ${shiftedColors[4].g}, ${
              shiftedColors[4].b
            }) ${-movement + 48}%, 
              rgb(${shiftedColors[5].r}, ${shiftedColors[5].g}, ${
              shiftedColors[5].b
            }) ${-movement + 60}%, 
              rgb(${shiftedColors[6].r}, ${shiftedColors[6].g}, ${
              shiftedColors[6].b
            }) ${-movement + 72}%, 
              rgb(${shiftedColors[7].r}, ${shiftedColors[7].g}, ${
              shiftedColors[7].b
            }) ${-movement + 84}%, 
              rgb(${shiftedColors[0].r}, ${shiftedColors[0].g}, ${
              shiftedColors[0].b
            }) ${-movement + 96}%, 
              rgb(${shiftedColors[1].r}, ${shiftedColors[1].g}, ${
              shiftedColors[1].b
            }) ${-movement + 108}%, 
              rgb(${shiftedColors[2].r}, ${shiftedColors[2].g}, ${
              shiftedColors[2].b
            }) ${-movement + 120}%)`;
          };

          overlayCopy.style.background = createDynamicGradient(scrollProgress);
          overlayCopy.style.backgroundClip = "text";
          overlayCopy.style.webkitTextFillColor = "transparent";
          gsap.set(overlayCopy, {
            scale: overlayCopyScale,
            opacity: overlayCopyRevealProgress,
          });
        } else if (scrollProgress <= 0.7) {
          gsap.set(overlayCopy, {
            opacity: 0,
          });
        }
        if (scrollProgress > 0.85) {
          const overallTransitionProgress = (scrollProgress - 0.85) / 0.15;

          if (isScrollingUp) {
            gsap.set(blackTransition, { opacity: 1 });
            gsap.set([heroImgContainer, fadeOverlay], { opacity: 0 });
          } else {
            let calculatedBlackOverlayOpacity = 0;
            const blackTransitionRampUpEndProgress = (0.92 - 0.85) / 0.15;
            if (overallTransitionProgress <= blackTransitionRampUpEndProgress) {
              calculatedBlackOverlayOpacity =
                overallTransitionProgress / blackTransitionRampUpEndProgress;
            } else {
              calculatedBlackOverlayOpacity = 1;
            }
            gsap.set(blackTransition, {
              opacity: Math.min(1, Math.max(0, calculatedBlackOverlayOpacity)),
            });

            const heroBackgroundElementsOpacity = 1 - overallTransitionProgress;
            gsap.set([heroImgContainer, fadeOverlay], {
              opacity: Math.min(1, Math.max(0, heroBackgroundElementsOpacity)),
            });
          }

          const svgLogoOpacity = 1 - Math.pow(overallTransitionProgress, 5);
          gsap.set(svgOverlay, {
            opacity: Math.min(1, Math.max(0, svgLogoOpacity)),
          });

          let textOverlayOpacity = 1;
          const textOverlayFadeStartScroll = 0.87;

          if (scrollProgress >= textOverlayFadeStartScroll) {
            const textFadeNormalizedProgress =
              (scrollProgress - textOverlayFadeStartScroll) /
              (1.0 - textOverlayFadeStartScroll);
            textOverlayOpacity = 1 - Math.pow(textFadeNormalizedProgress, 5);
          } else if (scrollProgress > 0.85) {
            textOverlayOpacity = 1;
          }
          gsap.set(overlayCopy, {
            opacity: Math.min(1, Math.max(0, textOverlayOpacity)),
          });
        } else {
          gsap.set(blackTransition, {
            opacity: 0,
          });
        }
      },
      onLeave: () => {
        gsap.set([heroImgLogo, heroImgCopy], { opacity: 1 });
        gsap.set(heroImgContainer, { scale: 1.5 });
        gsap.set(fadeOverlay, { opacity: 0 });
        gsap.set(svgOverlay, { scale: initialOverlayScale, opacity: 1 });
        gsap.set(overlayCopy, { opacity: 0, scale: 1.25 });
        gsap.set(blackTransition, { opacity: 0 });
      },
      onEnterBack: () => {
        gsap.set(fadeOverlay, { opacity: 0 });
        gsap.set(heroImgContainer, { opacity: 1, scale: 1 });
        gsap.set(blackTransition, { opacity: 1 });
        gsap.set(svgOverlay, { opacity: 0, scale: initialOverlayScale });
        gsap.set([heroImgLogo, heroImgCopy], { opacity: 0 });
        gsap.set(overlayCopy, { opacity: 0, scale: 1.25 });
      },
    });

    return () => {
      window.removeEventListener("resize", updateLogoPosition);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (bgLoaded && charactersLoaded && typeof onImageLoaded === "function") {
      onImageLoaded();
    }
  }, [bgLoaded, charactersLoaded, onImageLoaded]);

  return (
    <>
      <section className="hero" ref={heroRef}>
        <div className="hero-img-container" ref={heroImgContainerRef}>
          <img
            src="/BackgroundLarge.jpg"
            alt="Background"
            onLoad={() => setBgLoaded(true)}
          />

          <div className="hero-img-logo" ref={heroImgLogoRef}>
            <img src="/logo.svg" alt="logo" />
          </div>

          <img
            src="/CharactersLarge.png"
            id="Characters"
            alt="Characters"
            onLoad={() => setCharactersLoaded(true)}
          />

          <div className="hero-img-copy" ref={heroImgCopyRef}>
            <p>Scroll down to reveal</p>
          </div>
        </div>

        <div className="fade-overlay" ref={fadeOverlayRef}></div>
        <div
          className="black-transition-overlay"
          ref={blackTransitionRef}
        ></div>

        <div className="overlay" ref={svgOverlayRef}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1184 666"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <mask
                id="logoRevealMask"
                maskUnits="userSpaceOnUse"
                maskContentUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="1184"
                height="666"
              >
                <rect width="1184" height="666" fill="white" />
                <path id="logoMask" ref={logoMaskRef}></path>
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="#111117"
              mask="url(#logoRevealMask)"
            />
          </svg>
        </div>

        <div className="logo-container"></div>
        <div className="overlay-copy">
          <h1 ref={overlayCopyRef}>
            GTA VI <br /> Coming Soon
          </h1>{" "}
        </div>
      </section>
    </>
  );
};

export default HeroSection;
