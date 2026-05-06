import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Star, Crown, Clock, Compass } from 'lucide-react';
import './WelcomeScreen.css';
import SoonModal from '../components/SoonModal';
import BatchesScreen from './BatchesScreen';
import CommitteeScreen from './CommitteeScreen';
import venetianImg from '../assets/destinations/venetian.png';
import kowloonImg from '../assets/destinations/kowloon.png';
import oceanParkImg from '../assets/destinations/oceanpark.png';
import victoriaPeakImg from '../assets/destinations/victoria_peak.png';

const carouselData = [
  {
    id: 'hk',
    image: kowloonImg,
    leftTitle: "ABM 2026 SUMMIT",
    leftSubtitle: "Macau & Hong Kong",
    leftDesc: "8–14 May 2026. A journey of strategic growth, innovation, and extraordinary experiences.",
    rightTitle: "ACCELERATE YOUR PATH —",
    rightSubtitle: "we'll handle the logistics.",
    rightDesc: "so you can focus on networking and exploration."
  },
  {
    id: 'venetian',
    image: venetianImg,
    leftTitle: "THE VENETIAN",
    leftSubtitle: "Grand Gala",
    leftDesc: "Experience a night of absolute prestige and celebration at the Venetian Grand Ball Room.",
    rightTitle: "Immerse in luxury –",
    rightSubtitle: "we curate the experience.",
    rightDesc: "From five-star hospitality to world-class entertainment, every moment is designed to inspire."
  },
  {
    id: 'ocean',
    image: oceanParkImg,
    leftTitle: "OCEAN PARK",
    leftSubtitle: "Thrills Await",
    leftDesc: "Connect with nature, embrace the thrill of the rides, and enjoy a spectacular fireworks show.",
    rightTitle: "Unleash the adventure –",
    rightSubtitle: "we secure the access.",
    rightDesc: "A world-class experience blending breathtaking scenery with unforgettable team-building moments."
  },
  {
    id: 'peak',
    image: victoriaPeakImg,
    leftTitle: "VICTORIA PEAK",
    leftSubtitle: "The Summit View",
    leftDesc: "Witness the iconic skyline after an exhilarating high-speed ferry crossing.",
    rightTitle: "Elevate your perspective –",
    rightSubtitle: "we elevate the journey.",
    rightDesc: "Stand at the pinnacle of Asia's world city, where strategic vision meets breathtaking altitude."
  }
];

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 1.05
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.95
  })
};

const textVariants = {
  enter: { y: 20, opacity: 0 },
  center: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 }
};

const GifTransition = () => (
  <div className="gif-transition-overlay" key="gif-overlay">
    <img
      src="/stars_anime.gif"
      className="gif-asset"
      alt="Transitioning..."
    />
  </div>
);

const galaData = [
  {
    id: 'venetian',
    image: venetianImg,
    title: "Venetian Gala",
    desc: "A night of prestige and celebration at the Venetian Grand Ball Room.",
    icon: <Crown size={32} />,
    target: { batch: 1, day: 4, highlight: "Venetian" }
  },
  {
    id: 'peak',
    image: victoriaPeakImg,
    title: "The Peak View",
    desc: "Witness the iconic skyline from the pinnacle of Asia's world city.",
    icon: <Compass size={32} />,
    target: { batch: 1, day: 3, highlight: "Peak" }
  },
  {
    id: 'ocean',
    image: oceanParkImg,
    title: "Ocean Park",
    desc: "Experience thrilling rides and spectacular fireworks.",
    icon: <Star size={32} />,
    target: { batch: 1, day: 2, highlight: "Ocean Park" }
  }
];

const AnimatedNumber = ({ value }) => (
  <div className="animated-number-wrapper">
    <AnimatePresence mode="popLayout">
      <motion.span
        key={value}
        initial={{ y: 20, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -20, opacity: 0, scale: 0.8 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="timer-value"
      >
        {value}
      </motion.span>
    </AnimatePresence>
  </div>
);

const CountdownTimer = () => {
  const calculateTimeLeft = () => {
    const difference = +new Date('2026-05-11T00:00:00') - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const formatNumber = (num) => {
    return num.toString().padStart(2, '0');
  };

  return (
    <motion.div
      className="cool-timer-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
    >
      <div className="timer-block">
        <div className="timer-block-bg"></div>
        <div className="timer-block-inner">
          <AnimatedNumber value={formatNumber(timeLeft.days)} />
          <span className="timer-label">DAYS</span>
        </div>
      </div>
      <span className="timer-separator">:</span>
      <div className="timer-block">
        <div className="timer-block-bg"></div>
        <div className="timer-block-inner">
          <AnimatedNumber value={formatNumber(timeLeft.hours)} />
          <span className="timer-label">HOURS</span>
        </div>
      </div>
      <span className="timer-separator">:</span>
      <div className="timer-block">
        <div className="timer-block-bg"></div>
        <div className="timer-block-inner">
          <AnimatedNumber value={formatNumber(timeLeft.minutes)} />
          <span className="timer-label">MINUTES</span>
        </div>
      </div>
      <span className="timer-separator">:</span>
      <div className="timer-block">
        <div className="timer-block-bg"></div>
        <div className="timer-block-inner">
          <AnimatedNumber value={formatNumber(timeLeft.seconds)} />
          <span className="timer-label">SECONDS</span>
        </div>
      </div>
    </motion.div>
  );
};

const WelcomeScreen = ({ onNext }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showBatches, setShowBatches] = useState(false);
  const [[page, direction], setPage] = useState([0, 1]);
  const [[galaPage, galaDirection], setGalaPage] = useState([0, 1]);
  const [soonModal, setSoonModal] = useState({ isOpen: false, title: '' });
  const [showCommittee, setShowCommittee] = useState(false);

  const currentImageIndex = Math.abs(page % carouselData.length);
  const currentData = carouselData[currentImageIndex];
  const currentGalaIndex = Math.abs(galaPage % galaData.length);
  const currentGala = galaData[currentGalaIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setPage([page + 1, 1]);
    }, 6000);
    return () => clearInterval(interval);
  }, [page]);

  useEffect(() => {
    const galaInterval = setInterval(() => {
      setGalaPage([galaPage + 1, 1]);
    }, 4000);
    return () => clearInterval(galaInterval);
  }, [galaPage]);

  const handleRegister = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      onNext();
    }, 5000);
  };

  const handleDotClick = (index) => {
    if (index > currentImageIndex) {
      setPage([index, 1]);
    } else if (index < currentImageIndex) {
      setPage([index, -1]);
    }
  };

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleSoonClick = (title) => {
    if (title === 'Batches') {
      setShowBatches(true);
      return;
    }
    if (title === 'Core Committee') {
      setShowCommittee(true);
      return;
    }
    setSoonModal({ isOpen: true, title });
  };

  return (
    <div className={`welcome-screen ${isTransitioning ? 'pointer-events-none' : ''}`}>
      <AnimatePresence>
        {isTransitioning && <GifTransition />}
      </AnimatePresence>

      {/* --- HERO SECTION --- */}
      <section className="hero-section">
        <div className="carousel-container">
          <AnimatePresence initial={false} custom={direction}>
            <motion.img
              key={page}
              src={currentData.image}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.4 },
                scale: { duration: 0.6 }
              }}
              className="carousel-image"
              alt="Destination"
            />
          </AnimatePresence>
          <div className="carousel-overlay"></div>
        </div>

        {/* --- TOP NAVIGATION --- */}
        <header className="top-nav">
          <div className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer' }}>
            <img src="/final_main_logo.png" alt="Coromandel Logo" />
          </div>
          <nav className="nav-links glass-strip-nav">
            <button className="nav-btn-link" onClick={(e) => scrollToSection(e, 'overview')}>OVERVIEW</button>
            <button className="nav-btn-link" onClick={(e) => scrollToSection(e, 'experiences')}>EXPERIENCES</button>
            <button className="nav-btn-link" onClick={() => handleSoonClick('Awards')}>AWARDS</button>
            <button className="nav-btn-link" onClick={() => handleSoonClick('Gallery')}>GALLERY</button>
            <button className="nav-btn-link" onClick={() => handleSoonClick('Batches')}>BATCHES</button>
            <button className="nav-btn-link" onClick={() => handleSoonClick('Core Committee')}>COMMITTEE</button>
            <button className="nav-btn-link" onClick={() => handleSoonClick('Photos')}>PHOTOS</button>
          </nav>
          <div className="nav-actions">
            <button className="menu-btn" onClick={handleMenuToggle}><Menu size={24} /></button>
          </div>

          {/* Mobile Dropdown Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                className="mobile-dropdown-menu"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <button className="mobile-nav-btn" onClick={(e) => scrollToSection(e, 'overview')}>OVERVIEW</button>
                <button className="mobile-nav-btn" onClick={(e) => scrollToSection(e, 'experiences')}>EXPERIENCES</button>
                <button className="mobile-nav-btn" onClick={() => handleSoonClick('Awards')}>AWARDS</button>
                <button className="mobile-nav-btn" onClick={() => handleSoonClick('Gallery')}>GALLERY</button>
                <button className="mobile-nav-btn" onClick={() => handleSoonClick('Batches')}>BATCHES</button>
                <button className="mobile-nav-btn" onClick={() => handleSoonClick('Core Committee')}>COMMITTEE</button>
                <button className="mobile-nav-btn" onClick={() => handleSoonClick('Photos')}>PHOTOS</button>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* --- GIANT TYPOGRAPHY & CTA --- */}
        <div className="hero-center-text">
          <div className="hero-title-container">
            <div className="tree-unit-container">
              <img src="/tree-logo.png" className="hero-side-logo" alt="Growth Tree Logo" />
              <div className="logo-shine-overlay" />
            </div>
            <h1 className="modern-shimmer-title">
              <span className="line-one shimmer-text">CONSOLIDATE</span>
              <span className="line-two">TO <span className="shimmer-text">ACCELERATE</span></span>
            </h1>
          </div>
          <motion.div
            className="hero-destination-subtitle"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <span className="dest-text shimmer-text">HONGKONG</span>
            <span className="dest-dot"></span>
            <span className="dest-text shimmer-text">MACAO</span>
          </motion.div>
          <CountdownTimer />

          {/* Action Button automatically positioned relative to content */}
          <div className="hero-action-container-relative">
            <button className="btn-initiate" onClick={handleRegister}>
              <span className="edge-light"></span>
              <div className="btn-inner">
                <span className="btn-text">Participate Now and Win</span>
                <div className="btn-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* --- DYNAMIC OVERLAY TEXT BLOCKS --- */}
        <div className="hero-panels-wrapper">
          <AnimatePresence mode="wait">
            <motion.div
              className="hero-bottom-left"
              key={`left-${page}`}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-block glossy-panel">
                <h3>{currentData.leftTitle}</h3>
                <h4>{currentData.leftSubtitle}</h4>
                <p>{currentData.leftDesc}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              className="hero-bottom-right-text"
              key={`right-${page}`}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="text-block glossy-panel right">
                <h3>{currentData.rightTitle}</h3>
                <h4>{currentData.rightSubtitle}</h4>
                <p className="secondary-desc">{currentData.rightDesc}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* --- CAROUSEL POINTERS --- */}
        <div className="carousel-dots">
          {carouselData.map((_, idx) => (
            <button
              key={idx}
              className={`dot ${idx === currentImageIndex ? 'active' : ''}`}
              onClick={() => handleDotClick(idx)}
            />
          ))}
        </div>
      </section>

      {/* --- SVG Gradient Defs --- */}
      <svg style={{ width: 0, height: 0, position: 'absolute' }} aria-hidden="true" focusable="false">
        <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
      </svg>

      {/* --- PROFESSIONAL SUMMIT SECTION --- */}
      <section id="overview" className="professional-summit-section">
        {/* Elegant Mesh, Illustration & Shine Background */}
        <div className="summit-bg-gradient"></div>
        <div className="summit-illustration-overlay"></div>
        <div className="summit-shine-sweep"></div>

        <div className="summit-intro">
          <h2>SUMMIT OVERVIEW</h2>
          <p>An elite, high-performance schedule meticulously crafted for Coromandel leadership.</p>
        </div>

        <div className="summit-stats-row">
          <div className="s-stat">
            <span className="s-num">5</span>
            <div className="s-details">
              <span className="s-title">Days</span>
              <span className="s-sub">Programme</span>
            </div>
          </div>
          <div className="s-line"></div>
          <div className="s-stat">
            <span className="s-num">2</span>
            <div className="s-details">
              <span className="s-title">Cities</span>
              <span className="s-sub">HK + Macau</span>
            </div>
          </div>
          <div className="s-line"></div>
          <div className="s-stat">
            <span className="s-num">2</span>
            <div className="s-details">
              <span className="s-title">Groups</span>
              <span className="s-sub">Batches</span>
            </div>
          </div>
          <div className="s-line"></div>
          <div className="s-stat">
            <span className="s-num star-icon-container">
              <Star size={44} fill="url(#gold-grad)" stroke="none" />
            </span>
            <div className="s-details">
              <span className="s-title">5 Star</span>
              <span className="s-sub">Hospitality</span>
            </div>
          </div>
        </div>

        <div id="experiences" className="summit-features-grid">
          {/* Left Column: Mini Carousel */}
           <div className="mini-carousel-container" onClick={() => setShowBatches(currentGala.target)} role="button" tabIndex={0}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`gala-${galaPage}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                style={{ width: '100%', height: '100%' }}
              >
                <motion.img
                  src={currentGala.image}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.2 }}
                  className="mini-carousel-img"
                  alt={currentGala.title}
                />
                <div className="mini-carousel-caption">
                  <div className="ed-icon prof-gold mini-icon">{currentGala.icon}</div>
                  <div className="mini-caption-text">
                    <motion.h3
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {currentGala.title}
                    </motion.h3>
                    <motion.p
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {currentGala.desc}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Feature Boxes */}
          <div className="features-right-column">
            <div className="feature-box">
              <div className="f-box-icon prof-blue"><Clock size={40} /></div>
              <div className="f-box-text">
                <h3>70+ Hours</h3>
                <p>Curated experiences from Ocean Park to the Diamond Show.</p>
              </div>
            </div>

            <div className="feature-box">
              <div className="f-box-icon prof-silver"><Compass size={40} /></div>
              <div className="f-box-text">
                <h3>6+ Sites</h3>
                <p>Journey through landmarks of global innovation.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SOON MODAL --- */}
      <SoonModal 
        isOpen={soonModal.isOpen} 
        onClose={() => setSoonModal({ ...soonModal, isOpen: false })} 
        title={soonModal.title} 
      />

      <AnimatePresence>
        {showBatches && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 3000 }}
          >
            <BatchesScreen 
              initialBatch={typeof showBatches === 'object' ? showBatches.batch : null}
              initialDay={typeof showBatches === 'object' ? showBatches.day : 1}
              highlight={typeof showBatches === 'object' ? showBatches.highlight : null}
              onBack={() => setShowBatches(false)} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCommittee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 3000 }}
          >
            <CommitteeScreen onBack={() => setShowCommittee(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WelcomeScreen;
