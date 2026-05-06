import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VEHICLES = [
  {
    idx: 0, key: 'ferry', label: 'Ferry', icon: '⛴️', letter: 'A',
    zone: 'water', accent: '#22D3EE', glow: 'rgba(34,211,238,0.55)',
    hint: '~60 min · Pearl River Delta',
    trailColor: 'rgba(34,211,238,0.4)',
  },
  {
    idx: 1, key: 'bus', label: 'Bus', icon: '🚌', letter: 'B',
    zone: 'road', accent: '#FACC15', glow: 'rgba(250,204,21,0.5)',
    hint: 'Via HKZMB Bridge · 40 min',
    trailColor: 'rgba(250,204,21,0.35)',
  },
  {
    idx: 2, key: 'car', label: 'Car', icon: '🚗', letter: 'C',
    zone: 'road', accent: '#fb923c', glow: 'rgba(251,146,60,0.5)',
    hint: 'Via HKZMB Bridge · 35 min',
    trailColor: 'rgba(251,146,60,0.35)',
  },
  {
    idx: 3, key: 'helicopter', label: 'Helicopter', icon: '🚁', letter: 'D',
    zone: 'sky', accent: '#e879f9', glow: 'rgba(232,121,249,0.55)',
    hint: '16 min · Most premium!',
    trailColor: 'rgba(232,121,249,0.4)',
  },
];

// Pre-generate stars for sky zone
const STARS = Array.from({ length: 30 }, (_, i) => ({
  x: Math.random() * 100,
  y: Math.random() * 85,
  size: 0.8 + Math.random() * 2,
  dur: 1.5 + Math.random() * 2.5,
  delay: Math.random() * 3,
}));

export default function TravelPollQuestion({ question, isSubmitted, onSubmit }) {
  const [chosen, setChosen] = useState(null);
  const [launched, setLaunched] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [progress, setProgress] = useState(0);

  const vehicle = chosen !== null ? VEHICLES[chosen] : null;

  const handlePick = (idx) => {
    if (chosen !== null) return;
    setChosen(idx);
    setLaunched(true);
    // Progress ticker
    let p = 0;
    const t = setInterval(() => {
      p += 2.5;
      setProgress(Math.min(p, 100));
      if (p >= 100) clearInterval(t);
    }, 55);
    setTimeout(() => { setArrived(true); onSubmit([idx]); }, 2400);
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Tag */}
      <div className="q-tag" style={{ marginBottom: 10 }}>
        <div className="q-tag-dot" />{question.tag}
      </div>
      <div className="q-text" style={{ marginBottom: 8 }}>{question.question_text}</div>

      {/* Subtitle */}
      <div style={{
        fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--muted2)',
        marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>🗺️</motion.span>
        {chosen === null
          ? 'Select your ride — watch it journey to Macao!'
          : `${vehicle.label} is on its way…`}
      </div>

      {/* ════════════════════════════════════════════
          SCENE PANEL (3 stacked environment zones)
      ════════════════════════════════════════════ */}
      <div style={{
        borderRadius: 22, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 24px 80px rgba(0,0,0,0.8)',
        marginBottom: 14,
      }}>

        {/* ── ZONE 1: SKY ─────────────────────────── */}
        <div style={{
          position: 'relative', height: 90, overflow: 'hidden',
          background: 'linear-gradient(180deg, #010616 0%, #060d2a 55%, #0d1840 100%)',
        }}>
          {/* Stars */}
          {STARS.map((s, i) => (
            <motion.div key={i} style={{
              position: 'absolute', borderRadius: '50%', background: '#fff',
              width: s.size, height: s.size, left: `${s.x}%`, top: `${s.y}%`,
              pointerEvents: 'none',
            }}
              animate={{ opacity: [0.15, 1, 0.15], scale: [0.8, 1.4, 0.8] }}
              transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}

          {/* Moon */}
          <div style={{
            position: 'absolute', top: 10, right: 18,
            width: 22, height: 22, borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #fffbe0, #facc15aa)',
            boxShadow: '0 0 16px rgba(250,204,21,0.4)',
          }} />

          {/* Clouds with depth */}
          {[{ x: 8, y: 30, w: 70, op: 0.13 }, { x: 35, y: 18, w: 50, op: 0.09 }, { x: 65, y: 38, w: 40, op: 0.08 }].map((c, i) => (
            <motion.div key={i}
              animate={{ x: [0, 8, 0] }}
              transition={{ duration: 5 + i * 1.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute', left: `${c.x}%`, top: `${c.y}%`,
                width: c.w, height: 22, borderRadius: 14,
                background: `rgba(255,255,255,${c.op})`,
                pointerEvents: 'none',
              }}
            />
          ))}

          {/* Zone label */}
          <div style={{
            position: 'absolute', left: 12, top: 10,
            fontFamily: 'var(--font-mono)', fontSize: 8, fontWeight: 700,
            color: 'rgba(232,121,249,0.6)', letterSpacing: 2,
          }}>✦ AIR ROUTE</div>

          {/* HK label */}
          <div style={{ position: 'absolute', left: 12, bottom: 10, fontSize: 14, filter: 'drop-shadow(0 0 8px rgba(232,121,249,0.6))' }}>🏙️</div>
          <div style={{ position: 'absolute', left: 32, bottom: 13, fontFamily: 'var(--font-mono)', fontSize: 7, color: 'rgba(255,255,255,0.3)' }}>HONG KONG</div>

          {/* Macao destination */}
          <div style={{ position: 'absolute', right: 12, bottom: 10, fontSize: 16, filter: 'drop-shadow(0 0 10px rgba(232,121,249,0.7))' }}>
            🏯
          </div>
          <div style={{ position: 'absolute', right: 34, bottom: 13, fontFamily: 'var(--font-mono)', fontSize: 7, color: 'rgba(255,255,255,0.3)' }}>MACAO</div>

          {/* Dotted route line */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="8" y1="70" x2="92" y2="30"
              stroke="rgba(232,121,249,0.2)" strokeWidth="0.5" strokeDasharray="2,3" />
          </svg>

          {/* HELICOPTER vehicle */}
          {chosen === 3 && (
            <motion.div
              style={{ position: 'absolute', top: '55%', left: '10%', zIndex: 10, pointerEvents: 'none' }}
              animate={launched ? { x: '780%', y: '-55%' } : { y: [0, -4, 0] }}
              transition={launched
                ? { duration: 2.2, ease: [0.25, 0.46, 0.45, 0.94] }
                : { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Rotor blur */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.18, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute', top: -10, left: -2,
                  width: 36, height: 5, borderRadius: 4,
                  background: 'rgba(232,121,249,0.3)',
                  transformOrigin: '50% 50%',
                }}
              />
              <span style={{ fontSize: 30, lineHeight: 1, display: 'block', transform: 'scaleX(-1)' }}>🚁</span>
              {/* Engine exhaust */}
              {launched && [0, 1, 2, 3].map((ti) => (
                <motion.div key={ti}
                  style={{
                    position: 'absolute', top: '60%', left: '-2px',
                    width: 8 - ti * 1.5, height: 4,
                    background: `rgba(232,121,249,${0.35 - ti * 0.07})`,
                    borderRadius: 4,
                  }}
                  animate={{ x: [0, -15 - ti * 10], opacity: [0.7, 0] }}
                  transition={{ duration: 0.4, repeat: Infinity, delay: ti * 0.06 }}
                />
              ))}
            </motion.div>
          )}
        </div>

        {/* Thin divider */}
        <div style={{ height: 1.5, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }} />

        {/* ── ZONE 2: ROAD ────────────────────────── */}
        <div style={{
          position: 'relative', height: 90, overflow: 'hidden',
          background: 'linear-gradient(180deg, #0a0e08 0%, #0f1408 55%, #151a0a 100%)',
        }}>
          {/* Background mountains silhouette */}
          <svg style={{ position: 'absolute', bottom: 32, left: 0, width: '100%', height: 40, pointerEvents: 'none', opacity: 0.35 }} viewBox="0 0 100 40" preserveAspectRatio="none">
            <path d="M0 40 L8 18 L14 28 L22 8 L30 20 L40 12 L50 22 L60 5 L70 18 L80 10 L90 22 L100 15 L100 40Z" fill="#1a2a0a" />
          </svg>

          {/* Road surface with perspective lines */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 36,
            background: 'linear-gradient(180deg, #1c1c1c 0%, #121212 100%)',
            borderTop: '1.5px solid rgba(255,255,255,0.07)',
          }}>
            {/* Center dashes */}
            <div style={{ position: 'absolute', top: '45%', left: 0, right: 0, display: 'flex', gap: 10, padding: '0 10px' }}>
              {[...Array(12)].map((_, i) => (
                <motion.div key={i}
                  animate={{ opacity: [0.25, 0.6, 0.25] }}
                  transition={{ duration: 0.7, delay: i * 0.06, repeat: Infinity }}
                  style={{ width: 20, height: 2, background: '#FACC15', borderRadius: 1, flexShrink: 0 }}
                />
              ))}
            </div>
            {/* Edge lines */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1.5, background: 'rgba(255,255,255,0.1)' }} />
          </div>

          {/* Suspension bridge towers */}
          <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 100 100" preserveAspectRatio="none">
            {[28, 60].map((tx, i) => (
              <g key={i}>
                <rect x={tx - 0.8} y="10" width="1.6" height="72" fill="rgba(200,200,220,0.18)" rx="0.3" />
                <rect x={tx - 3} y="9" width="6" height="3" fill="rgba(200,200,220,0.22)" rx="0.4" />
                {/* Cables */}
                <path d={`M ${tx} 12 Q ${tx - 14} 48 ${tx - 22} 72`} stroke="rgba(200,200,220,0.1)" strokeWidth="0.4" fill="none" />
                <path d={`M ${tx} 12 Q ${tx + 14} 48 ${tx + 22} 72`} stroke="rgba(200,200,220,0.1)" strokeWidth="0.4" fill="none" />
                <circle cx={tx} cy="10" r="0.8" fill="rgba(250,204,21,0.5)" />
              </g>
            ))}
          </svg>

          {/* Zone label */}
          <div style={{ position: 'absolute', left: 12, top: 10, fontFamily: 'var(--font-mono)', fontSize: 8, fontWeight: 700, color: 'rgba(250,204,21,0.6)', letterSpacing: 2 }}>✦ BRIDGE ROUTE</div>

          {/* HK + Macao icons */}
          <div style={{ position: 'absolute', left: 12, bottom: 12, fontSize: 14, filter: 'drop-shadow(0 0 8px rgba(250,204,21,0.5))' }}>🏙️</div>
          <div style={{ position: 'absolute', right: 12, bottom: 12, fontSize: 16, filter: 'drop-shadow(0 0 10px rgba(250,204,21,0.6))' }}>
            🏯
          </div>

          {/* Route dotted line */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="8" y1="63" x2="92" y2="63" stroke="rgba(250,204,21,0.12)" strokeWidth="0.5" strokeDasharray="2,3" />
          </svg>

          {/* BUS vehicle */}
          {chosen === 1 && (
            <motion.div
              style={{ position: 'absolute', bottom: 10, left: '10%', zIndex: 10, pointerEvents: 'none' }}
              animate={launched ? { x: '760%' } : { x: 0 }}
              transition={launched
                ? { duration: 2.2, ease: [0.25, 0.46, 0.45, 0.94] }
                : {}}
            >
              <motion.span
                animate={launched ? { rotate: [-1, 1, -1, 1, 0] } : {}}
                transition={{ duration: 0.25, repeat: launched ? Infinity : 0 }}
                style={{ fontSize: 28, lineHeight: 1, display: 'block', transform: 'scaleX(-1)' }}
              >🚌</motion.span>
              {/* Exhaust puffs */}
              {launched && [0, 1, 2].map((ti) => (
                <motion.div key={ti}
                  style={{
                    position: 'absolute', top: '20%', left: '-4px',
                    width: 7, height: 7, borderRadius: '50%',
                    background: `rgba(250,204,21,${0.3 - ti * 0.08})`,
                  }}
                  animate={{ x: [-8 - ti * 10, -25 - ti * 10], y: [-2, -8], opacity: [0.5, 0], scale: [0.6, 1.3] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: ti * 0.08 }}
                />
              ))}
              {/* Tyre wake */}
              {launched && [0, 1, 2, 3].map((ti) => (
                <motion.div key={ti}
                  style={{
                    position: 'absolute', bottom: 0, left: `${ti * 6}px`,
                    width: 5, height: 2, background: `rgba(250,204,21,${0.2 - ti * 0.04})`, borderRadius: 1,
                  }}
                  animate={{ x: [-6 - ti * 8, -22 - ti * 8], opacity: [0.5, 0] }}
                  transition={{ duration: 0.35, repeat: Infinity }}
                />
              ))}
            </motion.div>
          )}

          {/* CAR vehicle */}
          {chosen === 2 && (
            <motion.div
              style={{ position: 'absolute', bottom: 12, left: '10%', zIndex: 10, pointerEvents: 'none' }}
              animate={launched ? { x: '1100%' } : { x: 0 }}
              transition={launched
                ? { duration: 2.2, ease: [0.25, 0.46, 0.45, 0.94] }
                : {}}
            >
              <motion.span
                animate={launched ? { y: [0, -1, 0] } : {}}
                transition={{ duration: 0.15, repeat: Infinity }}
                style={{ fontSize: 24, lineHeight: 1, display: 'block', transform: 'scaleX(-1)' }}
              >🚗</motion.span>
              {/* Speed lines */}
              {launched && [0, 1, 2, 3, 4].map((ti) => (
                <motion.div key={ti}
                  style={{
                    position: 'absolute', top: `${30 + ti * 10}%`, left: '-2px',
                    width: 14 - ti * 2, height: 1.5,
                    background: `rgba(251,146,60,${0.35 - ti * 0.06})`, borderRadius: 1,
                  }}
                  animate={{ x: [-10 - ti * 12, -35 - ti * 12], opacity: [0.6, 0] }}
                  transition={{ duration: 0.3, repeat: Infinity, delay: ti * 0.04 }}
                />
              ))}
            </motion.div>
          )}

          {/* Streetlights */}
          {[15, 40, 65, 88].map((x, i) => (
            <div key={i} style={{ position: 'absolute', left: `${x}%`, bottom: 36, width: 1.5, height: 18, background: 'rgba(255,255,255,0.12)' }}>
              <div style={{ position: 'absolute', top: -2, left: -5, width: 12, height: 3, background: 'rgba(255,255,220,0.15)', borderRadius: 2 }} />
              <motion.div
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
                style={{ position: 'absolute', top: 1, left: -3, width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,240,180,0.06)' }}
              />
            </div>
          ))}
        </div>

        {/* Thin divider */}
        <div style={{ height: 1.5, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }} />

        {/* ── ZONE 3: WATER ───────────────────────── */}
        <div style={{
          position: 'relative', height: 90, overflow: 'hidden',
          background: 'linear-gradient(180deg, #001d2e 0%, #002a40 50%, #00374f 100%)',
        }}>
          {/* Deep-water shimmer bands */}
          {[20, 38, 55, 72, 85].map((y, i) => (
            <motion.div key={i} style={{
              position: 'absolute', left: '-5%', top: `${y}%`, width: '115%', height: i % 2 === 0 ? 2.5 : 1.5,
              background: `rgba(34,211,238,${0.06 + i * 0.015})`,
              borderRadius: 4,
            }}
              animate={{ x: ['0%', '3%', '0%'], scaleX: [1, 1.03, 1] }}
              transition={{ duration: 2.5 + i * 0.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}

          {/* Wave crests — subtle white foam */}
          {[25, 55, 78].map((y, i) => (
            <motion.div key={i} style={{
              position: 'absolute', left: '-3%', top: `${y}%`, width: '110%', height: 1.5,
              background: `rgba(255,255,255,${0.05 + i * 0.02})`,
              borderRadius: 4,
            }}
              animate={{ x: ['0%', '-4%', '0%'] }}
              transition={{ duration: 3 + i * 0.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}

          {/* Specular glints */}
          {[10, 30, 52, 70, 88].map((x, i) => (
            <motion.div key={i} style={{
              position: 'absolute', left: `${x}%`, top: `${35 + i * 8}%`,
              width: 20 + i * 8, height: 2, background: 'rgba(34,211,238,0.12)',
              borderRadius: 4,
            }}
              animate={{ opacity: [0, 0.8, 0], x: [0, 4, 0] }}
              transition={{ duration: 1.5 + i * 0.4, delay: i * 0.3, repeat: Infinity }}
            />
          ))}

          {/* Zone label */}
          <div style={{ position: 'absolute', left: 12, top: 10, fontFamily: 'var(--font-mono)', fontSize: 8, fontWeight: 700, color: 'rgba(34,211,238,0.6)', letterSpacing: 2 }}>✦ SEA ROUTE</div>

          {/* HK + Macao icons */}
          <div style={{ position: 'absolute', left: 12, bottom: 10, fontSize: 14, filter: 'drop-shadow(0 0 8px rgba(34,211,238,0.6))' }}>🏙️</div>
          <div style={{ position: 'absolute', right: 12, bottom: 10, fontSize: 16, filter: 'drop-shadow(0 0 10px rgba(34,211,238,0.7))' }}>
            🏯
          </div>

          {/* Dotted sea route */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="8" y1="55" x2="92" y2="55" stroke="rgba(34,211,238,0.15)" strokeWidth="0.5" strokeDasharray="2,3" />
          </svg>

          {/* FERRY vehicle */}
          {chosen === 0 && (
            <motion.div
              style={{ position: 'absolute', top: '25%', left: '8%', zIndex: 10, pointerEvents: 'none' }}
              animate={launched ? { x: '820%' } : { y: [0, -3, 0] }}
              transition={launched
                ? { duration: 2.2, ease: [0.25, 0.46, 0.45, 0.94] }
                : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <motion.span
                animate={launched ? { rotate: [-2, 2, -2, 2, 0] } : { rotate: [-1, 1, -1] }}
                transition={launched
                  ? { duration: 0.4, repeat: Infinity }
                  : { duration: 2, repeat: Infinity }}
                style={{ fontSize: 28, lineHeight: 1, display: 'block', transform: 'scaleX(-1)' }}
              >⛴️</motion.span>
              {/* Wake foam streaks */}
              {launched && [0, 1, 2, 3, 4].map((ti) => (
                <motion.div key={ti}
                  style={{
                    position: 'absolute', top: '65%', left: '-4px',
                    width: 12 - ti * 2, height: 3 + ti,
                    background: `rgba(34,211,238,${0.35 - ti * 0.06})`, borderRadius: 3,
                  }}
                  animate={{ x: [-8 - ti * 10, -30 - ti * 12], y: [0, ti % 2 === 0 ? 2 : -2], opacity: [0.6, 0] }}
                  transition={{ duration: 0.45, repeat: Infinity, delay: ti * 0.06 }}
                />
              ))}
              {/* Bow wave */}
              {launched && (
                <motion.div
                  style={{ position: 'absolute', top: '50%', right: '-4px', width: 6, height: 10, background: 'rgba(34,211,238,0.2)', borderRadius: '0 50% 50% 0' }}
                  animate={{ scaleY: [1, 1.4, 1], opacity: [0.5, 0.9, 0.5] }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                />
              )}
            </motion.div>
          )}
        </div>

        {/* Progress bar at bottom of scene */}
        {chosen !== null && (
          <div style={{ height: 3, background: 'rgba(255,255,255,0.05)' }}>
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
              style={{
                height: '100%',
                background: `linear-gradient(90deg, ${vehicle.accent}88, ${vehicle.accent})`,
                boxShadow: `0 0 8px ${vehicle.glow}`,
              }}
            />
          </div>
        )}
      </div>

      {/* ── Option Buttons Grid ─────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 14 }}>
        {VEHICLES.map((v) => {
          const isChosen = chosen === v.idx;
          // No dimming - neutral survey mode
          const zoneColors = { sky: '#e879f9', road: '#FACC15', water: '#22D3EE' };
          const zoneLabel = { sky: '✈ Air', road: '🛣 Road', water: '🌊 Sea' };

          return (
            <motion.button
              key={v.idx}
              onClick={() => handlePick(v.idx)}
              disabled={chosen !== null}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0, scale: isChosen ? 1.03 : 1 }}
              transition={{ delay: v.idx * 0.07, type: 'spring', stiffness: 260, damping: 22 }}
              whileHover={chosen === null ? { y: -5, scale: 1.06 } : {}}
              whileTap={chosen === null ? { scale: 0.94 } : {}}
              style={{
                all: 'unset',
                display: 'flex', flexDirection: 'column', alignItems: 'stretch',
                borderRadius: 16, overflow: 'hidden',
                border: `2px solid ${isChosen ? v.accent : 'rgba(255,255,255,0.08)'}`,
                boxShadow: isChosen
                  ? `0 0 32px ${v.glow}, 0 8px 28px rgba(0,0,0,0.6)`
                  : '0 6px 20px rgba(0,0,0,0.45)',
                cursor: chosen === null ? 'pointer' : 'default',
                background: isChosen
                  ? `linear-gradient(160deg, ${v.accent}18, rgba(5,10,30,0.97))`
                  : 'rgba(10,14,28,0.85)',
                transition: 'border-color 0.3s, box-shadow 0.3s, background 0.3s',
                position: 'relative',
              }}
            >
              {/* Zone badge top-right */}
              <div style={{
                position: 'absolute', top: 8, right: 8, zIndex: 2,
                background: `${zoneColors[v.zone]}22`,
                border: `1px solid ${zoneColors[v.zone]}55`,
                borderRadius: 6, padding: '2px 6px',
                fontFamily: 'var(--font-mono)', fontSize: 8, fontWeight: 700,
                color: zoneColors[v.zone],
              }}>
                {zoneLabel[v.zone]}
              </div>

              {/* Letter badge */}
              <div style={{
                position: 'absolute', top: 8, left: 8,
                width: 22, height: 22, borderRadius: 7, zIndex: 2,
                background: isChosen ? v.accent : 'rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 11,
                color: isChosen ? '#000' : 'rgba(255,255,255,0.5)',
                transition: 'all 0.3s',
              }}>
                {v.letter}
              </div>

              {/* Vehicle icon — large, centered */}
              <div style={{ paddingTop: 36, paddingBottom: 8, textAlign: 'center' }}>
                <motion.span
                  animate={isChosen && launched ? {
                    x: [0, 6, 12, 18, 24, 30],
                    opacity: [1, 1, 1, 0.8, 0.5, 0],
                  } : (chosen === null ? { y: [0, -3, 0] } : {})}
                  transition={isChosen && launched
                    ? { duration: 2, ease: 'easeIn' }
                    : { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: v.idx * 0.3 }}
                  style={{ fontSize: 34, lineHeight: 1 }}
                >
                  {v.icon}
                </motion.span>
              </div>

              {/* Label + hint */}
              <div style={{
                padding: '8px 12px 10px',
                background: isChosen
                  ? `linear-gradient(180deg, ${v.accent}12, ${v.accent}22)`
                  : 'rgba(0,0,0,0.4)',
                borderTop: `1px solid ${isChosen ? v.accent + '44' : 'rgba(255,255,255,0.06)'}`,
                transition: 'all 0.3s',
              }}>
                <div style={{
                  fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 14, textAlign: 'center',
                  color: isChosen ? v.accent : '#fff',
                  marginBottom: 3, transition: 'color 0.3s',
                }}>
                  {v.label}
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)', fontSize: 9, textAlign: 'center',
                  color: isChosen ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.25)',
                }}>
                  {v.hint}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Arrival card */}
      {/* Feedback removed per user request */}
    </div>
  );
}
