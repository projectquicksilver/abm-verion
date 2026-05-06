import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SlotMachineQuestion({ question, onAnswer, answeredIdx, isAnswered, isCorrect }) {
  const [spinning, setSpinning] = useState(true);
  const [stoppedIndices, setStoppedIndices] = useState([]);

  useEffect(() => {
    if (spinning) {
      const timers = question.options.map((_, i) => 
        setTimeout(() => {
          setStoppedIndices(prev => [...prev, i]);
          if (i === question.options.length - 1) setSpinning(false);
        }, 600 + i * 300)
      );
      return () => timers.forEach(t => clearTimeout(t));
    }
  }, [spinning, question.options]);

  return (
    <div className="slot-machine-wrap">
      <div className="slot-header">
        <div className="slot-tag">{question.tag}</div>
        <h2 className="slot-title">{question.question_text}</h2>
      </div>

      <div className="slots-container">
        {question.options.map((opt, idx) => {
          const isStopped = stoppedIndices.includes(idx);
          const isSelected = answeredIdx === idx;
          const isRight = idx === question.correct_answer_index;
          
          let status = '';
          if (isAnswered) {
            if (isSelected) status = 'selected';
          }

          return (
            <motion.div
              key={idx}
              className={`slot-item ${status} ${!isStopped ? 'spinning' : ''}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => !spinning && !isAnswered && onAnswer(idx)}
            >
              <div className="slot-reel">
                <AnimatePresence mode="wait">
                  {!isStopped ? (
                    <motion.div 
                      key="spin"
                      className="slot-spin-content"
                      animate={{ y: [0, -100] }}
                      transition={{ repeat: Infinity, duration: 0.2, ease: "linear" }}
                    >
                      {['🎰', '🍒', '💎', '7️⃣'].map((emoji, eIdx) => (
                        <div key={eIdx} className="slot-emoji">{emoji}</div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="final"
                      className="slot-final-content"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      <div className="slot-letter">{String.fromCharCode(65 + idx)}</div>
                      <div className="slot-text">{opt}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {!spinning && !isAnswered && <div className="slot-click-hint">SELECT</div>}
            </motion.div>
          );
        })}
      </div>
      
      <div className="slot-lever-decoration">
        <div className="lever-base" />
        <motion.div 
          className="lever-arm"
          animate={spinning ? { rotateX: [0, 45, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="lever-ball" />
        </motion.div>
      </div>
    </div>
  );
}
