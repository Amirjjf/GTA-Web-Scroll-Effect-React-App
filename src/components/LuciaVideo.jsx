import React, { useEffect, useRef, useState } from 'react';

// CONFIG
const FRAME_PATH = '/Lucia_Caminos_Video_Clip/output_';
const FRAME_EXT = '.png';
const FRAME_DIGITS = 4; // e.g., 0001
const FRAME_COUNT = 45; // Set to your actual frame count (update if more frames are added)
const SCROLL_HEIGHT = 10; // in vh, very short for ultra-smooth playback

function pad(num, size) {
    let s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
}

const LuciaVideo = () => {
    const [loaded, setLoaded] = useState(0);
    const [isReady, setIsReady] = useState(false);
    const [images, setImages] = useState([]);
    const [currentFrame, setCurrentFrame] = useState(0);
    const lastFrameRef = useRef(0);
    const containerRef = useRef(null);

    // Preload all frames
    useEffect(() => {
        let isMounted = true;
        const imgs = [];
        let loadedCount = 0;
        for (let i = 1; i <= FRAME_COUNT; i++) {
            const img = new window.Image();
            img.src = `${FRAME_PATH}${pad(i, FRAME_DIGITS)}${FRAME_EXT}`;
            img.onload = () => {
                loadedCount++;
                if (isMounted) setLoaded(loadedCount);
                if (loadedCount === FRAME_COUNT && isMounted) {
                    setIsReady(true);
                }
            };
            img.onerror = () => {
                loadedCount++;
                if (isMounted) setLoaded(loadedCount);
            };
            imgs.push(img);
        }
        setImages(imgs);
        return () => { isMounted = false; };
    }, []);    // Scroll-driven frame update
    useEffect(() => {
        if (!isReady || !containerRef.current) return;

        const handleScroll = () => {
            const container = containerRef.current;
            const containerRect = container.getBoundingClientRect();
            const containerHeight = container.offsetHeight;
            const viewportHeight = window.innerHeight;
            let progress = 0;
            // Progress goes from 0 (when top of container hits bottom of viewport)
            // to 1 (when bottom of container hits top of viewport)
            if (containerHeight > 0) {
                const start = viewportHeight;
                const end = -containerHeight;
                progress = (containerRect.top - end) / (start - end);
                progress = Math.max(0, Math.min(1, progress));
            }
            const frameFloat = progress * (FRAME_COUNT - 1);
            const frame = Math.round(frameFloat);
            if (frame !== lastFrameRef.current) {
                setCurrentFrame(frame);
                lastFrameRef.current = frame;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll);
        handleScroll();
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, [isReady]);    return (
        <div ref={containerRef} style={{ height: `${SCROLL_HEIGHT}vh`, position: 'relative' }}>
            <div
                style={{
                    position: 'sticky',
                    top: 0,
                    height: '100vh',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#000',
                }}
            >
                {!isReady ? (
                    <div style={{ color: 'white', textAlign: 'center' }}>
                        <div>Loading frames...</div>
                        <div>{Math.round((loaded / FRAME_COUNT) * 100)}%</div>
                    </div>                ) : (
                    images[currentFrame] && (
                        <>
                            <img
                                src={images[currentFrame].src}
                                alt={`Frame ${currentFrame + 1}`}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100vh',
                                    objectFit: 'contain',
                                    background: '#000',
                                    userSelect: 'none',
                                    pointerEvents: 'none',
                                }}
                                draggable={false}
                            />
                            {/* Debug frame counter */}
                            <div style={{
                                position: 'absolute',
                                top: '20px',
                                left: '20px',
                                color: 'white',
                                background: 'rgba(0,0,0,0.7)',
                                padding: '5px 10px',
                                borderRadius: '5px',
                                fontSize: '14px'
                            }}>
                                Frame: {currentFrame + 1} / {FRAME_COUNT}
                            </div>
                        </>
                    )
                )}
            </div>
        </div>
    );
};

export default LuciaVideo;