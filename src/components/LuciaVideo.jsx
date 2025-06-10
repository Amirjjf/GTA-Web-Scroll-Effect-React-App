import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./LuciaVideo.css";

const FRAME_COUNT = 45;
const FRAME_PATH = "/Lucia_Caminos_Video_Clip/output_";
const FRAME_EXT = ".jpg";

function LuciaVideo({ show = false, isBlurred = true, progress = 0 }) {
  const [images, setImages] = useState([]);
  const [videoBlur, setVideoBlur] = useState(10);
  const currentFrameRef = useRef(0); // Use ref for smooth animation
  const targetFrameRef = useRef(0);
  const rafRef = useRef(null);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  // Track the last drawn frame index for accurate debugger display
  // const [drawnFrame, setDrawnFrame] = useState(0);    // Preload
  // const [loadingProgress, setLoadingProgress] = useState(0);
  // const [allLoaded, setAllLoaded] = useState(false); // Track if all images are loaded
  useEffect(() => {
    const loadedImages = new Array(FRAME_COUNT).fill(null);
    let loaded = 0;
    let cancelled = false;

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new window.Image();
      const paddedIndex = String(i).padStart(4, "0");
      img.src = FRAME_PATH + paddedIndex + FRAME_EXT;

      img.onload = () => {
        loadedImages[i - 1] = img; // Store in correct position
        loaded++;
        // setLoadingProgress(Math.round((loaded / FRAME_COUNT) * 100));
        if (loaded === FRAME_COUNT && !cancelled) {
          setImages([...loadedImages]); // Create new array to trigger re-render
          // setAllLoaded(true);
        }
      };

      img.onerror = () => {
        console.error(`Failed to load frame ${i}: ${img.src}`);
        loaded++; // Still increment to prevent hanging
        // setLoadingProgress(Math.round((loaded / FRAME_COUNT) * 100));
        if (loaded === FRAME_COUNT && !cancelled) {
          setImages([...loadedImages]);
          // setAllLoaded(true);
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
        // setAllLoaded(true);
      }
    }, 5000);
    return () => {
      cancelled = true;
    };
  }, []); // Handle visibility and blur based on props

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (show) {
      // Animate video in with GSAP
      gsap.to(container, {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      });
      // Animate blur separately
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
      // Faster fade out to prevent conflicts with IntroSection
      gsap.to(container, {
        opacity: 0,
        duration: 0.3, // Reduced from 0.8s to 0.3s for faster hiding
        ease: "power2.out",
      });
      setVideoBlur(10);
    }
  }, [show, isBlurred, videoBlur]);

  // Animation loop for smooth frame interpolation and canvas drawing
  useEffect(() => {
    if (images.length === 0) return;    const draw = () => {
      if (!canvasRef.current || images.length === 0) return;
      const ctx = canvasRef.current.getContext("2d");
      let frameIdx = Math.round(currentFrameRef.current);
      frameIdx = Math.max(0, Math.min(images.length - 1, frameIdx));
      
      // Debug logging - only log occasionally to avoid spam
      if (Math.random() < 0.05) { // Log ~5% of frames
        console.log("Drawing: currentFrame =", currentFrameRef.current.toFixed(2), "| frameIdx =", frameIdx, "| actualFrame =", frameIdx + 1, "| imgSrc =", images[frameIdx]?.src?.split('/').pop() || 'null');
      }
      
      const img = images[frameIdx];
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // Apply blur filter
        ctx.filter = `blur(${videoBlur}px)`;

        // --- COVER LOGIC: draw image to cover canvas ---
        const canvasW = canvasRef.current.width;
        const canvasH = canvasRef.current.height;
        const imgW = img.width;
        const imgH = img.height;
        const scale = Math.max(canvasW / imgW, canvasH / imgH);
        const drawW = imgW * scale;
        const drawH = imgH * scale;
        const offsetX = (canvasW - drawW) / 2;
        const offsetY = (canvasH - drawH) / 2;
        ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

        // Reset filter
        ctx.filter = "none";
      } else {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    };

    const animate = () => {
      // Interpolate currentFrameRef toward targetFrameRef (faster for less lag)
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.01) {
        currentFrameRef.current += diff * 0.35; // Increase speed for more responsiveness
      } else {
        currentFrameRef.current = targetFrameRef.current;
      }
      draw();
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);  }, [images, videoBlur]);
  // Update frame based on progress prop
  useEffect(() => {
    // Calculate target frame based on progress (0 to 1)
    const targetFrame = progress * (FRAME_COUNT - 1);
    targetFrameRef.current = targetFrame;
    
    // Only reset to 0 if both show is false AND progress is 0
    if (!show && progress === 0) {
      targetFrameRef.current = 0;
    }
    
    console.log("LuciaVideo: progress =", progress, "| targetFrame =", targetFrame, "| rounded =", Math.round(targetFrame), "| actualFrame =", Math.round(targetFrame) + 1, "| show =", show);
  }, [show, progress]);

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
  }, []);  return (
    <div
      ref={containerRef}
      className="lucia-video-container"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: show ? 50 : 25, // Lower z-index when not showing to prevent conflicts
        opacity: 0,
        backgroundColor: "#111117",
        pointerEvents: show ? "auto" : "none",
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
      >        <canvas
          ref={canvasRef}
          style={{
            width: "100vw",
            height: "100vh",
            display: "block",
            background: "#111117",
            transition: "filter 0.8s ease-out",
          }}
        />
        {/* Debug overlay to show current frame info */}
        {/* <div style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          color: "white",
          background: "rgba(0, 0, 0, 0)",
          padding: "10px",
          borderRadius: "5px",
          fontFamily: "monospace",
          fontSize: "12px",
          zIndex: 1000,
          lineHeight: "1.4"
        }}>
          Progress: {progress.toFixed(3)}<br/>
          Target Frame: {(progress * (FRAME_COUNT - 1)).toFixed(1)}<br/>
          Current Frame: {currentFrameRef.current.toFixed(1)}<br/>
          Display Frame: {Math.round(currentFrameRef.current) + 1} / {FRAME_COUNT}<br/>
          Loaded Images: {images.length}
        </div> */}
      </div>
    </div>
  );
}

export default LuciaVideo;
