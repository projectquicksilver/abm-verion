import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Mountain } from 'lucide-react';

export default function PeakTramQuestion({
  question, answeredIdx, isAnswered, isCorrect, onAnswer, onContinue
}) {
  return (
    <div style={{ width: '100%' }}>
      {/* HUD */}
      <div className="q-tag" style={{ marginBottom: 12 }}>
        <div className="q-tag-dot" />{question.tag}
      </div>
      <div className="q-text" style={{ marginBottom: 8 }}>{question.question_text}</div>

      {/* Peak Tram Forest Track Scene */}
      <div style={{
        position: 'relative', width: '100%', height: 260,
        borderRadius: 24, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
        background: 'linear-gradient(135deg, #1e3a1e 0%, #061106 100%)', // Forest dark green
        marginBottom: 16,
      }}>
        {/* Background Skyline (Stylized) */}
        <div style={{
          position: 'absolute', bottom: -20, left: 0, right: 0, height: 160,
          background: 'linear-gradient(to top, rgba(14, 165, 233, 0.2), transparent)',
          zIndex: 1, pointerEvents: 'none'
        }} />
        {/* City silhouette */}
        <svg style={{ position: 'absolute', bottom: 0, width: '100%', height: 100, zIndex: 2, opacity: 0.4 }} viewBox="0 0 100 20" preserveAspectRatio="none">
          <path d="M0 20 V8 L5 12 L10 5 L15 10 L20 2 L25 8 L30 4 L40 12 L45 3 L55 10 L65 5 L75 12 L85 8 L95 10 V20 Z" fill="#000" />
        </svg>

        {/* The Tracks - Highly Steep (45 degrees) */}
        <div style={{
          position: 'absolute', inset: 0,
          transform: 'rotate(-35deg) translateY(40px) translateX(-50px)',
          zIndex: 3
        }}>
          {/* Main Rails */}
          <div style={{ position: 'absolute', top: '50%', left: 0, width: '200%', height: 3, background: 'rgba(255,255,255,0.15)' }} />
          <div style={{ position: 'absolute', top: '57%', left: 0, width: '200%', height: 3, background: 'rgba(255,255,255,0.15)' }} />

          {/* Ties (Sleepers) */}
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute', left: i * 40, top: '48%',
              width: 4, height: 35, background: 'rgba(255,255,255,0.1)',
              borderRadius: 2
            }} />
          ))}

          {/* THE TRAM (Red Retro Style) */}
          <motion.div
            animate={{}}
            transition={{ duration: 3.5, ease: 'easeInOut' }}
            style={{
              position: 'absolute', top: '50%', left: 100,
              marginTop: -16, width: 90, height: 40,
              zIndex: 10
            }}
          >
            {/* Tram Body */}
            <div style={{
              width: '100%', height: '100%', background: '#b91c1c',
              borderRadius: '6px 12px 6px 6px', position: 'relative',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              {/* Windows */}
              <div style={{ display: 'flex', gap: 6, padding: '6px 8px' }}>
                {[1, 2, 3, 4].map(w => (
                  <div key={w} style={{
                    width: 14, height: 16, background: 'rgba(200,230,255,0.3)',
                    borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)'
                  }} />
                ))}
              </div>
              {/* Gold Stripe */}
              <div style={{ position: 'absolute', bottom: 6, left: 0, right: 0, height: 3, background: '#fbbf24' }} />
              {/* Headlight */}
              <div style={{
                position: 'absolute', right: 4, top: '45%',
                width: 6, height: 6, borderRadius: '50%', background: '#fff',
                boxShadow: '0 0 10px #fff'
              }} />
            </div>
            {/* Wheels */}
            <div style={{ position: 'absolute', bottom: -5, left: 10, width: 12, height: 12, borderRadius: '50%', background: '#111' }} />
            <div style={{ position: 'absolute', bottom: -5, right: 10, width: 12, height: 12, borderRadius: '50%', background: '#111' }} />
          </motion.div>
        </div>

        {/* Foreground Forest Leaves (Parallax effect) */}
        {[10, 80].map((x, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 2 }}
            style={{ position: 'absolute', bottom: -30, left: `${x}%`, fontSize: 100, zIndex: 15, opacity: 0.3, filter: 'blur(4px) grayscale(0.5)' }}
          >
            🌿
          </motion.div>
        ))}

        {/* Labels */}
        <div style={{
          position: 'absolute', top: 20, left: 20,
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.4)',
          zIndex: 20, display: 'flex', alignItems: 'center', gap: 8
        }}>
          <Mountain size={14} /> VICTORIA PEAK TRAMWAY
        </div>
      </div>

      {/* Options Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {question.options.map((opt, idx) => {
          const isSelected = idx === answeredIdx;
          // No feedback variables - neutral survey mode
          
          return (
            <motion.button
              key={idx}
              onClick={() => !isAnswered && onAnswer(idx)}
              whileHover={!isAnswered ? { scale: 1.02 } : {}}
              whileTap={!isAnswered ? { scale: 0.98 } : {}}
              style={{
                all: 'unset', padding: '16px 12px', borderRadius: 20,
                background: 'rgba(255,255,255,0.05)',
                border: '1.5px solid rgba(255,255,255,0.1)',
                cursor: isAnswered ? 'default' : 'pointer',
                opacity: 1, transition: 'all 0.3s',
                textAlign: 'center', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13,
                color: '#fff'
              }}
            >
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>OPTION {String.fromCharCode(65+idx)}</div>
              {opt}
            </motion.button>
          );
        })}
      </div>

      {/* Feedback removed per user request */}
    </div>
  );
}
