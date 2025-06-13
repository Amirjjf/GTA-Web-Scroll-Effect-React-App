import React from 'react';
import HeroSection from './components/HeroSection';
import IntroSection from './components/IntroSection';
import LuciaVideoSection from './components/LuciaVideoSection';
import LuciaSection from './components/LuciaSection';
import JasonLuciaCover from './components/JasonLuciaCover';

import './App.css';

function App() {
  return (
    <div className="App">
      <HeroSection />
      <IntroSection />
      {/* Add spacing div for the intro section scroll area */}
      <div style={{ height: '200vh' }}></div>
      <LuciaVideoSection />
      <LuciaSection />
      <JasonLuciaCover />
      <div style={{ height: '100vh' }}></div>
    </div>
  );
}

export default App;


