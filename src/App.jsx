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

import './App.css';

function App() {
  const [luciaLoaded, setLuciaLoaded] = useState(false);
  const [jasonLoaded, setJasonLoaded] = useState(false);
  const [luciaProgress, setLuciaProgress] = useState(0);
  const [jasonProgress, setJasonProgress] = useState(0);

  // Show loading screen until both are loaded
  const allLoaded = luciaLoaded && jasonLoaded;
  const totalProgress = Math.round((luciaProgress + jasonProgress) / 2);

  // Use useCallback to avoid unnecessary re-renders
  const handleLuciaLoaded = useCallback(() => setLuciaLoaded(true), []);
  const handleJasonLoaded = useCallback(() => setJasonLoaded(true), []);
  const handleLuciaProgress = useCallback((p) => setLuciaProgress(p), []);
  const handleJasonProgress = useCallback((p) => setJasonProgress(p), []);

  return (
    <div className="App">
      <div style={{ filter: !allLoaded ? 'blur(8px)' : 'none', pointerEvents: !allLoaded ? 'none' : 'auto' }}>
        <HeroSection />
        <IntroSection />
        {/* Add spacing div for the intro section scroll area */}
        <div style={{ height: '200vh' }}></div>
        <LuciaVideoSection onLoaded={handleLuciaLoaded} setLoadingProgress={handleLuciaProgress} />
        <LuciaSection />
        <JasonLuciaCover />
        <div style={{ height: '20vh' }}></div>
        <SlidingText />
        <JasonVideoSection onLoaded={handleJasonLoaded} setLoadingProgress={handleJasonProgress} />
        <div style={{ height: '50vh' }}></div>
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


