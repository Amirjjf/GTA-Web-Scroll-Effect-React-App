import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./LogoVideo.css";

const FRAME_COUNT = 167;
const FRAME_PATH = "/LogoVideo/output_";
const FRAME_EXT = ".jpg";

function LogoVideo({
  show = false,
  progress = 0,
  visibility = 1,
  onLoaded = () => {},
  setLoadingProgress = null,
}) {
  const [images, setImages] = useState([]);
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const rafRef = useRef(null);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadedImages = new Array(FRAME_COUNT).fill(null);
    let loaded = 0;
    let cancelled = false;

    for (let i = 76; i <= 242; i++) {
      const img = new window.Image();
      const paddedIndex = String(i).padStart(4, "0");
      img.src = FRAME_PATH + paddedIndex + FRAME_EXT;

      img.onload = () => {
        loadedImages[i - 76] = img;
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

    gsap.to(container, {
      opacity: visibility,
      duration: 0.3,
      ease: "power2.out",
    });
  }, [show, visibility]);

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
      } else {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
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
  }, [images]);

  useEffect(() => {
    const targetFrame = progress * (FRAME_COUNT - 1);
    targetFrameRef.current = targetFrame;
    if (!show && progress === 0) {
      targetFrameRef.current = 0;
    }
  }, [show, progress]);

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
      className="logo-video-container"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: show ? 50 : 25,
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
      >
        <canvas
          ref={canvasRef}
          style={{
            width: "100vw",
            height: "100vh",
            display: "block",
            background: "#111117",
          }}
          draggable="false"
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
    </div>
  );
}

export default LogoVideo;
