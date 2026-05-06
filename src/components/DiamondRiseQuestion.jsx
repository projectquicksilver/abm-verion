import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const HOTELS = [
  { name: 'The Venetian Macao', icon: '🛶' },
  { name: 'MGM Cotai', icon: '🦁' },
  { name: 'Wynn Macau', icon: '⛲' },
  { name: 'Galaxy Macau', icon: '💎' }
];

export default function DiamondRiseQuestion({
  question, answeredIdx, isAnswered, isCorrect, onAnswer, onContinue
}) {
  const [ diamondState, setDiamondState ] = useState('idle'); // idle, rising, wrong

  const handlePick = (idx) => {
    if (isAnswered) return;
    onAnswer(idx);
    if (idx === 3) setDiamondState('rising');
    else setDiamondState('wrong');
  };

  return (
    <div style={{ width: '100%' }}>
      {/* HUD: Tag + Question */}
      <div className="q-tag" style={{ marginBottom: 12 }}>
        <div className="q-tag-dot" />{question.tag}
      </div>
      <div className="q-text" style={{ marginBottom: 8 }}>{question.question_text}</div>

      {/* Atmospheric Scene */}
      <div style={{
        position: 'relative', width: '100%', height: 260,
        borderRadius: 24, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
        background: '#050a1a',
        marginBottom: 16,
      }}>
        {/* Background Image */}
        <img
          src="/diamond_atrium.png"
          alt="Atrium"
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            opacity: 0.6, filter: 'brightness(0.7)',
          }}
        />

        {/* Atrium Overlay (Ambient Lighting) */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 50% 100%, rgba(80,120,255,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* The Fountain Base (CSS) */}
        <div style={{
          position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
          width: 140, height: 30, borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.1)',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
        }}>
          {/* Water Surface shimmer */}
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              position: 'absolute', inset: 4, borderRadius: '50%',
              background: 'rgba(34,211,238,0.2)',
            }}
          />
        </div>

        {/* Success/Failure animations removed per user request */}

        {/* Legend */}
        <div style={{
          position: 'absolute', bottom: 10, left: 0, right: 0,
          textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 9,
          color: 'rgba(255,255,255,0.3)', letterSpacing: 2,
        }}>
          FORTUNE DIAMOND SHOW · GALAXY MACAU
        </div>
      </div>

      {/* Options Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {HOTELS.map((hotel, idx) => {
          const isSelected = idx === answeredIdx;
          // No feedback variables - neutral survey mode

          return (
            <motion.button
              key={idx}
              onClick={() => handlePick(idx)}
              whileHover={!isAnswered ? { y: -4, scale: 1.04 } : {}}
              whileTap={!isAnswered ? { scale: 0.96 } : {}}
              style={{
                all: 'unset', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                padding: '14px 8px', borderRadius: 16,
                background: 'rgba(255,255,255,0.04)',
                border: '1.5px solid rgba(255,255,255,0.1)',
                opacity: 1,
                cursor: isAnswered ? 'default' : 'pointer',
                transition: 'all 0.3s',
              }}
            >
              <span style={{ fontSize: 24 }}>{hotel.icon}</span>
              <span style={{
                fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11,
                color: '#fff',
                textAlign: 'center',
              }}>
                {hotel.name}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Feedback text removed per user request */}
    </div>
  );
}
