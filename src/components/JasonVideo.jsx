import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const FRAME_START = 14;
const FRAME_END = 70;
const FRAME_COUNT = FRAME_END - FRAME_START + 1;
const FRAME_PATH = "/Jason_Video/output_";
const FRAME_EXT = ".jpg";

function JasonVideo({
  show = false,
  isBlurred = true,
  progress = 0,
  scrollProgress = 0,
  visibility = 1,
  onLoaded = () => {},
  setLoadingProgress = null,
}) {
  const [images, setImages] = useState([]);
  const [videoBlur, setVideoBlur] = useState(10);
  const [zoomScale, setZoomScale] = useState(1);
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const rafRef = useRef(null);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadedImages = new Array(FRAME_COUNT).fill(null);
    let loaded = 0;
    let cancelled = false;

    for (let i = FRAME_START; i <= FRAME_END; i++) {
      const img = new window.Image();
      const paddedIndex = String(i).padStart(4, "0");
      img.src = FRAME_PATH + paddedIndex + FRAME_EXT;

      img.onload = () => {
        loadedImages[i - FRAME_START] = img;
        loaded++;
        if (setLoadingProgress)
          setLoadingProgress(Math.round((loaded / FRAME_COUNT) * 100));
        if (loaded === FRAME_COUNT && !cancelled) {
          setImages([...loadedImages]);
          onLoaded();
        }
      };

      img.onerror = () => {
        console.error(`Failed to load frame ${i}: ${img.src}`);
        loadedImages[i - FRAME_START] = null;
        loaded++;
        if (setLoadingProgress)
          setLoadingProgress(Math.round((loaded / FRAME_COUNT) * 100));
        if (loaded === FRAME_COUNT && !cancelled) {
          setImages([...loadedImages]);
          onLoaded();
        }
      };
    }

    setTimeout(() => {
      if (loaded < FRAME_COUNT && !cancelled) {
        console.warn(
          `Only ${loaded}/${FRAME_COUNT} frames loaded after timeout`
        );
        setImages([...loadedImages]);
        onLoaded();
      }
    }, 5000);

    return () => {
      cancelled = true;
    };
  }, [onLoaded, setLoadingProgress]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (show) {
      container.style.opacity = visibility;
      container.style.visibility = "visible";
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
      container.style.opacity = 0;
      container.style.visibility = "hidden";
      setVideoBlur(10);
    }
  }, [show, isBlurred, videoBlur, visibility]);

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
        ctx.filter = `blur(${videoBlur}px)`;
        const canvasAspect = canvasRef.current.width / canvasRef.current.height;
        const imgAspect = img.naturalWidth / img.naturalHeight;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasAspect > imgAspect) {
          drawWidth = canvasRef.current.width * zoomScale;
          drawHeight = drawWidth / imgAspect;
          offsetX = (canvasRef.current.width - drawWidth) / 2;
          offsetY = (canvasRef.current.height - drawHeight) / 2;
        } else {
          drawHeight = canvasRef.current.height * zoomScale;
          drawWidth = drawHeight * imgAspect;
          offsetX = (canvasRef.current.width - drawWidth) / 2;
          offsetY = (canvasRef.current.height - drawHeight) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      } else {
        ctx.fillStyle = "#111117";
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    };
    const animate = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.01) {
        currentFrameRef.current += diff * 0.35;
      } else {
        currentFrameRef.current = targetFrameRef.current;
      }
      draw();
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [images, videoBlur, zoomScale]);

  useEffect(() => {
    const targetFrame = progress * (FRAME_COUNT - 1);
    targetFrameRef.current = targetFrame;
    const currentGap = Math.abs(targetFrame - currentFrameRef.current);
    if (currentGap < 0.5) {
      currentFrameRef.current = targetFrame;
    }
    if (!show && progress === 0) {
      targetFrameRef.current = 0;
      currentFrameRef.current = 0;
    }
  }, [show, progress]);

  useEffect(() => {
    if (scrollProgress >= 0.7) {
      const zoomProgress = (scrollProgress - 0.7) / 0.3;
      const calculatedZoom = 1 + zoomProgress * 0.05;
      setZoomScale(calculatedZoom);
    } else {
      setZoomScale(1);
    }
  }, [scrollProgress]);

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
      className="jason-video-container"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: show ? 50 : -1,
        opacity: 0,
        backgroundColor: "#111117",
        pointerEvents: show ? "auto" : "none",
        visibility: show ? "visible" : "hidden",
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
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
    </div>
  );
}

export default JasonVideo;
