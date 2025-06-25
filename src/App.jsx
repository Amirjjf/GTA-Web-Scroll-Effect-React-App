import React, { useState, useCallback } from 'react';
import HeroSection from './components/HeroSection';
import IntroSection from './components/IntroSection';
import LuciaVideoSection from './components/LuciaVideoSection';
import LuciaSection from './components/LuciaSection';
import JasonLuciaCover from './components/JasonLuciaCover';
import SlidingText from './components/SlidingText';
import JasonVideoSection from './components/JasonVideoSection';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import JasonSection from './components/JasonSection';

import './App.css';

function App() {
  const [luciaLoaded, setLuciaLoaded] = useState(false);
  const [jasonLoaded, setJasonLoaded] = useState(false);
  const [luciaProgress, setLuciaProgress] = useState(0);
  const [jasonProgress, setJasonProgress] = useState(0);
  const [heroImgLoaded, setHeroImgLoaded] = useState(false);
  const [coverImgLoaded, setCoverImgLoaded] = useState(false);
  const [luciaSectionLoaded, setLuciaSectionLoaded] = useState(false);
  const [jasonSectionLoaded, setJasonSectionLoaded] = useState(false);

  // Show loading screen until all are loaded
  const allLoaded = luciaLoaded && jasonLoaded && heroImgLoaded && coverImgLoaded && luciaSectionLoaded && jasonSectionLoaded;
  // Calculate total progress including all assets
  const assetProgress = [
    luciaProgress, // Lucia video (0-100)
    jasonProgress, // Jason video (0-100)
    heroImgLoaded ? 100 : 0, // Hero image (0 or 100)
    coverImgLoaded ? 100 : 0, // Cover image (0 or 100)
    luciaSectionLoaded ? 100 : 0, // Lucia section image (0 or 100)
    jasonSectionLoaded ? 100 : 0 // Jason section image (0 or 100)
  ];
  const totalProgress = Math.round(assetProgress.reduce((a, b) => a + b, 0) / assetProgress.length);

  // Use useCallback to avoid unnecessary re-renders
  const handleLuciaLoaded = useCallback(() => setLuciaLoaded(true), []);
  const handleJasonLoaded = useCallback(() => setJasonLoaded(true), []);
  const handleLuciaProgress = useCallback((p) => setLuciaProgress(p), []);
  const handleJasonProgress = useCallback((p) => setJasonProgress(p), []);
  const handleHeroImgLoaded = useCallback(() => setHeroImgLoaded(true), []);
  const handleCoverImgLoaded = useCallback(() => setCoverImgLoaded(true), []);
  const handleLuciaSectionLoaded = useCallback(() => setLuciaSectionLoaded(true), []);
  const handleJasonSectionLoaded = useCallback(() => setJasonSectionLoaded(true), []);

  return (
    <div className="App">
      <div style={{ filter: !allLoaded ? 'blur(8px)' : 'none', pointerEvents: !allLoaded ? 'none' : 'auto' }}>
        <HeroSection onImageLoaded={handleHeroImgLoaded} />
        <IntroSection />
        {/* Add spacing div for the intro section scroll area */}
        <div style={{ height: '200vh' }}></div>
        <LuciaVideoSection onLoaded={handleLuciaLoaded} setLoadingProgress={handleLuciaProgress} />
        <LuciaSection onImageLoaded={handleLuciaSectionLoaded} />
        <JasonLuciaCover onImageLoaded={handleCoverImgLoaded} />
        <div style={{ height: '20vh' }}></div>
        <SlidingText />
        <JasonVideoSection onLoaded={handleJasonLoaded} setLoadingProgress={handleJasonProgress} />
        <JasonSection onImageLoaded={handleJasonSectionLoaded} />
        <Footer />
      </div>
      {(!allLoaded) && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          background: '#111117',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <LoadingScreen progress={totalProgress} />
        </div>
      )}
    </div>
  );
}

export default App;


