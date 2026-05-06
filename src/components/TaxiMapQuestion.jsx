import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Question options layout:
// idx 0 = Hong Kong Island → bottom-center of map
// idx 1 = Kowloon Peninsula → center-right (CORRECT)
// idx 2 = Lantau Island → left side
// idx 3 = New Territories → top-center

// Taxi starts at center. On answer, it drives to destination.
const DESTINATIONS = [
  {
    label: 'Hong Kong Island',
    letter: 'A',
    color: '#818cf8',
    glow: 'rgba(129,140,248,0.6)',
    // position on the map overlay (% from top-left of map panel)
    mapX: '50%', mapY: '82%',
    // taxi travel direction vector (normalized roughly)
    travelX: 0, travelY: 80,
    icon: '🏙️',
  },
  {
    label: 'Kowloon Peninsula',
    letter: 'B',
    color: '#2DD4BF',
    glow: 'rgba(45,212,191,0.6)',
    mapX: '62%', mapY: '42%',
    travelX: 70, travelY: -20,
    icon: '🌆',
  },
  {
    label: 'Lantau Island',
    letter: 'C',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.6)',
    mapX: '16%', mapY: '65%',
    travelX: -80, travelY: 30,
    icon: '⛰️',
  },
  {
    label: 'New Territories',
    letter: 'D',
    color: '#fb923c',
    glow: 'rgba(251,146,60,0.6)',
    mapX: '48%', mapY: '14%',
    travelX: -10, travelY: -90,
    icon: '🏘️',
  },
];

export default function TaxiMapQuestion({
  question, answeredIdx, isAnswered, isCorrect, onAnswer, onContinue
}) {
  const [taxiAnimating, setTaxiAnimating] = useState(false);

  // Taxi position — starts center of map
  const dest = answeredIdx !== null ? DESTINATIONS[answeredIdx] : null;

  const taxiTarget = isAnswered && dest
    ? { x: dest.travelX, y: dest.travelY }
    : { x: 0, y: 0 };

  const handleSelect = (idx) => {
    if (isAnswered) return;
    setTaxiAnimating(true);
    onAnswer(idx);
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Tag */}
      <div className="q-tag" style={{ marginBottom: 10 }}>
        <div className="q-tag-dot" />{question.tag}
      </div>

      {/* Question text */}
      <div className="q-text" style={{ marginBottom: 6 }}>{question.question_text}</div>

      <div style={{
        fontFamily: 'var(--font-body)', fontSize: 12,
        color: 'var(--muted2)', marginBottom: 14,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span>🚕</span>
        {isAnswered ? 'Dispatch complete. Moving on...' : 'Tap a destination to dispatch the taxi!'}
      </div>

      {/* ── Map Panel ────────────────────────────────────── */}
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '4 / 3',
        borderRadius: 20,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
        background: '#060e1e',
      }}>
        {/* Map BG */}
        <img
          src="/hk_regions_map.png"
          alt="Hong Kong Map"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.88 }}
        />

        {/* Vignette */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 100%)',
        }} />

        {/* Highway road lines from center */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Roads to each destination */}
          <line x1="50" y1="50" x2="50" y2="85" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="3,2" />
          <line x1="50" y1="50" x2="63" y2="42" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="3,2" />
          <line x1="50" y1="50" x2="16" y2="64" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="3,2" />
          <line x1="50" y1="50" x2="48" y2="14" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="3,2" />
        </svg>

        {/* ── Animated Taxi (starts center) ──────────── */}
        <motion.div
          animate={taxiTarget}
          initial={{ x: 0, y: 0 }}
          transition={{ type: 'spring', stiffness: 70, damping: 18, duration: 0.8 }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 20,
            textAlign: 'center',
          }}
        >
          {/* Taxi glow ring */}
          <motion.div
            animate={!isAnswered ? { scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] } : { opacity: 0 }}
            transition={{ duration: 1.8, repeat: Infinity }}
            style={{
              position: 'absolute', inset: -8, borderRadius: '50%',
              border: '2px solid rgba(255,220,50,0.7)',
              pointerEvents: 'none',
            }}
          />

          {/* Taxi body */}
          <motion.div
            animate={!isAnswered ? { y: [0, -3, 0] } : { scale: 1.1 }}
            transition={!isAnswered ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.5 }}
            style={{ fontSize: 34, lineHeight: 1, display: 'block' }}
          >
            🚕
          </motion.div>
          {/* Result badges removed per user request */}
        </motion.div>

        {/* ── Destination Pins on Map ──────────────── */}
        {DESTINATIONS.map((dest, idx) => {
          const isSelected = idx === answeredIdx;
          // No feedback variables needed - neutral survey mode

          return (
            <motion.div
              key={idx}
              onClick={() => handleSelect(idx)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              transition={{ delay: idx * 0.1, type: 'spring', stiffness: 260, damping: 20 }}
              style={{
                position: 'absolute',
                top: dest.mapY,
                left: dest.mapX,
                transform: 'translate(-50%, -50%)',
                zIndex: 15,
                cursor: isAnswered ? 'default' : 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              }}
            >
              {/* Pulse ring */}
              {!isAnswered && (
                <motion.div
                  style={{
                    position: 'absolute', width: 54, height: 54, borderRadius: '50%',
                    border: `2px solid ${dest.color}`,
                    pointerEvents: 'none', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                  animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, delay: idx * 0.6, repeat: Infinity }}
                />
              )}

              {/* Status banners removed per user request */}

              {/* Location pin circle */}
              <motion.div
                whileHover={!isAnswered ? { scale: 1.2, y: -5 } : {}}
                animate={!isAnswered ? { y: [0, -4, 0] } : {}}
                transition={{ duration: 2.4, delay: idx * 0.5, repeat: !isAnswered ? Infinity : 0, ease: 'easeInOut' }}
                style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'rgba(0,0,0,0.65)',
                  border: `2.5px solid ${dest.color}99`,
                  backdropFilter: 'blur(12px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                  transition: 'all 0.3s',
                }}
              >
                {dest.icon}
              </motion.div>

              {/* Letter + Label */}
              <div style={{
                background: dest.color,
                borderRadius: 6, padding: '2px 7px',
                fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 9, color: '#000',
                boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
                marginTop: -3,
              }}>
                {dest.letter}
              </div>

              <div style={{
                background: 'rgba(0,0,0,0.72)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 6, padding: '3px 8px',
                fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 9,
                color: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(8px)',
                whiteSpace: 'nowrap',
                boxShadow: 'none',
                transition: 'all 0.3s',
              }}>
                {dest.label}
              </div>
            </motion.div>
          );
        })}

        {/* Road label */}
        <div style={{
          position: 'absolute', bottom: 7, left: '50%', transform: 'translateX(-50%)',
          pointerEvents: 'none',
          fontFamily: 'var(--font-body)', fontSize: 9, color: 'rgba(255,255,255,0.35)',
          whiteSpace: 'nowrap',
        }}>
          ✦ Hong Kong Navigation Map
        </div>
      </div>

      {/* Status feedback removed per user request */}
    </div>
  );
}
