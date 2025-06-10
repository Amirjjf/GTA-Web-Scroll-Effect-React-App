import React from 'react';
import HeroSection from './components/HeroSection';
import IntroSection from './components/IntroSection';
import LuciaVideoSection from './components/LuciaVideoSection';

import './App.css';

function App() {
  return (
    <div className="App">
      <HeroSection />
      <IntroSection />
      {/* Add spacing div for the intro section scroll area */}
      <div style={{ height: '300vh' }}></div>
      <LuciaVideoSection />
    </div>
  );
}

export default App;


