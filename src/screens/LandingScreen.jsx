import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Rocket } from 'lucide-react';
import './screens.css';

export default function LandingScreen({ onNext, onHome }) {
  const [isLaunching, setIsLaunching] = useState(false);

  const handleLaunch = () => {
    setIsLaunching(true);
    setTimeout(() => {
      onNext();
    }, 1200); // 1.2s to match the launch animation duration
  };

  return (
    <>
      {/* Full Screen Cinematic Background */}
      <motion.div
        className="macao-bg-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <div className="macao-img animate-pan"></div>
        <div className="macao-overlay"></div>
      </motion.div>

      <div className="landing-content">

        <motion.div
          className="brand-logo-wrap"
          onClick={onHome}
          initial={{ opacity: 0, scale: 0.7, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.15, type: 'spring', damping: 16, stiffness: 100 }}
        >
          {/* Orbiting gold sparks */}
          <div className="logo-orbit-a"><div className="logo-spark" /></div>
          <div className="logo-orbit-b"><div className="logo-spark logo-spark-b" /></div>

          {/* Logo — CSS filter invert makes it dark-mode native */}
          <img src="/coro-logo.png" alt="Coromandel Logo" className="main-logo-img" />
        </motion.div>

        <motion.div
          className="hero-eyebrow"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="badge">
            <div className="badge-dot"></div>
            <MapPin size={12} style={{ marginRight: -2 }} /> Coromandel ABM · 2026
          </div>
        </motion.div>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          Experience<br /><em>The Magic</em>
        </motion.h1>

        <motion.p
          className="hero-sub"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Embark on a heart-pounding journey through the neon-lit streets and hidden wonders of Macao. Are you ready for the ultimate adventure?
        </motion.p>

        <motion.button
          className={`play-btn ${isLaunching ? 'launching' : ''}`}
          onClick={handleLaunch}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, type: 'spring', damping: 20 }}
          disabled={isLaunching}
        >
          <span className="btn-icon"><Rocket size={22} strokeWidth={2.5} /></span> Begin Challenge
        </motion.button>

      </div>
    </>
  );
}
