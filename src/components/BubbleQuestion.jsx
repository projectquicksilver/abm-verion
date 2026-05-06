import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Per-option config: image (or emoji fallback), floating currency symbols, colors
const BUBBLE_META = [
  {
    img: '/bubble_yuan_yen.png',
    emoji: '🏯⛩️',
    symbols: ['¥', '¥', '$', '€'],
    label: 'Yuan and Yen',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.55)',
  },
  {
    img: null,
    emoji: '🏙️⛵',
    symbols: ['HK$', 'MOP', '$', '€'],
    label: 'HK Dollar & Pataca',
    color: '#2DD4BF',
    glow: 'rgba(45,212,191,0.55)',
  },
  {
    img: null,
    emoji: '🗽🗼',
    symbols: ['$', '$', '€', '€'],
    label: 'Dollar and Euro',
    color: '#60a5fa',
    glow: 'rgba(96,165,250,0.55)',
  },
  {
    img: null,
    emoji: '🕌🏛️',
    symbols: ['₹', '₱', '$', '€'],
    label: 'Rupee and Peso',
    color: '#f472b6',
    glow: 'rgba(244,114,182,0.55)',
  },
];

// Floating currency symbol positions (relative to bubble center)
const SYMBOL_POSITIONS = [
  { top: '2%',  left: '-8%',  size: 14 },
  { top: '15%', right: '-10%', size: 11 },
  { bottom: '10%', right: '-8%', size: 13 },
  { bottom: '5%', left: '-6%', size: 10 },
];

export default function BubbleQuestion({
  question, answeredIdx, isAnswered, isCorrect, onAnswer, onContinue
}) {
  return (
    <div style={{ width: '100%' }}>
      {/* Tag */}
      <div className="q-tag" style={{ marginBottom: 12 }}>
        <div className="q-tag-dot" />{question.tag}
      </div>

      {/* Question text */}
      <div className="q-text" style={{ marginBottom: 6 }}>{question.question_text}</div>

      {/* Sub-hint */}
      <div style={{
        fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--muted2)',
        marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6
      }}>
        <span style={{ fontSize: 16 }}>✦</span>
        Tap the bubble with the correct currency pair
      </div>

      {/* 2×2 Bubble Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
        padding: '0 4px',
      }}>
        {question.options && question.options.map((opt, idx) => {
          // Use metadata from the question if available, otherwise fall back to default
          const meta = (question.option_metadata && question.option_metadata[idx]) || BUBBLE_META[idx] || BUBBLE_META[0];
          const isSelected = idx === answeredIdx;

          return (
            <Bubble
              key={idx}
              idx={idx}
              meta={meta}
              opt={opt}
              isSelected={isSelected}
              isAnswered={isAnswered}
              onClick={() => !isAnswered && onAnswer(idx)}
            />
          );
        })}
      </div>

      {/* Hint text at bottom */}
      <div style={{
        textAlign: 'center', marginTop: 14,
        fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--muted2)'
      }}>
        ✦ Tap the matching currency bubble
      </div>

    </div>
  );
}

function Bubble({ idx, meta, opt, isSelected, isAnswered, onClick }) {
  // Bob animation: each bubble has a slightly different phase
  const bobDelay = idx * 0.4;
  const bobDuration = 2.2 + idx * 0.3;

  const borderColor = meta.color + '55';
  const glowColor = 'transparent';

  return (
    <motion.div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, position: 'relative' }}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: idx * 0.07, type: 'spring', stiffness: 260, damping: 20 }}
    >
      {/* Floating currency symbols around bubble */}
      {SYMBOL_POSITIONS.map((pos, si) => (
        <motion.div
          key={si}
          style={{
            position: 'absolute',
            ...pos,
            fontSize: pos.size,
            fontFamily: 'var(--font-mono)',
            color: meta.color,
            opacity: 0.5,
            pointerEvents: 'none',
            zIndex: 5,
            fontWeight: 700,
          }}
          animate={!isAnswered ? {
            y: [0, -6, 0, 4, 0],
            opacity: [0.4, 0.7, 0.4, 0.6, 0.4],
          } : {}}
          transition={{
            duration: bobDuration + si * 0.5,
            delay: bobDelay + si * 0.3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {meta.symbols[si]}
        </motion.div>
      ))}

      {/* The Bubble itself */}
      <motion.div
        onClick={onClick}
        animate={!isAnswered ? {
          y: [0, -10, 0, -5, 0],
        } : { scale: 1.05 }}
        transition={!isAnswered ? {
          duration: bobDuration,
          delay: bobDelay,
          repeat: Infinity,
          ease: 'easeInOut',
        } : { duration: 0.45, ease: 'easeOut' }}
        whileHover={!isAnswered ? { scale: 1.1, y: -14 } : {}}
        whileTap={!isAnswered ? { scale: 0.92 } : {}}
        style={{
          width: 130,
          height: 130,
          borderRadius: '50%',
          position: 'relative',
          cursor: isAnswered ? 'default' : 'pointer',
          overflow: 'hidden',

          // Glass sphere border
          border: `2px solid ${borderColor}`,
          boxShadow: `
            0 0 0 1px rgba(255,255,255,0.08),
            0 8px 32px rgba(0,0,0,0.5),
            0 0 30px ${glowColor},
            inset 0 2px 8px rgba(255,255,255,0.15)
          `,

          // Glassmorphism sphere background
          background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 40%, rgba(0,0,0,0.4) 100%)`,
          backdropFilter: 'blur(4px)',
        }}
      >
        {/* Image inside bubble (clipped to circle) */}
        {meta.img ? (
          <img
            src={meta.img}
            alt={opt}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.85)',
              borderRadius: '50%',
            }}
          />
        ) : (
          /* Emoji fallback when image isn't available */
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 44,
            background: `radial-gradient(circle at center, ${meta.color}22 0%, transparent 70%)`,
          }}>
            {meta.emoji}
          </div>
        )}

        {/* Glass highlight (top-left sheen) */}
        <div style={{
          position: 'absolute', top: '8%', left: '12%',
          width: '38%', height: '28%',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.28) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        {/* Bottom glass reflection */}
        <div style={{
          position: 'absolute', bottom: '8%', right: '14%',
          width: '24%', height: '14%',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.12) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        {/* Result icons removed per user request */}
      </motion.div>

      {/* Letter badge below bubble */}
      <motion.div
        style={{
          width: 30, height: 30, borderRadius: '50%',
          background: `linear-gradient(135deg, ${meta.color}33, ${meta.color}88)`,
          border: `1.5px solid ${meta.color}66`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 13,
          color: meta.color,
          boxShadow: 'none',
          marginTop: -2,
        }}
      >
        {String.fromCharCode(65 + idx)}
      </motion.div>

      {/* Option label text */}
      <div style={{
        fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 11,
        color: 'rgba(255,255,255,0.75)',
        textAlign: 'center', maxWidth: 120, lineHeight: 1.3,
      }}>
        {opt}
      </div>
    </motion.div>
  );
}
