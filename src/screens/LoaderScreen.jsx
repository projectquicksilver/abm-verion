import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plane } from 'lucide-react';
import './screens.css';

export default function LoaderScreen({ employee, onNext }) {
  const firstName = employee?.name?.split(' ')[0] ?? 'Explorer';

  useEffect(() => {
    const timer = setTimeout(() => onNext(), 4000);
    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="loader-overlay-cinematic">
      {/* Cinematic Background */}
      <div className="loader-stars-bg">
        <img src="/stars_anime.gif" alt="stars" className="stars-gif" />
        <div className="bg-gradient-overlay" />
      </div>

      <div className="loader-container-cinematic">
        {/* Airplane Animation Vessel */}
        <motion.div 
          className="airplane-vessel"
          initial={{ x: "-100vw", y: "20vh", rotate: 15, opacity: 0 }}
          animate={{ 
            x: "100vw", 
            y: "-20vh", 
            rotate: 15,
            opacity: [0, 1, 1, 0]
          }}
          transition={{ 
            duration: 4, 
            ease: "easeInOut" 
          }}
        >
          <Plane size={48} className="loader-plane-icon" />
          <div className="plane-trail" />
        </motion.div>

        {/* Welcome Message */}
        <motion.div
          className="loader-welcome-block"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <h2 className="loader-welcome-text">Welcome,</h2>
          <h1 className="loader-user-name">{firstName}</h1>
          <div className="loader-status-bar">
            <motion.div 
              className="loader-progress-fill"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 3.5, ease: "linear" }}
            />
          </div>
          <p className="loader-preparing">Preparing your discovery journey...</p>
        </motion.div>
      </div>

      {/* Lighting Effects */}
      <div className="loader-flare" />
    </div>
  );
}
