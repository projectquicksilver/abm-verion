import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Wind } from 'lucide-react';

export default function BungeeJumpQuestion({
  question, answeredIdx, isAnswered, isCorrect, onAnswer, onContinue
}) {
  const [jumpStarted, setJumpStarted] = useState(false);

  const handlePick = (idx) => {
    if (isAnswered) return;
    onAnswer(idx);
  };

  return (
    <div style={{ width: '100%' }}>
      {/* HUD */}
      <div className="q-tag" style={{ marginBottom: 10 }}>
        <div className="q-tag-dot" />{question.tag}
      </div>
      <div className="q-text" style={{ marginBottom: 6 }}>{question.question_text}</div>

      {/* Jump Perspective Scene */}
      <div style={{
        position: 'relative', width: '100%', height: 280,
        borderRadius: 26, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: '0 24px 70px rgba(0,0,0,0.8)',
        backgroundColor: '#0a0a1a',
        backgroundImage: "url('/bg-macao.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        marginBottom: 16,
      }}>
        {/* Dark Vignette Overlay for depth */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.6) 100%)',
          pointerEvents: 'none'
        }} />

        {/* Height Meter */}
        <div 
          style={{
            position: 'absolute', left: 20, top: '40%', zIndex: 30,
            padding: '4px 10px', borderRadius: 8, background: 'rgba(0,0,0,0.6)', border: '1px solid #FACC15',
            display: 'flex', alignItems: 'center', gap: 6, color: '#FACC15',
            boxShadow: '0 4px 15px rgba(250, 204, 21, 0.3)',
            backdropFilter: 'blur(4px)'
          }}
        >
          <Wind size={14} /> <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700 }}>233m EDGE</span>
        </div>
      </div>

      {/* Options */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {question.options.map((opt, idx) => {
          const isSelected = idx === answeredIdx;
          // No feedback variables - neutral survey mode

          return (
            <motion.button
              key={idx}
              onClick={() => handlePick(idx)}
              whileHover={!isAnswered ? { y: -5, background: 'rgba(250,204,21,0.1)' } : {}}
              whileTap={!isAnswered ? { scale: 0.95 } : {}}
              style={{
                all: 'unset', padding: '16px 12px', borderRadius: 18,
                background: 'rgba(255,255,255,0.04)',
                border: '2px solid rgba(255,255,255,0.08)',
                cursor: isAnswered ? 'default' : 'pointer',
                opacity: 1, transition: 'all 0.3s',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4
              }}
            >
              <div style={{ fontSize: 10, color: 'var(--muted2)', fontWeight: 700 }}>HEIGHT</div>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 15, color: '#fff' }}>{opt}</div>
            </motion.button>
          );
        })}
      </div>

      {/* Flow buttons removed per user request */}
    </div>
  );
}
