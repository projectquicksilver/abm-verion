import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCircle, 
  AlertCircle, 
  Clock, 
  Zap 
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import './screens.css';

const HowToPlayModal = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(20);

  useEffect(() => {
    if (timeLeft === 0) {
      onComplete();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  return (
    <motion.div 
      className="modal-minimal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="modal-minimal-card"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="modal-header-mini">
          <Clock size={20} className="mini-clock" />
          <span className="mini-timer">{timeLeft}s</span>
        </div>

        <div className="modal-body-mini">
          <AnimatePresence mode="wait">
            {timeLeft > 3 ? (
              <motion.div
                key="rules"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <h2 className="mini-title">The Guidelines ✦</h2>
                <div className="mini-rule">
                  <Zap size={14} className="mini-icon" />
                  <span>Answer each question within 15 seconds.</span>
                </div>
                <div className="mini-rule">
                  <Zap size={14} className="mini-icon" />
                  <span>The quiz moves forward automatically—no backtracking.</span>
                </div>
                <div className="mini-rule">
                  <Zap size={14} className="mini-icon" />
                  <span>Unanswered questions will be marked as 0 points.</span>
                </div>
                <div className="mini-rule">
                  <Zap size={14} className="mini-icon" />
                  <span>If you exit, your progress will resume where you left off.</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="alert"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.1, opacity: 1 }}
                className="get-ready-container"
              >
                <h1 className="get-ready-glow">GET READY TO PLAY!</h1>
                <p className="get-ready-sub">Your journey begins in {timeLeft}...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mini-progress-track">
          <motion.div 
            className="mini-progress-fill"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 20, ease: "linear" }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function LoginScreen({ currentSet, onNext, onAlreadyPlayed, onBack }) {
  const [empId, setEmpId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [pendingData, setPendingData] = useState(null);

  const handleLogin = async () => {
    if (!empId.trim()) {
      setError('Please enter your Employee ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Check Supabase allowlist
      const { data, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('employee_id', empId.trim())
        .single();

      if (dbError || !data) {
        setError('Employee ID not found. Please verify and try again.');
        setLoading(false);
        return;
      }

      // Check if they have already played THIS specific question set
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('employee_id', data.employee_id)
        .eq('question_set_id', currentSet)
        .single();

      if (progressData && progressData.is_completed) {
        const timeStarted = new Date(progressData.started_at).getTime();
        const timeCompleted = new Date(progressData.completed_at).getTime();
        const timeTaken = timeCompleted - timeStarted;
        
        onAlreadyPlayed(data, progressData.score, timeTaken);
        return;
      }

      // Success! Pass the user data back to App state
      const { data: finalProgress, error: upsertError } = await supabase
        .from('user_progress')
        .upsert({
          employee_id: data.employee_id,
          question_set_id: currentSet,
          score: progressData?.score || 0,
          current_question_index: progressData?.current_question_index || 0,
          is_completed: false,
          answers_json: progressData?.answers_json || {},
          started_at: progressData?.started_at || new Date().toISOString()
        }, { onConflict: 'employee_id, question_set_id' })
        .select('*')
        .single();
      
      if (upsertError) throw upsertError;

      // Instead of calling onNext, we show the How to Play modal
      setPendingData({ user: data, progress: finalProgress });
      setShowHowToPlay(true);
    } catch (err) {
      setError('Connection error or database issue. Please try again.');
      setLoading(false);
    }
  };

  const handleModalComplete = () => {
    if (pendingData) {
      onNext(pendingData.user, pendingData.progress);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  }

  return (
    <>
      <AnimatePresence>
        {showHowToPlay && <HowToPlayModal onComplete={handleModalComplete} />}
      </AnimatePresence>

      {/* BACK BUTTON */}
      {onBack && (
        <button 
          onClick={onBack}
          style={{
            position: 'absolute',
            top: 24,
            left: 24,
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '20px',
            fontFamily: 'var(--font-head)',
            fontSize: '12px',
            cursor: 'pointer',
            zIndex: 100,
            backdropFilter: 'blur(5px)'
          }}
        >
          ← BACK
        </button>
      )}

      <motion.div 
        className="glass input-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="input-header">
          <div className="badge" style={{ marginBottom: 16 }}>
            <div className="badge-dot"></div>
            Secure Access
          </div>
          <h2 className="input-title">Who's exploring?</h2>
          <p className="input-sub">Enter your Coromandel ID to sync your journey.</p>
        </div>

        <div className="field">
          <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <UserCircle size={14} /> Employee ID
          </label>
          <input 
            className="field-input" 
            type="text" 
            placeholder="e.g. 98765" 
            value={empId}
            onChange={(e) => setEmpId(e.target.value.toUpperCase())}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            disabled={loading || showHowToPlay}
          />
        </div>

        {error && (
          <motion.div 
            className="error-msg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle size={16} /> {error}
          </motion.div>
        )}

        <button 
          className="submit-btn" 
          onClick={handleLogin}
          disabled={loading || showHowToPlay}
        >
          {loading ? 'Verifying...' : 'Begin My Journey ✦'}
        </button>
      </motion.div>
    </>
  );
}
