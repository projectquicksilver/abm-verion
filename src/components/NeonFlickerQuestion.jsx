import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function NeonFlickerQuestion({ question, onAnswer, answeredIdx, isAnswered, isCorrect }) {
  return (
    <div className="neon-container">
      <motion.div 
        className="neon-title-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="neon-tag">
          <Zap size={14} className="flicker-icon" />
          <span>{question.tag}</span>
        </div>
        <h2 className="neon-text-flicker">{question.question_text}</h2>
      </motion.div>

      <div className="neon-grid">
        {question.options.map((opt, idx) => {
          const isSelected = answeredIdx === idx;
          const isRight = idx === question.correct_answer_index;
          
          let status = '';
          if (isAnswered) {
            if (isSelected) status = 'selected';
            else status = 'dim';
          }

          return (
            <motion.button
              key={idx}
              className={`neon-card ${status}`}
              whileHover={!isAnswered ? { scale: 1.02, y: -5 } : {}}
              whileTap={!isAnswered ? { scale: 0.98 } : {}}
              onClick={() => !isAnswered && onAnswer(idx)}
            >
              <div className="neon-card-inner">
                <span className="neon-index">{String.fromCharCode(65 + idx)}</span>
                <span className="neon-opt-text">{opt}</span>
              </div>
              <div className="neon-glow-line" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
