// src/App.js
import React from 'react';
import HeroSection from './components/HeroSection';

import './App.css';

function App() {
  return (
    <div className="App">
      <HeroSection />
      {/* Video section for scroll animation */}
      <section style={{ 
        height: '300vh', 
        backgroundColor: '#000',
        position: 'relative'
      }}>
        {/* This section provides scrollable content for video frame animation */}
      </section>
    </div>
  );
}

export default App;


