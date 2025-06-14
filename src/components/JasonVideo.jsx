import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const FRAME_COUNT = 51;
const FRAME_PATH = "/Jason_Video/output_";
const FRAME_EXT = ".png";

function JasonVideo({ show = false, isBlurred = true, progress = 0, scrollProgress = 0, visibility = 1 }) {
  const [images, setImages] = useState([]);
  const [videoBlur, setVideoBlur] = useState(10);
  const [zoomScale, setZoomScale] = useState(1); // Add zoom scale state
  const currentFrameRef = useRef(0); // Use ref for smooth animation
  const targetFrameRef = useRef(0);
  const rafRef = useRef(null);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Preload images
  useEffect(() => {
    const loadedImages = new Array(FRAME_COUNT).fill(null);
    let loaded = 0;
    let cancelled = false;

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new window.Image();
      const paddedIndex = String(i).padStart(4, "0");
      img.src = FRAME_PATH + paddedIndex + FRAME_EXT;

      img.onload = () => {
        loadedImages[i - 1] = img;
        loaded++;
        if (loaded === FRAME_COUNT && !cancelled) {
          setImages([...loadedImages]);
        }
      };

      img.onerror = () => {
        console.error(`Failed to load frame ${i}: ${img.src}`);
        loaded++;
        if (loaded === FRAME_COUNT && !cancelled) {
          setImages([...loadedImages]);
        }
      };
    }

    // Fallback in case some images don't load
    setTimeout(() => {
      if (loaded < FRAME_COUNT && !cancelled) {
        console.warn(
          `Only ${loaded}/${FRAME_COUNT} frames loaded after timeout`
        );
        setImages([...loadedImages]);
      }
    }, 5000);

    return () => {
      cancelled = true;
    };
  }, []);
  // Handle visibility and blur based on props
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;    if (show) {
      // Set opacity and visibility directly without animation for instant response
      container.style.opacity = visibility;
      container.style.visibility = 'visible';
      
      // Animate blur separately (keep this smooth)
      gsap.to(
        { blur: videoBlur },
        {
          blur: isBlurred ? 8 : 0,
          duration: 0.8,
          ease: "power2.out",
          onUpdate: function () {
            setVideoBlur(this.targets()[0].blur);
          },
        }
      );
    } else {
      // Instant hide to prevent border visibility
      container.style.opacity = 0;
      container.style.visibility = 'hidden';
      setVideoBlur(10);
    }
  }, [show, isBlurred, videoBlur, visibility]);

  // Animation loop for smooth frame interpolation and canvas drawing
  useEffect(() => {
    if (images.length === 0) return;

    const draw = () => {
      if (!canvasRef.current || images.length === 0) return;
      const ctx = canvasRef.current.getContext("2d");
      let frameIdx = Math.round(currentFrameRef.current);
      frameIdx = Math.max(0, Math.min(images.length - 1, frameIdx));
      
      const img = images[frameIdx];
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // Apply blur filter
        ctx.filter = `blur(${videoBlur}px)`;
          // Calculate scaling to cover the canvas while maintaining aspect ratio
        const canvasAspect = canvasRef.current.width / canvasRef.current.height;
        const imgAspect = img.naturalWidth / img.naturalHeight;
        
        let drawWidth, drawHeight, offsetX, offsetY;
        
        if (canvasAspect > imgAspect) {
          // Canvas is wider than image - fit to width
          drawWidth = canvasRef.current.width * zoomScale; // Apply zoom
          drawHeight = (drawWidth / imgAspect);
          offsetX = (canvasRef.current.width - drawWidth) / 2; // Center the zoomed image
          offsetY = (canvasRef.current.height - drawHeight) / 2;
        } else {
          // Canvas is taller than image - fit to height
          drawHeight = canvasRef.current.height * zoomScale; // Apply zoom
          drawWidth = drawHeight * imgAspect;
          offsetX = (canvasRef.current.width - drawWidth) / 2; // Center the zoomed image
          offsetY = (canvasRef.current.height - drawHeight) / 2;
        }
        
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      } else {
        // Fill with background color if image not ready        ctx.fillStyle = "#111117";
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    };    const animate = () => {
      // Ultra-fast frame snapping for maximum smoothness
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.01) {
        currentFrameRef.current += diff * 0.35; // Almost instant snapping
      } else {
        currentFrameRef.current = targetFrameRef.current; // Direct assignment for tiny differences
      }
      draw();
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [images, videoBlur, zoomScale]); // Added zoomScale to dependencies// Update frame based on progress prop
  useEffect(() => {
    // Calculate target frame based on progress (0 to 1)
    const targetFrame = progress * (FRAME_COUNT - 1);
    
    // Direct assignment for ultra-responsive frame changes
    targetFrameRef.current = targetFrame;
    
    // For very close frames, snap immediately
    const currentGap = Math.abs(targetFrame - currentFrameRef.current);
    if (currentGap < 0.5) {
      currentFrameRef.current = targetFrame; // Instant snap for very small changes
    }
    
    // Only reset to 0 if both show is false AND progress is 0
    if (!show && progress === 0) {
      targetFrameRef.current = 0;
      currentFrameRef.current = 0; // Also snap current frame to 0
    }  }, [show, progress]);
  // Calculate zoom effect based on scrollProgress (zoom in from 70% to 100%)
  useEffect(() => {
    if (scrollProgress >= 0.7) {
      // Progress from 0.7 to 1.0 maps to zoom from 1.0 to 1.15 (15% zoom)
      const zoomProgress = (scrollProgress - 0.7) / 0.3; // 0 to 1 for the zoom range
      const calculatedZoom = 1 + (zoomProgress * 0.05); // 1.0 to 1.15
      setZoomScale(calculatedZoom);
    } else {
      setZoomScale(1); // No zoom below 70% progress
    }
  }, [scrollProgress]);

  // Responsive canvas size
  useEffect(() => {
    const resize = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div
      ref={containerRef}
      className="jason-video-container"      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: show ? 50 : -1, // Negative z-index when not showing to completely hide
        opacity: 0,
        backgroundColor: "#111117",
        pointerEvents: show ? "auto" : "none",
        visibility: show ? "visible" : "hidden", // Additional layer of hiding
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "#111117",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: "100vw",
            height: "100vh",
            display: "block",
            background: "#111117",
            transition: "filter 0.8s ease-out",
          }}
          draggable="false"
          onContextMenu={e => e.preventDefault()}
        />
      </div>
    </div>
  );
}

export default JasonVideo;