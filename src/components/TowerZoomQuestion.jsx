import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function TowerZoomQuestion({
  question, answeredIdx, isAnswered, isCorrect, onAnswer, onContinue
}) {
  return (
    <div style={{ width: '100%' }}>
      {/* Tag */}
      <div className="q-tag" style={{ marginBottom: 12 }}>
        <div className="q-tag-dot" />{question.tag}
      </div>
      <div className="q-text" style={{ marginBottom: 8 }}>{question.question_text}</div>

      {/* Paris Atrium Scene */}
      <div style={{
        position: 'relative', width: '100%', height: 260,
        borderRadius: 24, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
        background: '#000',
        marginBottom: 16,
      }}>
        {/* Tower Background Image */}
        <motion.img
          src="/parisian_tower.png"
          alt="Eiffel Tower"
          transition={{ duration: 3, ease: 'easeOut' }}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            opacity: 0.7,
          }}
        />

        {/* Night Vignette */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 50%, transparent 20%, rgba(0,0,0,0.4) 100%)',
          pointerEvents: 'none',
        }} />

        {/* Success/Failure overlays removed per user request */}
      </div>

      {/* Option Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        {question.options.map((opt, idx) => {
          const isSelected = idx === answeredIdx;
          const isCorrectSel = isAnswered && isSelected && isCorrect;
          const isWrongSel = isAnswered && isSelected && !isCorrect;
          // No dimming - neutral survey mode

          const bgColor = isSelected ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)';
          const borderColor = isSelected ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.1)';

          return (
            <motion.button
              key={idx}
              onClick={() => !isAnswered && onAnswer(idx)}
              whileHover={!isAnswered ? { scale: 1.02 } : {}}
              whileTap={!isAnswered ? { scale: 0.98 } : {}}
              style={{
                all: 'unset', padding: '16px 12px', borderRadius: 18,
                background: bgColor, border: `1.5px solid ${borderColor}`,
                cursor: isAnswered ? 'default' : 'pointer',
                opacity: 1, transition: 'all 0.3s',
                display: 'flex', alignItems: 'center', gap: 10,
              }}
            >
              <div style={{
                width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                background: 'rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 12,
                color: '#fff',
              }}>
                {String.fromCharCode(65 + idx)}
              </div>
              <span style={{
                fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13,
                color: '#fff',
                lineHeight: 1.2,
              }}>
                {opt}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Footer removed per user request */}
    </div>
  );
}
