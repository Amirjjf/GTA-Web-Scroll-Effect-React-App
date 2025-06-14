import React from 'react';
import HeroSection from './components/HeroSection';
import IntroSection from './components/IntroSection';
import LuciaVideoSection from './components/LuciaVideoSection';
import LuciaSection from './components/LuciaSection';
import JasonLuciaCover from './components/JasonLuciaCover';
import SlidingText from './components/SlidingText';
import JasonVideoSection from './components/JasonVideoSection';
import Footer from './components/Footer';

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
      <div style={{ height: '20vh' }}></div>
      <SlidingText />
      {/* <div style={{ height: '60vh' }}></div> */}
      <JasonVideoSection />
      <div style={{ height: '50vh' }}></div>
      <Footer />
    </div>
  );
}

export default App;


