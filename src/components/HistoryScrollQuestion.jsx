import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, History } from 'lucide-react';

export default function HistoryScrollQuestion({
  question, answeredIdx, isAnswered, isCorrect, onAnswer, onContinue
}) {
  return (
    <div style={{ width: '100%' }}>
      {/* HUD */}
      <div className="q-tag" style={{ marginBottom: 10 }}>
        <div className="q-tag-dot" />{question.tag}
      </div>
      <div className="q-text" style={{ marginBottom: 6 }}>{question.question_text}</div>

      {/* Antique Scroll Scene */}
      <div style={{
        position: 'relative', width: '100%', height: 260,
        borderRadius: 22, overflow: 'hidden',
        background: 'linear-gradient(135deg, #09090b 0%, #18181b 100%)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
        marginBottom: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {/* Parchment Background */}
        <motion.div
           initial={{ width: 60, opacity: 0.5 }}
           animate={{ width: 80, opacity: 0.6 }}
           transition={{ duration: 1, type: 'spring', stiffness: 60 }}
           style={{
             height: '75%', background: '#e5e1d3', // Aged parchment color
             borderRadius: 4, position: 'relative',
             boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 0 40px rgba(100,80,40,0.2)',
             overflow: 'hidden', border: '1px solid #c4b58d'
           }}
        >
          {/* Scroll Rods/Edges */}
          <div style={{ position: 'absolute', top: '-5%', left: -5, width: 10, height: '110%', background: '#451a03', borderRadius: 4 }} />
          <div style={{ position: 'absolute', top: '-5%', right: -5, width: 10, height: '110%', background: '#451a03', borderRadius: 4 }} />

          {/* Decorative Borders */}
          <div style={{ position: 'absolute', inset: 8, border: '1px solid rgba(139, 92, 24, 0.2)', pointerEvents: 'none' }} />

          {/* Paper Texture Overlay */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'url("https://www.transparenttextures.com/patterns/papyros.png")', pointerEvents: 'none' }} />

          {/* Idle Emoji */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, opacity: 0.4 }}>📜</div>
        </motion.div>

        {/* Floating Icons */}
        <div style={{ position: 'absolute', right: 20, top: 20, color: 'rgba(255,255,255,0.2)' }}>
          <History size={18} />
        </div>
      </div>

      {/* Options */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        {HOTEL_OPTS.map((opt, i) => {
           const isSelected = i === answeredIdx;
           // No feedback variables - neutral survey mode

           return (
             <motion.button
               key={i}
               onClick={() => !isAnswered && onAnswer(i)}
               style={{
                 all: 'unset', padding: '16px 12px', borderRadius: 18,
                 background: 'rgba(255,255,255,0.03)',
                 border: '1.5px solid rgba(255,255,255,0.1)',
                 color: '#fff',
                 fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 13, textAlign: 'center',
                 cursor: isAnswered ? 'default' : 'pointer', opacity: 1,
                 transition: 'all 0.3s'
               }}
             >
               {opt}
             </motion.button>
           );
        })}
      </div>

      {/* Feedback removed per user request */}
    </div>
  );
}

const HOTEL_OPTS = ["Spain", "France", "Portugal", "Netherlands"];
