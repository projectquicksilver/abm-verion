import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { QUESTION_VISUALS } from '../constants/QuestionMetadata';

const OPTION_META = [
  { img: '/opt_tea.png',    bg: 'linear-gradient(160deg, #0d2e12 0%, #1a4a20 100%)', accent: '#4ade80',  label: 'A' },
  { img: '/opt_casino.png', bg: 'linear-gradient(160deg, #1a0530 0%, #3b0f6b 100%)', accent: '#e879f9',  label: 'B' },
  { img: '/opt_auto.png',   bg: 'linear-gradient(160deg, #07162a 0%, #0f2d55 100%)', accent: '#60a5fa',  label: 'C' },
  { img: '/opt_space.png',  bg: 'linear-gradient(160deg, #06101f 0%, #0f224a 100%)', accent: '#818cf8',  label: 'D' },
];

export default function ImageCardQuestion({
  question, answeredIdx, isAnswered, isCorrect, onAnswer, onContinue
}) {
  return (
    <div style={{ width: '100%' }}>
      {/* Tag */}
      <div className="q-tag" style={{ marginBottom: 12 }}>
        <div className="q-tag-dot" />{question.tag}
      </div>

      {/* Question text */}
      <div className="q-text" style={{ marginBottom: 18 }}>{question.question_text}</div>

      {/* 2×2 Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 10,
      }}>
        {question.options && question.options.map((opt, idx) => {
          // Use metadata from local constants, then from database, then default fallback
          const localMeta = QUESTION_VISUALS[question.id] ? QUESTION_VISUALS[question.id][idx] : null;
          const meta = localMeta || (question.option_metadata && question.option_metadata[idx]) || OPTION_META[idx] || OPTION_META[0];
          const isSelected = idx === answeredIdx;
          
          return (
            <motion.button
              key={idx}
              onClick={() => !isAnswered && onAnswer(idx)}
              disabled={isAnswered}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                borderColor: isSelected ? meta.accent : 'rgba(255,255,255,0.08)',
              }}
              transition={{ delay: idx * 0.07, type: 'spring', stiffness: 260, damping: 22 }}
              whileHover={!isAnswered ? { y: -5, scale: 1.04 } : {}}
              whileTap={!isAnswered ? { scale: 0.97 } : {}}
              style={{
                all: 'unset',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                borderRadius: 16,
                overflow: 'hidden',
                border: `1.5px solid rgba(255,255,255,0.08)`,
                boxShadow: isSelected ? `0 0 20px ${meta.accent}33` : '0 6px 20px rgba(0,0,0,0.45)',
                background: meta.bg,
                cursor: isAnswered ? 'default' : 'pointer',
                transition: 'border-color 0.3s, box-shadow 0.3s',
                position: 'relative',
              }}
            >
              {/* ── Illustration (compact height) */}
              <div style={{
                width: '100%',
                height: 100,          // ← fixed compact height
                overflow: 'hidden',
                position: 'relative',
                flexShrink: 0,
              }}>
                <img
                  src={meta.img}
                  alt={opt}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block',
                    filter: isAnswered && !isSelected ? 'brightness(0.5) grayscale(0.5)' : 'brightness(0.92)',
                    transition: 'filter 0.35s',
                  }}
                />
                {/* Gradient fade into label bar */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)',
                  pointerEvents: 'none',
                }} />
              </div>

              {/* ── Label bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',   // ← CENTER aligned
                gap: 8,
                padding: '9px 12px',
                background: isSelected
                  ? `linear-gradient(90deg, ${meta.accent}44, transparent)`
                  : 'rgba(0,0,0,0.55)',
                borderTop: `1px solid rgba(255,255,255,0.07)`,
              }}>
                {/* Letter chip */}
                <div style={{
                  width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                  background: meta.accent,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 11,
                  color: '#000',
                }}>
                  {meta.label || String.fromCharCode(65 + idx)}
                </div>

                {/* Option text — centered, wraps nicely */}
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.9)',
                  lineHeight: 1.35,
                  textAlign: 'center',
                }}>
                  {opt}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Footer removed per user request */}
    </div>
  );
}
