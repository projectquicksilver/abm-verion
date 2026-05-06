import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const PIN_POSITIONS = [
  { top: '28%', left: '20%'  }, // A — top-left
  { top: '22%', left: '72%'  }, // B — top-right
  { top: '65%', left: '24%'  }, // C — bottom-left
  { top: '63%', left: '74%'  }, // D — bottom-right
];

const ZONE_META = [
  { color: '#22c55e', glow: 'rgba(34,197,94,0.6)',   icon: '🌿' },
  { color: '#e879f9', glow: 'rgba(232,121,249,0.6)', icon: '🛍️' },
  { color: '#60a5fa', glow: 'rgba(96,165,250,0.6)',  icon: '🎬' },
  { color: '#fb923c', glow: 'rgba(251,146,60,0.6)',  icon: '🏄' },
];

export default function MapPinQuestion({
  question, answeredIdx, isAnswered, isCorrect, onAnswer, onContinue
}) {
  return (
    <div style={{ width: '100%' }}>
      {/* Tag */}
      <div className="q-tag" style={{ marginBottom: 10 }}>
        <div className="q-tag-dot" />{question.tag}
      </div>

      {/* Question text */}
      <div className="q-text" style={{ marginBottom: 6 }}>{question.question_text}</div>

      {/* Hint */}
      <div style={{
        fontFamily: 'var(--font-body)', fontSize: 12,
        color: 'var(--muted2)', marginBottom: 12,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span>📍</span> Tap the correct zone on the map
      </div>

      {/* ── Map Panel (pins only — no labels) ──────────── */}
      <div style={{
        position: 'relative', width: '100%',
        borderRadius: 18, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
        aspectRatio: '16 / 10',
        background: '#0d1520',
      }}>
        <img
          src="/q4_city_map.png" alt="City Map"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {/* Edge vignette */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0,0,0,0.55) 100%)',
        }} />

        {/* Pins — ONLY icon + letter badge, no text tooltips inside the map */}
        {question.options && question.options.map((_, idx) => {
          const pos = PIN_POSITIONS[idx];
          const zone = ZONE_META[idx];
          const isSelected = idx === answeredIdx;
          // No feedback variables - neutral survey mode

          const glowColor = 'transparent';

          return (
            <motion.div
              key={idx}
              onClick={() => !isAnswered && onAnswer(idx)}
              style={{
                position: 'absolute',
                top: pos.top, left: pos.left,
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
                cursor: isAnswered ? 'default' : 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.1, type: 'spring', stiffness: 280, damping: 20 }}
            >
              {/* Pulse ring */}
              {!isAnswered && (
                <motion.div
                  style={{
                    position: 'absolute', inset: -10, borderRadius: '50%',
                    border: `2px solid ${zone.color}`, pointerEvents: 'none',
                  }}
                  animate={{ scale: [1, 1.7, 1], opacity: [0.55, 0, 0.55] }}
                  transition={{ duration: 2.2, delay: idx * 0.55, repeat: Infinity, ease: 'easeOut' }}
                />
              )}

              {/* Pin circle */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2.6, delay: idx * 0.45, repeat: Infinity, ease: 'easeInOut' }}
                whileHover={!isAnswered ? { scale: 1.22, y: -7 } : {}}
                style={{
                  width: 50, height: 50, borderRadius: '50%',
                  background: 'rgba(0,0,0,0.6)',
                  border: `2.5px solid ${zone.color}99`,
                  backdropFilter: 'blur(10px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                  boxShadow: [
                    '0 4px 18px rgba(0,0,0,0.55)',
                    '0 0 0 1px rgba(255,255,255,0.08)',
                    glowColor !== 'transparent' ? `0 0 28px ${glowColor}` : '',
                  ].filter(Boolean).join(', '),
                  transition: 'border-color 0.3s, background 0.3s, box-shadow 0.3s',
                }}
              >
                {zone.icon}
              </motion.div>

              {/* Letter badge */}
              <div style={{
                width: 20, height: 20, borderRadius: '50%',
                background: zone.color,
                border: '2px solid rgba(0,0,0,0.7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 10, color: '#000',
                boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                marginTop: -4,
              }}>
                {String.fromCharCode(65 + idx)}
              </div>
            </motion.div>
          );
        })}

        <div style={{
          position: 'absolute', bottom: 7, left: 0, right: 0,
          textAlign: 'center', pointerEvents: 'none',
          fontFamily: 'var(--font-body)', fontSize: 10, color: 'rgba(255,255,255,0.4)',
        }}>
          ✦ Ocean Park Interactive Map
        </div>
      </div>

      {/* ── Option Labels BELOW the map — always fully visible ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 8, marginTop: 10,
      }}>
        {question.options && question.options.map((opt, idx) => {
          const zone = ZONE_META[idx];
          const isSelected = idx === answeredIdx;
          // No feedback variables - neutral survey mode

          return (
            <motion.div
              key={idx}
              onClick={() => !isAnswered && onAnswer(idx)}
              whileHover={!isAnswered ? { scale: 1.03, y: -2 } : {}}
              whileTap={!isAnswered ? { scale: 0.97 } : {}}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 + 0.2 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 9,
                background: 'rgba(255,255,255,0.05)',
                border: '1.5px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                padding: '9px 12px',
                cursor: isAnswered ? 'default' : 'pointer',
                backdropFilter: 'blur(8px)',
                boxShadow: 'none',
                transition: 'all 0.3s',
              }}
            >
              {/* Letter chip */}
              <div style={{
                width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                background: zone.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 12, color: '#000',
              }}>
                {String.fromCharCode(65 + idx)}
              </div>
              {/* Option text — fully visible now */}
              <span style={{
                fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12,
                color: 'rgba(255,255,255,0.85)',
                lineHeight: 1.35,
              }}>
                {opt}
              </span>
            </motion.div>
          );
        })}
      </div>


    </div>
  );
}
