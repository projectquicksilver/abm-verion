import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// X positions on the cable: 0–100 (%)
const SIGN_X = [12, 35, 60, 83];

export default function CableCarQuestion({
  question, answeredIdx, isAnswered, isCorrect,
  timeLeft, timerPct, timerColor, onAnswer, onContinue
}) {
  // Cable car rests at center when unanswered, moves to selected sign when answered
  const carX = isAnswered ? SIGN_X[answeredIdx] : 50;

  const optionColors = (idx) => {
    if (!isAnswered) return { border: 'rgba(255,255,255,0.4)', bg: 'rgba(10,15,50,0.75)', text: '#fff' };
    const isSelected = idx === answeredIdx;
    if (isSelected) return { border: 'var(--gold)', bg: 'rgba(250,204,21,0.15)', text: 'var(--gold)' };
    return { border: 'rgba(255,255,255,0.12)', bg: 'rgba(10,15,50,0.35)', text: 'rgba(255,255,255,0.6)' };
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Question Badge + Text */}
      <div className="q-tag" style={{ marginBottom: 12 }}>
        <div className="q-tag-dot" />{question.tag}
      </div>
      <div className="q-text" style={{ marginBottom: 16 }}>{question.question_text}</div>

      {/* Timer Bar */}
      <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 4,
            width: `${timerPct}%`,
            background: timerColor,
            transition: 'width 1s linear, background 0.3s',
            boxShadow: `0 0 8px ${timerColor}`,
          }} />
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: timerColor, fontWeight: 700, minWidth: 24 }}>
          {timeLeft}s
        </span>
      </div>

      {/* ── Scene Panel ──────────────────────────────────────── */}
      <div style={{
        position: 'relative', width: '100%', borderRadius: 20, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        height: 220,
        background: 'linear-gradient(180deg, #0a0f2a 0%, #111b3e 40%, #0d1a10 100%)',
      }}>

        {/* CSS Cityscape */}
        <CSSCityscape />

        {/* Water shimmer at bottom */}
        <div style={{
          position: 'absolute', bottom: 50, left: 0, right: 0, height: 28,
          background: 'linear-gradient(180deg, rgba(30,100,180,0.0) 0%, rgba(30,100,180,0.35) 100%)',
        }} />

        {/* Ground */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 52,
          background: 'linear-gradient(180deg, rgba(10,15,10,0) 0%, rgba(12,20,12,0.98) 100%)',
        }} />

        {/* Cable wire */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '55%', pointerEvents: 'none' }}
          preserveAspectRatio="none" viewBox="0 0 100 30">
          <path d="M 0 10 Q 30 16 50 14 Q 70 12 100 16"
            stroke="rgba(200,215,255,0.6)" strokeWidth="0.35" fill="none" />
          <path d="M 0 11 Q 30 17 50 15 Q 70 13 100 17"
            stroke="rgba(200,215,255,0.2)" strokeWidth="0.15" fill="none" />
          {/* Tower supports */}
          {[18, 50, 82].map(x => (
            <React.Fragment key={x}>
              <line x1={x} y1="4" x2={x} y2="16" stroke="rgba(200,215,255,0.3)" strokeWidth="0.4" />
              <rect x={x - 1.2} y="3" width="2.4" height="1.5" fill="rgba(180,200,255,0.4)" rx="0.3" />
            </React.Fragment>
          ))}
        </svg>

        {/* ── Cable Car ──────────────────────────── */}
        <motion.div
          animate={{ left: `${carX}%` }}
          initial={{ left: '50%' }}
          transition={{ type: 'spring', stiffness: 55, damping: 16 }}
          style={{ position: 'absolute', top: '12%', transform: 'translateX(-50%)', zIndex: 12, pointerEvents: 'none' }}
        >
          {/* Hanger */}
          <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', width: 2, height: 16, background: 'rgba(200,215,255,0.7)' }} />
          {/* Wheel on wire */}
          <div style={{ position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)', width: 11, height: 11, borderRadius: '50%', background: '#c8d7ff', border: '2px solid white' }} />
          {/* Car body */}
          <div style={{
            background: 'linear-gradient(180deg, rgba(80,100,200,0.2) 0%, rgba(10,20,60,0.92) 100%)',
            border: '1.5px solid rgba(150,180,255,0.5)', borderRadius: 10, padding: '7px 14px',
            backdropFilter: 'blur(16px)', boxShadow: '0 8px 28px rgba(0,0,0,0.6), 0 0 18px rgba(150,180,255,0.25)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 50,
          }}>
            <span style={{ fontSize: 26, lineHeight: 1 }}>🚡</span>
          </div>
        </motion.div>

        {/* ── Sign Buttons ───────────────────────── */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end',
          padding: '0 6px 10px',
        }}>
          {question.options && question.options.map((opt, idx) => {
            const c = optionColors(idx);
            const isSelected = idx === answeredIdx;
            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Pole */}
                <div style={{ width: 2, height: 14, background: 'rgba(180,180,200,0.5)', marginBottom: 0 }} />
                <motion.button
                  onClick={() => !isAnswered && onAnswer(idx)}
                  whileHover={!isAnswered ? { y: -5, scale: 1.07 } : {}}
                  whileTap={!isAnswered ? { scale: 0.94 } : {}}
                  style={{
                    background: c.bg, border: `2px solid ${c.border}`,
                    borderRadius: 10, padding: '8px 10px', cursor: isAnswered ? 'default' : 'pointer',
                    backdropFilter: 'blur(12px)', boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                    fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 12,
                    color: c.text, minWidth: 60, textAlign: 'center',
                    transition: 'all 0.3s',
                    position: 'relative',
                  }}
                >
                  {opt}
                </motion.button>
              </div>
            );
          })}
        </div>
      </div>


    </div>
  );
}

// Pure CSS stylized HK Cityscape
function CSSCityscape() {
  const buildings = [
    { x: 2, w: 6, h: 55, color: 'rgba(30,45,100,0.9)' },
    { x: 9, w: 5, h: 70, color: 'rgba(25,40,90,0.85)' },
    { x: 15, w: 8, h: 50, color: 'rgba(20,35,80,0.9)' },
    { x: 24, w: 6, h: 80, color: 'rgba(30,50,110,0.9)', antenna: true },
    { x: 31, w: 9, h: 60, color: 'rgba(25,40,95,0.85)' },
    { x: 41, w: 5, h: 90, color: 'rgba(35,55,120,0.9)', antenna: true },
    { x: 47, w: 7, h: 65, color: 'rgba(20,38,88,0.85)' },
    { x: 55, w: 5, h: 55, color: 'rgba(30,45,100,0.9)' },
    { x: 61, w: 6, h: 75, color: 'rgba(40,60,130,0.9)', antenna: true },
    { x: 68, w: 8, h: 58, color: 'rgba(25,42,95,0.85)' },
    { x: 77, w: 5, h: 50, color: 'rgba(20,35,82,0.9)' },
    { x: 83, w: 7, h: 68, color: 'rgba(35,52,115,0.9)' },
    { x: 91, w: 5, h: 45, color: 'rgba(28,44,100,0.85)' },
  ];

  const neonWindows = Array.from({ length: 40 }).map((_, i) => ({
    x: 2 + Math.random() * 96,
    y: 20 + Math.random() * 50,
    color: ['#FACC15', '#8B5CF6', '#2DD4BF', '#60a5fa', '#fb923c', '#f472b6'][i % 6],
    size: 1.5 + Math.random() * 3,
  }));

  return (
    <svg
      style={{ position: 'absolute', bottom: 50, left: 0, width: '100%', height: '70%', pointerEvents: 'none' }}
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#060c24" />
          <stop offset="100%" stopColor="#0d1a3e" />
        </linearGradient>
        <linearGradient id="harborGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a2050" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#051030" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* Buildings */}
      {buildings.map((b, i) => (
        <rect key={i} x={`${b.x}%`} y={`${100 - b.h}%`} width={`${b.w}%`} height={`${b.h}%`} fill={b.color} rx="0.5" />
      ))}

      {/* Antenna */}
      {buildings.filter(b => b.antenna).map((b, i) => (
        <line key={i} x1={`${b.x + b.w / 2}%`} y1={`${100 - b.h - 8}%`} x2={`${b.x + b.w / 2}%`} y2={`${100 - b.h}%`}
          stroke="rgba(200,200,220,0.6)" strokeWidth="0.4" />
      ))}

      {/* Window neon lights */}
      {neonWindows.map((w, i) => (
        <rect key={i} x={`${w.x}%`} y={`${w.y}%`} width={`${w.size * 0.6}%`} height={`${w.size * 0.35}%`}
          fill={w.color} opacity={0.55 + Math.random() * 0.4} rx="0.2" />
      ))}

      {/* Harbor reflection */}
      <rect x="0" y="88%" width="100%" height="12%" fill="url(#harborGrad)" />
    </svg>
  );
}
