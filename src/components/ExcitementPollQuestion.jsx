import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const OPTION_META = [
  { img: '/poll_casino.png',       accent: '#FACC15', bg: 'linear-gradient(160deg,#1a1000,#2d1f00)', label: 'A', icon: '🎰' },
  { img: '/poll_heritage.png',     accent: '#fb923c', bg: 'linear-gradient(160deg,#1a0e00,#2d1800)', label: 'B', icon: '🏛️' },
  { img: '/poll_cuisine.png',      accent: '#2DD4BF', bg: 'linear-gradient(160deg,#001a18,#002d2a)', label: 'C', icon: '🍜' },
  { img: '/poll_entertainment.png',accent: '#e879f9', bg: 'linear-gradient(160deg,#180022,#2d003d)', label: 'D', icon: '🎉' },
];

// Character states based on selection count 0→4
const CHAR_STATES = [
  { emoji: '😐', mood: 'Hmm... planning a trip?',    color: 'rgba(255,255,255,0.5)', scale: 1    },
  { emoji: '🙂', mood: 'Ooh, sounds interesting!',   color: '#2DD4BF',               scale: 1.04 },
  { emoji: '😄', mood: 'Getting excited now!',        color: '#FACC15',               scale: 1.08 },
  { emoji: '🤩', mood: 'This is going to be EPIC!!',  color: '#fb923c',               scale: 1.14 },
  { emoji: '🥳', mood: 'ALL IN! MAX EXCITEMENT!!!',   color: '#e879f9',               scale: 1.22 },
];

const ITINERARY_LABELS = [
  'Visit Heritage Trail 🗺️',
  'Try Macanese Food 🍴',
  'Hit the Casino floor 🎰',
  'Attend the Diamond Show ✨',
];

export default function ExcitementPollQuestion({
  question, isSubmitted, onSubmit
}) {
  const [selected, setSelected] = useState(new Set());
  const [showHint, setShowHint] = useState(false);
  const [sparkPositions] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      angle: (i / 12) * 360,
      dist: 55 + Math.random() * 30,
      color: ['#FACC15','#2DD4BF','#e879f9','#fb923c'][i % 4],
      size: 4 + Math.random() * 5,
      delay: Math.random() * 0.3,
    }))
  );

  const count = selected.size;
  const charState = CHAR_STATES[Math.min(count, 4)];
  const excitementPct = (count / 4) * 100;

  // Show the "select more" hint after user picks exactly 1
  useEffect(() => {
    if (count === 1) {
      const t = setTimeout(() => setShowHint(true), 1200);
      return () => clearTimeout(t);
    } else {
      setShowHint(false);
    }
  }, [count]);

  const toggle = (idx) => {
    if (isSubmitted) return;
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleDone = () => {
    if (count === 0 || isSubmitted) return;
    onSubmit([...selected]);
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Tag */}
      <div className="q-tag" style={{ marginBottom: 10 }}>
        <div className="q-tag-dot" />{question.tag}
      </div>

      {/* Question */}
      <div className="q-text" style={{ marginBottom: 6 }}>{question.question_text}</div>

      {/* Multi-select badge hint — always visible */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: 'rgba(250,204,21,0.1)',
        border: '1px solid rgba(250,204,21,0.3)',
        borderRadius: 20, padding: '4px 12px',
        marginBottom: 14,
      }}>
        <motion.span
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ fontSize: 14 }}
        >✦</motion.span>
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
          color: 'rgba(250,204,21,0.85)',
        }}>
          Select one or all — it's your Macao itinerary!
        </span>
      </div>

      {/* ── Character + Excitement Meter ──────────── */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 18, padding: '14px 16px',
        marginBottom: 14, display: 'flex', alignItems: 'center', gap: 14,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Character avatar */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <motion.div
            key={charState.emoji}
            animate={{ scale: charState.scale }}
            transition={{ type: 'spring', stiffness: 300, damping: 14 }}
            style={{ fontSize: 48, lineHeight: 1, display: 'block', textAlign: 'center' }}
          >
            {charState.emoji}
          </motion.div>

          {/* Sparks radiating on high excitement */}
          {count >= 3 && sparkPositions.map((s, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, delay: s.delay, repeat: Infinity, repeatDelay: 1.2 }}
              style={{
                position: 'absolute',
                top: '50%', left: '50%',
                width: s.size, height: s.size,
                borderRadius: '50%',
                background: s.color,
                boxShadow: `0 0 6px ${s.color}`,
                transform: `rotate(${s.angle}deg) translateY(-${s.dist}px)`,
              }}
            />
          ))}
        </div>

        {/* Mood + Meter */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Mood text */}
          <motion.div
            key={charState.mood}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13,
              color: charState.color, marginBottom: 8,
              transition: 'color 0.4s',
            }}
          >
            {charState.mood}
          </motion.div>

          {/* Mini itinerary checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 8 }}>
            {[...selected].slice(0, 4).map((idx, i) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  fontFamily: 'var(--font-body)', fontSize: 10,
                  color: OPTION_META[idx].accent, display: 'flex', alignItems: 'center', gap: 5,
                }}
              >
                <span style={{ opacity: 0.8 }}>{question.options[idx]}</span>
              </motion.div>
            ))}
          </div>

          {/* Excitement meter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700,
              color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap',
            }}>EXCITEMENT</span>
            <div style={{
              flex: 1, height: 6, borderRadius: 6,
              background: 'rgba(255,255,255,0.08)', overflow: 'hidden',
            }}>
              <motion.div
                animate={{ width: `${excitementPct}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                style={{
                  height: '100%', borderRadius: 6,
                  background: count === 4
                    ? 'linear-gradient(90deg,#FACC15,#e879f9,#2DD4BF)'
                    : count === 3 ? 'linear-gradient(90deg,#FACC15,#fb923c)'
                    : count === 2 ? '#2DD4BF'
                    : count === 1 ? 'rgba(255,255,255,0.5)' : 'transparent',
                  boxShadow: count >= 2 ? '0 0 8px currentColor' : 'none',
                }}
              />
            </div>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 800,
              color: charState.color, minWidth: 36, textAlign: 'right',
            }}>
              {count === 4 ? 'MAX!' : `${count}/4`}
            </span>
          </div>
        </div>

        {/* Floating sparkle on max */}
        {count === 4 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            style={{
              position: 'absolute', top: 8, right: 12, fontSize: 18,
            }}
          >✨</motion.div>
        )}
      </div>

      {/* ── Option Cards (multi-select) ───────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        {question.options && question.options.map((opt, idx) => {
          const meta = OPTION_META[idx];
          const isOn = selected.has(idx);

          return (
            <motion.button
              key={idx}
              onClick={() => toggle(idx)}
              disabled={isSubmitted}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0, scale: isOn ? 1.03 : 1 }}
              transition={{ delay: idx * 0.07, type: 'spring', stiffness: 260, damping: 22 }}
              whileHover={!isSubmitted ? { y: -4, scale: 1.04 } : {}}
              whileTap={!isSubmitted ? { scale: 0.96 } : {}}
              style={{
                all: 'unset',
                display: 'flex', flexDirection: 'column',
                borderRadius: 16, overflow: 'hidden',
                border: `2px solid ${isOn ? meta.accent : 'rgba(255,255,255,0.08)'}`,
                boxShadow: isOn ? `0 0 24px ${meta.accent}55, 0 8px 24px rgba(0,0,0,0.5)` : '0 6px 20px rgba(0,0,0,0.4)',
                background: meta.bg,
                cursor: isSubmitted ? 'default' : 'pointer',
                transition: 'border-color 0.25s, box-shadow 0.25s',
                position: 'relative',
              }}
            >
              {/* Selected state indicator removed per user request */}

              {/* Image */}
              <div style={{ height: 90, overflow: 'hidden', position: 'relative' }}>
                <img src={meta.img} alt={opt} style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  filter: isOn ? 'brightness(1)' : 'brightness(0.75)',
                  transition: 'filter 0.3s',
                }} />
                {/* Color tint on select */}
                {isOn && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: `linear-gradient(180deg, ${meta.accent}22 0%, transparent 100%)`,
                    pointerEvents: 'none',
                  }} />
                )}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                  pointerEvents: 'none',
                }} />
              </div>

              {/* Label */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 7, padding: '9px 10px',
                background: isOn ? `rgba(${meta.accent === '#FACC15' ? '250,204,21' : meta.accent === '#fb923c' ? '251,146,60' : meta.accent === '#2DD4BF' ? '45,212,191' : '232,121,249'},0.12)` : 'rgba(0,0,0,0.5)',
                transition: 'background 0.3s',
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 7, flexShrink: 0,
                  background: isOn ? meta.accent : 'rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 11,
                  color: isOn ? '#000' : 'rgba(255,255,255,0.6)',
                  transition: 'background 0.3s, color 0.3s',
                }}>
                  {meta.label}
                </div>
                <span style={{
                  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 11,
                  color: isOn ? meta.accent : 'rgba(255,255,255,0.75)',
                  textAlign: 'center', lineHeight: 1.3,
                  transition: 'color 0.3s',
                }}>
                  {opt}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Smart "select more" floating hint */}
      <AnimatePresence>
        {showHint && !isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            style={{
              background: 'linear-gradient(135deg, rgba(232,121,249,0.15), rgba(45,212,191,0.1))',
              border: '1px solid rgba(232,121,249,0.35)',
              borderRadius: 14, padding: '10px 16px',
              marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10,
            }}
          >
            <motion.span
              animate={{ rotate: [0, 15, -10, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1.5 }}
              style={{ fontSize: 22, flexShrink: 0 }}
            >👆</motion.span>
            <div>
              <div style={{
                fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12,
                color: '#e879f9', marginBottom: 2,
              }}>
                Psst! You can pick more!
              </div>
              <div style={{
                fontFamily: 'var(--font-body)', fontSize: 11,
                color: 'rgba(255,255,255,0.5)',
              }}>
                The more you add, the more excited your traveller gets 🤩
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Done button */}
      {!isSubmitted && (
        <motion.button
          onClick={handleDone}
          disabled={count === 0}
          whileHover={count > 0 ? { scale: 1.03, y: -2 } : {}}
          whileTap={count > 0 ? { scale: 0.97 } : {}}
          style={{
            all: 'unset',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', padding: '14px',
            borderRadius: 14,
            background: count > 0
              ? count === 4
                ? 'linear-gradient(90deg, #FACC15, #e879f9, #2DD4BF)'
                : 'linear-gradient(90deg, #2DD4BF, #818cf8)'
              : 'rgba(255,255,255,0.05)',
            border: `1px solid ${count > 0 ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
            cursor: count > 0 ? 'pointer' : 'not-allowed',
            fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 15,
            color: count > 0 ? '#000' : 'rgba(255,255,255,0.25)',
            boxShadow: count > 0 ? '0 8px 32px rgba(45,212,191,0.35)' : 'none',
            transition: 'all 0.3s',
          }}
        >
          {count === 0 ? 'Make your picks first!' : count === 4 ? '🥳 Submit All — MAX Excitement!' : `Submit my ${count} pick${count > 1 ? 's' : ''}!`}
          {count > 0 && <ArrowRight size={18} />}
        </motion.button>
      )}

      {/* Submitted state */}
      {isSubmitted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: 'center', padding: '14px',
            background: 'linear-gradient(135deg, rgba(45,212,191,0.1), rgba(250,204,21,0.08))',
            border: '1px solid rgba(45,212,191,0.3)',
            borderRadius: 14,
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 6 }}>🎉</div>
          <div style={{
            fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 16,
            background: 'linear-gradient(90deg, #2DD4BF, #FACC15)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Itinerary Locked In!
          </div>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4,
          }}>
            Your Macao adventure awaits ✈️
          </div>
        </motion.div>
      )}
    </div>
  );
}
