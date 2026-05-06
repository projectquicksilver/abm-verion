import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Option layout: Left=Rome(0), Top=Milan(1), Right=Venice(2), Bottom=Florence(3)
// Positions match the question options array order
const DIRECTIONS = [
  { dir: 'left',   label: 'Rome',     img: '/city_rome.png',     color: '#f59e0b', glow: 'rgba(245,158,11,0.6)',   letter: 'A' },
  { dir: 'top',    label: 'Milan',    img: '/city_milan.png',    color: '#818cf8', glow: 'rgba(129,140,248,0.6)',  letter: 'B' },
  { dir: 'right',  label: 'Venice',   img: '/city_venice.png',   color: '#2DD4BF', glow: 'rgba(45,212,191,0.6)',   letter: 'C' },
  { dir: 'bottom', label: 'Florence', img: '/city_florence.png', color: '#fb923c', glow: 'rgba(251,146,60,0.6)',   letter: 'D' },
];

const DRAG_THRESHOLD = 55; // px to register as a direction choice

export default function KeyDragQuestion({
  question, answeredIdx, isAnswered, isCorrect, onAnswer, onContinue
}) {
  const [dragDir, setDragDir] = useState(null); // which direction key is being dragged toward
  const [launched, setLaunched] = useState(false); // gondola launched on selection
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const constraintsRef = useRef(null);

  // Rotate the gear as key is dragged
  const gearRotate = useTransform(x, [-100, 100], [-45, 45]);
  // Key opacity dims on drag away
  const keyOpacity = useTransform(
    x, [-120, 0, 120], [0.5, 1, 0.5]
  );

  // Detect which direction we are mostly pulling
  const handleDrag = (_, info) => {
    const { x: ox, y: oy } = info.offset;
    if (Math.abs(ox) < 20 && Math.abs(oy) < 20) { setDragDir(null); return; }
    if (Math.abs(ox) > Math.abs(oy)) {
      setDragDir(ox > 0 ? 'right' : 'left');
    } else {
      setDragDir(oy > 0 ? 'bottom' : 'top');
    }
  };

  const handleDragEnd = (_, info) => {
    const { x: ox, y: oy } = info.offset;
    setDragDir(null);

    const dist = Math.sqrt(ox * ox + oy * oy);
    if (dist < DRAG_THRESHOLD) {
      // Snap back — not far enough
      animate(x, 0, { type: 'spring', stiffness: 400, damping: 22 });
      animate(y, 0, { type: 'spring', stiffness: 400, damping: 22 });
      return;
    }

    // Determine direction chosen
    let chosenDir;
    if (Math.abs(ox) > Math.abs(oy)) {
      chosenDir = ox > 0 ? 'right' : 'left';
    } else {
      chosenDir = oy > 0 ? 'bottom' : 'top';
    }

    const idx = DIRECTIONS.findIndex(d => d.dir === chosenDir);
    if (idx === -1) return;

    // Snap key to chosen direction then report
    const snapX = chosenDir === 'right' ? 90 : chosenDir === 'left' ? -90 : 0;
    const snapY = chosenDir === 'bottom' ? 90 : chosenDir === 'top' ? -90 : 0;
    animate(x, snapX, { type: 'spring', stiffness: 300, damping: 20 });
    animate(y, snapY, { type: 'spring', stiffness: 300, damping: 20 });

    setLaunched(true);

    onAnswer(idx);
  };

  const selectedDir = answeredIdx !== null ? DIRECTIONS[answeredIdx]?.dir : null;

  return (
    <div style={{ width: '100%', userSelect: 'none' }}>
      {/* Tag + Question */}
      <div className="q-tag" style={{ marginBottom: 10 }}>
        <div className="q-tag-dot" />{question.tag}
      </div>
      <div className="q-text" style={{ marginBottom: 8 }}>{question.question_text}</div>

      <div style={{
        fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--muted2)',
        marginBottom: 16, textAlign: 'center'
      }}>
        {isAnswered ? 'Choice recorded. Moving on...' : 'Drag the key to the matching city'}
      </div>

      {/* ── Main Drag Arena ─────────────────────────────── */}
      <div
        ref={constraintsRef}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          maxHeight: 340,
          maxWidth: 340,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridTemplateRows: '1fr 1fr 1fr',
          gap: 6,
        }}
      >
        {/* Corner empty cells */}
        <div />{/* top-left empty */}

        {/* TOP: Milan (B) */}
        <CitySlot idx={1} dir="top" selectedDir={selectedDir} isAnswered={isAnswered} isCorrect={isCorrect} dragDir={dragDir} launched={launched && answeredIdx === 1} />

        <div />{/* top-right empty */}

        {/* LEFT: Rome (A) */}
        <CitySlot idx={0} dir="left" selectedDir={selectedDir} isAnswered={isAnswered} isCorrect={isCorrect} dragDir={dragDir} launched={launched && answeredIdx === 0} />

        {/* CENTER: Gear + Key */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Connection arrows */}
          {['↑','←','→','↓'].map((arrow, i) => (
            <div key={i} style={{
              position: 'absolute',
              ...(i === 0 ? { top: -4, left: '50%', transform: 'translateX(-50%)' }
                : i === 1 ? { left: -6, top: '50%', transform: 'translateY(-50%)' }
                : i === 2 ? { right: -6, top: '50%', transform: 'translateY(-50%)' }
                : { bottom: -4, left: '50%', transform: 'translateX(-50%)' }),
              color: 'rgba(255,255,255,0.2)',
              fontSize: 16,
              pointerEvents: 'none',
            }}>
              {!isAnswered ? arrow : ''}
            </div>
          ))}

          {/* Gear background */}
          <motion.div style={{ rotate: gearRotate }} transition={{ type: 'spring' }}>
            <div style={{
              width: 72, height: 72,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(45,212,191,0.15) 0%, rgba(10,20,50,0.9) 100%)',
              border: '2px solid rgba(45,212,191,0.4)',
              boxShadow: '0 0 24px rgba(45,212,191,0.25), inset 0 0 20px rgba(0,0,0,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 36,
            }}>
              ⚙️
            </div>
          </motion.div>

          {/* Draggable Key */}
          {!isAnswered && (
            <motion.div
              drag
              dragConstraints={constraintsRef}
              dragElastic={0.15}
              dragMomentum={false}
              style={{ x, y, position: 'absolute', zIndex: 20, cursor: 'grab', opacity: keyOpacity }}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              whileDrag={{ scale: 1.2, cursor: 'grabbing' }}
              animate={!isAnswered ? { rotate: [0, 5, -5, 0] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'radial-gradient(circle, #2DD4BF 0%, #0d9488 100%)',
                border: '2px solid rgba(255,255,255,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26,
                boxShadow: '0 0 20px rgba(45,212,191,0.7), 0 4px 12px rgba(0,0,0,0.5)',
              }}>
                🗝️
              </div>
            </motion.div>
          )}

          {/* Result Emojis Removed per User Request */}
        </div>

        {/* RIGHT: Venice (C) — CORRECT ANSWER */}
        <CitySlot idx={2} dir="right" selectedDir={selectedDir} isAnswered={isAnswered} isCorrect={isCorrect} dragDir={dragDir} launched={launched} />

        <div />{/* bottom-left empty */}

        {/* BOTTOM: Florence (D) */}
        <CitySlot idx={3} dir="bottom" selectedDir={selectedDir} isAnswered={isAnswered} isCorrect={isCorrect} dragDir={dragDir} launched={launched && answeredIdx === 3} />

        <div />{/* bottom-right empty */}
      </div>

      {/* Continue / Moving on */}
      {/* Feedback removed per user request */}
    </div>
  );
}

// ── City Slot (one of the 4 directional option panels) ──────────────
function CitySlot({ idx, dir, selectedDir, isAnswered, isCorrect, dragDir, launched }) {
  const meta = DIRECTIONS[idx];
  const isSelected = isAnswered && selectedDir === dir;
  const isHovered = dragDir === dir;
  // No feedback variables - neutral survey mode

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{ delay: idx * 0.08, type: 'spring', stiffness: 260, damping: 22 }}
      style={{
        width: '100%',
        aspectRatio: '1 / 1.15',
        borderRadius: 20,
        border: `2px solid ${
          isHovered ? meta.color + 'cc' : 'rgba(255,255,255,0.1)'
        }`,
        boxShadow: isHovered
            ? `0 0 16px ${meta.glow}`
            : '0 4px 16px rgba(0,0,0,0.4)',
        background: '#0d1520',
        position: 'relative',
        transition: 'border-color 0.25s, box-shadow 0.25s',
        cursor: 'default',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* City image */}
      <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
        <img
          src={meta.img}
          alt={meta.label}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            filter: isHovered ? 'brightness(1.1)' : 'brightness(0.9)',
            transition: 'filter 0.3s',
          }}
        />
        {/* Launched gondola animation for correct Venice */}
        {launched && (
          <motion.div
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 80, opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            style={{ position: 'absolute', top: '30%', fontSize: 22, pointerEvents: 'none' }}
          >
            ⛵
          </motion.div>
        )}
      </div>

      {/* Label bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '6px 8px',
        background: isSelected
          ? `linear-gradient(90deg, ${meta.color}33, transparent)`
          : 'rgba(0,0,0,0.6)',
        borderTop: `1px solid rgba(255,255,255,0.07)`,
      }}>
        <div style={{
          width: 20, height: 20, borderRadius: 6, flexShrink: 0,
          background: meta.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 10, color: '#000',
        }}>
          {meta.letter}
        </div>
        <span style={{
          fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11,
          color: 'rgba(255,255,255,0.85)',
          transition: 'color 0.3s',
        }}>
          {meta.label}
        </span>
      </div>
    </motion.div>
  );
}
