import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, X } from 'lucide-react';
import './CommitteeScreen.css';

const committeeMembers = [
  { name: "Madhab Adhikari",   initials: "MA" },
  { name: "BVS Satish",        initials: "BS" },
  { name: "Harish Mata",       initials: "HM" },
  { name: "Vivek Nenawati",    initials: "VN" },
  { name: "Dr. Binay Parida",  initials: "BP" },
  { name: "Rajesh PK",         initials: "RP" },
  { name: "Nikesh Baidya",     initials: "NB" },
  { name: "Dinesh Kumar",      initials: "DK" },
  { name: "Sreenivasa Sarma",  initials: "SS" },
  { name: "Rajabardhan",       initials: "RJ" },
  { name: "Nithya D",          initials: "ND" },
  { name: "Srikanth Reddy",    initials: "SR" },
  { name: "Pradeep Kumar",     initials: "PK" },
  { name: "Sudipta Mandal",    initials: "SM" },
  { name: "Mousumi S",         initials: "MS" },
  { name: "Vaibhav Rathi",     initials: "VR" },
  { name: "Debashish Sahoo",   initials: "DS" },
  { name: "Arpit Andrew Noel", initials: "AN" },
  { name: "Pranay Aerra",      initials: "PA" },
];

const ACCENTS = [
  '#14b8a6', '#8b5cf6', '#f59e0b', '#06b6d4',
  '#10b981', '#ec4899', '#3b82f6', '#f97316',
];

const BACK_PATTERNS = [
  'radial-gradient(circle at 30% 30%, rgba(20,184,166,0.35) 0%, transparent 55%), radial-gradient(circle at 70% 70%, rgba(6,182,212,0.25) 0%, transparent 55%)',
  'radial-gradient(circle at 70% 30%, rgba(139,92,246,0.35) 0%, transparent 55%), radial-gradient(circle at 30% 70%, rgba(167,139,250,0.25) 0%, transparent 55%)',
  'radial-gradient(circle at 50% 20%, rgba(245,158,11,0.35) 0%, transparent 55%), radial-gradient(circle at 50% 80%, rgba(251,191,36,0.25) 0%, transparent 55%)',
  'radial-gradient(circle at 30% 70%, rgba(6,182,212,0.35) 0%, transparent 55%), radial-gradient(circle at 70% 30%, rgba(34,211,238,0.25) 0%, transparent 55%)',
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.35 } }
};
const cardIn = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

export default function CommitteeScreen({ onBack }) {
  const [hovered,  setHovered]  = useState(null);
  const [selected, setSelected] = useState(null);
  const [energyKey, setEnergyKey] = useState(0); // re-mount to re-trigger animation

  const triggerEnergy = useCallback(() => {
    setEnergyKey(k => k + 1);
  }, []);

  const openCard = (i) => {
    setSelected(i);
    triggerEnergy();
  };

  const goPrev = () => {
    setSelected(s => (s - 1 + committeeMembers.length) % committeeMembers.length);
    triggerEnergy();
  };
  const goNext = () => {
    setSelected(s => (s + 1) % committeeMembers.length);
    triggerEnergy();
  };

  const member   = selected !== null ? committeeMembers[selected] : null;
  const accent   = selected !== null ? ACCENTS[selected % ACCENTS.length] : '#fbbf24';
  const pattern  = selected !== null ? BACK_PATTERNS[selected % BACK_PATTERNS.length] : '';

  return (
    <motion.div
      className="cm-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="cm-bg" />
      <div className="cm-grain" />

      {/* Back */}
      <motion.button
        className="cm-back"
        onClick={onBack}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        whileHover={{ x: -3 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft size={15} strokeWidth={1.8} />
        <span>Return</span>
      </motion.button>

      {/* Header */}
      <motion.header
        className="cm-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.1 }}
      >
        <p className="cm-eyebrow">ABM 2026 · Macau &amp; Hong Kong</p>
        <h1 className="cm-title">Core Committee</h1>
        <p className="cm-subtitle">Click any card to reveal · Hover to flip</p>
      </motion.header>

      {/* Flip Card Grid */}
      <motion.div
        className="cm-grid"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {committeeMembers.map((m, i) => {
          const ac   = ACCENTS[i % ACCENTS.length];
          const isDim = hovered !== null && hovered !== i;
          const isHov = hovered === i;

          return (
            <motion.div
              key={i}
              className="cm-card-wrapper"
              variants={cardIn}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => openCard(i)}
              animate={{ opacity: isDim ? 0.25 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {/* 3-D Flipper */}
              <div className={`cm-flipper ${isHov ? 'cm-flipped' : ''}`}>

                {/* ── FRONT FACE ── */}
                <div
                  className="cm-face cm-front"
                  style={{
                    borderColor: `${ac}44`,
                    boxShadow: `0 4px 20px rgba(0,0,0,0.4), 0 0 0 1px ${ac}22`,
                  }}
                >
                  {/* Left accent bar */}
                  <div className="cm-card-accent" style={{ background: ac }} />

                  {/* Golden badge */}
                  <div className="cm-badge">
                    <span className="cm-badge-text">{m.initials}</span>
                    <span className="cm-tick cm-tick-tl" />
                    <span className="cm-tick cm-tick-tr" />
                    <span className="cm-tick cm-tick-bl" />
                    <span className="cm-tick cm-tick-br" />
                  </div>

                  <div className="cm-card-info">
                    <h3 className="cm-card-name">{m.name}</h3>
                  </div>
                </div>

                {/* ── BACK FACE ── */}
                <div
                  className="cm-face cm-back"
                  style={{ background: `${BACK_PATTERNS[i % BACK_PATTERNS.length]}, #0c0f1a` }}
                >
                  {/* Diamond grid pattern */}
                  <div className="cm-back-grid" />

                  {/* Giant ghost initials */}
                  <span className="cm-back-ghost" style={{ color: `${ac}25` }}>
                    {m.initials}
                  </span>

                  {/* Center ornament */}
                  <div className="cm-back-center">
                    <div className="cm-back-diamond" style={{ borderColor: `${ac}88`, boxShadow: `0 0 20px ${ac}55` }}>
                      <span className="cm-back-initials" style={{ color: ac }}>{m.initials}</span>
                    </div>
                    <p className="cm-back-name">{m.name}</p>
                  </div>

                  {/* Corner marks */}
                  <span className="cm-bc cm-bc-tl" style={{ color: ac }}>◆</span>
                  <span className="cm-bc cm-bc-tr" style={{ color: ac }}>◆</span>
                  <span className="cm-bc cm-bc-bl" style={{ color: ac }}>◆</span>
                  <span className="cm-bc cm-bc-br" style={{ color: ac }}>◆</span>

                  {/* Energy pulse rings on hover */}
                  {isHov && (
                    <>
                      <div className="cm-hover-ring cm-hr1" style={{ borderColor: ac }} />
                      <div className="cm-hover-ring cm-hr2" style={{ borderColor: `${ac}99` }} />
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ─── Playing Card Modal ─── */}
      <AnimatePresence>
        {selected !== null && member && (
          <motion.div
            className="cm-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="cm-modal-inner"
              onClick={e => e.stopPropagation()}
              initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
              animate={{ scale: 1,   opacity: 1, rotateY: 0   }}
              exit={{    scale: 0.5, opacity: 0, rotateY: 90  }}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            >
              {/* Energy burst rings (re-mounted via key) */}
              <div key={energyKey} className="cm-energy-wrap">
                <div className="cm-energy-ring cm-er1" style={{ borderColor: accent }} />
                <div className="cm-energy-ring cm-er2" style={{ borderColor: `${accent}cc` }} />
                <div className="cm-energy-ring cm-er3" style={{ borderColor: `${accent}88` }} />
                <div className="cm-energy-ring cm-er4" style={{ borderColor: `${accent}44` }} />
              </div>

              {/* ── Playing Card ── */}
              <div
                className="cm-playing-card"
                style={{
                  borderColor: `${accent}99`,
                  boxShadow: `0 0 0 1px ${accent}44, 0 30px 80px rgba(0,0,0,0.7), 0 0 80px ${accent}33`,
                  background: `${pattern}, #0d1117`,
                }}
              >
                {/* Ornate outer border */}
                <div className="cm-pc-outer-border" style={{ borderColor: `${accent}33` }} />

                <div className="cm-pc-corner cm-pc-tl" style={{ color: accent }}>
                  <span className="cm-pc-suit">◆</span>
                </div>
                <div className="cm-pc-corner cm-pc-tr" style={{ color: accent }}>
                  <span className="cm-pc-suit">◆</span>
                </div>
                <div className="cm-pc-corner cm-pc-bl" style={{ color: accent, transform: 'rotate(180deg)' }}>
                  <span className="cm-pc-suit">◆</span>
                </div>
                <div className="cm-pc-corner cm-pc-br" style={{ color: accent, transform: 'rotate(180deg)' }}>
                  <span className="cm-pc-suit">◆</span>
                </div>

                {/* Center */}
                <div className="cm-pc-center">
                  <div
                    className="cm-pc-medallion"
                    style={{
                      borderColor: `${accent}88`,
                      boxShadow: `0 0 0 1px ${accent}44, 0 0 30px ${accent}55, 0 0 60px ${accent}22`,
                    }}
                  >
                    <span className="cm-pc-initials" style={{ color: accent, textShadow: `0 0 30px ${accent}` }}>
                      {member.initials}
                    </span>
                  </div>
                  <h2 className="cm-pc-name" style={{ color: '#f8fafc' }}>{member.name}</h2>
                  <p className="cm-pc-role" style={{ color: `${accent}bb` }}>Core Committee · ABM 2026</p>
                </div>
              </div>

              {/* Navigation */}
              <div className="cm-modal-nav">
                <motion.button
                  className="cm-nav-btn"
                  onClick={goPrev}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{ borderColor: `${accent}55`, color: accent }}
                >
                  <ChevronLeft size={22} />
                </motion.button>
                <span className="cm-nav-count">{selected + 1} / {committeeMembers.length}</span>
                <motion.button
                  className="cm-nav-btn"
                  onClick={goNext}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{ borderColor: `${accent}55`, color: accent }}
                >
                  <ChevronRight size={22} />
                </motion.button>
              </div>
            </motion.div>

            {/* Close */}
            <motion.button
              className="cm-close-btn"
              onClick={() => setSelected(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={20} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
