# 🎭 GTA VI Website Replica

This project is a complete recreation of the official GTA VI website, featuring sophisticated scroll-driven animations, video masking effects, and character showcase sections. Built as a fan tribute using modern web technologies.

> **Disclaimer:** I am not affiliated with Rockstar Games. This project is fan-made and created just for fun.

## 🌐 Live Demo
**Website:** https://gta-web-scroll-effect-react-app.vercel.app/

## 🚀 Features

### Core Animations
- **SVG Logo Mask Animation** - Dynamic logo reveal with scroll-based morphing
- **Video Sequence Masking** - Frame-by-frame video playback tied to scroll position
- **Character Showcase** - Lucia and Jason character sections with smooth transitions
- **Smooth Scrolling** - Enhanced scroll experience with Lenis
- **Loading Screen** - Progressive asset loading with real-time progress tracking

### Interactive Elements
- **Scroll-Triggered Animations** - GSAP ScrollTrigger for precise animation control
- **Video Frame Control** - Canvas-based video frame extraction and display
- **Responsive Design** - Optimized for all screen sizes
- **Performance Optimized** - Asset preloading and blur effects during loading

### Sections
- Hero section with animated logo
- Character introduction
- Lucia video showcase with scroll-controlled playback
- Lucia character gallery
- Jason & Lucia cover section
- Sliding text animation
- Jason video showcase
- Jason character gallery
- Logo animation sequence
- Footer

## 🛠 Tech Stack

### Frontend Framework
- **React 19.1.0** - Modern React with latest features
- **Vite 6.3.5** - Fast build tool and development server

### Animation Libraries
- **GSAP 3.13.0** - Professional-grade animation library
- **ScrollTrigger** - Scroll-based animation triggers
- **Lenis 1.3.4** - Smooth scrolling library

### Development Tools
- **ESLint** - Code linting and formatting
- **Vite** - Module bundler and dev server
- **GitHub Pages** - Deployment automation

## 📦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/GTA-Web-Scroll-Effect-React-App.git
   cd GTA-Web-Scroll-Effect-React-App
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run deploy` - Build and deploy to GitHub Pages

## 🎨 Project Structure

```
frontend/
├── public/                     # Static assets
│   ├── BackgroundLarge.jpg     # Hero background
│   ├── CharactersLarge.png     # Character images
│   ├── Jason_*.jpg             # Jason character photos
│   ├── Lucia_*.jpg             # Lucia character photos
│   ├── *_Video_Clip.mp4        # Video files
│   ├── Jason_Video/            # Jason video frames
│   ├── LogoVideo/              # Logo animation frames
│   └── Lucia_Caminos_Video_Clip/ # Lucia video frames
├── src/
│   ├── components/             # React components
│   │   ├── HeroSection.jsx     # Main hero with logo animation
│   │   ├── LuciaVideoSection.jsx # Lucia video showcase
│   │   ├── JasonVideoSection.jsx # Jason video showcase
│   │   ├── LoadingScreen.jsx   # Asset loading screen
│   │   └── ...                 # Other components
│   ├── App.jsx                 # Main application component
│   ├── main.jsx               # Application entry point
│   └── index.css              # Global styles
├── package.json               # Dependencies and scripts
└── vite.config.js            # Vite configuration
```

## 🎯 Key Components

### HeroSection
- SVG logo mask animation
- Scroll-triggered morphing effects
- Background image transitions

### Video Sections (Lucia/Jason)
- Canvas-based video frame rendering
- Scroll-controlled playback
- Smooth visibility transitions
- Progress-based loading

### Loading System
- Progressive asset loading
- Real-time progress tracking
- Blur effects during loading
- Multiple asset types support

## 🔧 Technical Details

### Animation System
- Uses GSAP ScrollTrigger for precise scroll-based animations
- Canvas manipulation for video frame control
- Lenis for enhanced smooth scrolling experience

### Performance Optimizations
- Image preloading with progress tracking
- Video frame extraction and caching
- Conditional rendering based on loading states
- Optimized scroll event handling

### Asset Management
- Dynamic image loading with callbacks
- Video frame sequence processing
- SVG path data for logo animations
- Responsive image optimization
