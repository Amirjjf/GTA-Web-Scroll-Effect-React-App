import React, { useEffect, useRef, useState } from 'react';

const FRAME_COUNT = 45;
const FRAME_PATH = '/Lucia_Caminos_Video_Clip/output_';
const FRAME_EXT = '.png';

function LuciaVideo() {
    const [images, setImages] = useState([]);
    const currentFrameRef = useRef(0); // Use ref for smooth animation
    const targetFrameRef = useRef(0);
    const rafRef = useRef(null);
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    // Track the last drawn frame index for accurate debugger display
    const [drawnFrame, setDrawnFrame] = useState(0);

    // Preload
    useEffect(() => {
        const loadedImages = [];
        let loaded = 0;
        for (let i = 1; i <= FRAME_COUNT; i++) {
            const img = new window.Image();
            const paddedIndex = String(i).padStart(4, '0');
            img.src = FRAME_PATH + paddedIndex + FRAME_EXT;
            img.onload = () => {
                loaded++;
                if (loaded === FRAME_COUNT) setImages(loadedImages);
            };
            loadedImages.push(img);
        }
        // Fallback in case onload doesn't fire for all
        setTimeout(() => setImages(loadedImages), 2000);
    }, []);

    // Animation loop for smooth frame interpolation and canvas drawing
    useEffect(() => {
        const draw = () => {
            if (!canvasRef.current || images.length === 0) return;
            const ctx = canvasRef.current.getContext('2d');
            // Clamp frame index to valid range
            let frameIdx = Math.round(currentFrameRef.current);
            frameIdx = Math.max(0, Math.min(images.length - 1, frameIdx));
            setDrawnFrame(frameIdx); // Update state with the actual drawn frame
            const img = images[frameIdx];
            if (img && img.complete && img.naturalWidth > 0) {
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                const ratio = Math.min(
                    canvasRef.current.width / img.width,
                    canvasRef.current.height / img.height
                );
                const w = img.width * ratio;
                const h = img.height * ratio;
                ctx.drawImage(
                    img,
                    (canvasRef.current.width - w) / 2,
                    (canvasRef.current.height - h) / 2,
                    w,
                    h
                );
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
        return () => rafRef.current && cancelAnimationFrame(rafRef.current);
    }, [images]);

    // Scroll listener
    useEffect(() => {
        const onScroll = () => {
            if (!containerRef.current) return;
            const scrollTop = window.scrollY - containerRef.current.offsetTop;
            const scrollHeight = containerRef.current.offsetHeight - window.innerHeight;
            const progress = Math.max(0, Math.min(1, scrollTop / scrollHeight));
            targetFrameRef.current = progress * (FRAME_COUNT - 1);
        };
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Responsive canvas size
    useEffect(() => {
        const resize = () => {
            if (!canvasRef.current) return;
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);

    return (
        <div ref={containerRef} style={{ height: '300vh', position: 'relative' }}>
            {/* Debugger overlay for current frame */}
            <div style={{
                position: 'fixed',
                top: 10,
                left: 10,
                zIndex: 1000,
                background: 'rgba(0,0,0,0.7)',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '1.1rem',
                pointerEvents: 'none',
                userSelect: 'none',
            }}>
                Frame: {drawnFrame + 1} / {FRAME_COUNT}
            </div>
            <div style={{
                position: 'sticky', top: 0, width: '100%', height: '100vh', background: '#000',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <canvas
                    ref={canvasRef}
                    style={{ width: '100vw', height: '100vh', display: 'block', background: '#000' }}
                />
            </div>
        </div>
    );
}

export default LuciaVideo;