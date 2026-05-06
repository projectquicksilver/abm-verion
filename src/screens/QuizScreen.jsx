import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { ArrowRight } from 'lucide-react';
import CableCarQuestion from '../components/CableCarQuestion';
import ImageCardQuestion from '../components/ImageCardQuestion';
import BubbleQuestion from '../components/BubbleQuestion';
import MapPinQuestion from '../components/MapPinQuestion';
import KeyDragQuestion from '../components/KeyDragQuestion';
import TaxiMapQuestion from '../components/TaxiMapQuestion';
import ExcitementPollQuestion from '../components/ExcitementPollQuestion';
import TravelPollQuestion from '../components/TravelPollQuestion';
import DiamondRiseQuestion from '../components/DiamondRiseQuestion';
import TowerZoomQuestion from '../components/TowerZoomQuestion';
import PeakTramQuestion from '../components/PeakTramQuestion';
import BungeeJumpQuestion from '../components/BungeeJumpQuestion';
import HistoryScrollQuestion from '../components/HistoryScrollQuestion';
import NeonFlickerQuestion from '../components/NeonFlickerQuestion';
import SlotMachineQuestion from '../components/SlotMachineQuestion';
import './screens.css';

const QUESTION_TIME = 15; // seconds per question

export default function QuizScreen({ employee, currentSet, initialProgress, onNext }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(initialProgress?.current_question_index || 0);
  const [score, setScore] = useState(initialProgress?.score || 0);
  const [loading, setLoading] = useState(true);

  // Per-question state
  const [answeredIdx, setAnsweredIdx] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showParty, setShowParty] = useState(false);
  
  // Timer derivations based strictly on DB-started times
  const [currentQuestionStartTime, setCurrentQuestionStartTime] = useState(
    initialProgress?.current_question_start_time ? new Date(initialProgress.current_question_start_time).getTime() : Date.now()
  );
  
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [timerActive, setTimerActive] = useState(false);

  // Poll-specific state (multi-select, no correct answer)
  const [pollSubmitted, setPollSubmitted] = useState(false);

  const [answersLog, setAnswersLog] = useState(initialProgress?.answers_json || {});

  const [quizStartTime, setQuizStartTime] = useState(
    initialProgress?.started_at ? new Date(initialProgress.started_at).getTime() : Date.now()
  );

  // ─── Fetch questions & Settings ────────────────────────────────────
  useEffect(() => {
    (async () => {
      // 1. Fetch Settings (Question Limit)
      let questionLimit = 13;
      try {
        const { data: settingsData } = await supabase
          .from('quiz_settings')
          .select('max_questions')
          .single();
        if (settingsData) questionLimit = settingsData.max_questions;
      } catch (e) { console.log('quiz_settings table might not exist yet'); }

      // 2. Fetch Questions (Only Active)
      const query = supabase
        .from('questions')
        .select('*')
        .eq('question_set_id', currentSet);
      
      // Attempt to filter by is_active if column exists
      try {
        query.eq('is_active', true);
      } catch (e) { /* ignore if column missing */ }

      const { data, error } = await query.order('id', { ascending: true });

      if (data && data.length > 0) {
        // Apply question limit
        const finalQuestions = data.slice(0, questionLimit);
        setQuestions(finalQuestions);

        // FORCE TIMER RESET for Question #1
        const currentIndex = initialProgress?.current_question_index || 0;
        if (currentIndex === 0) {
          const nowMs = Date.now();
          const nowIso = new Date(nowMs).toISOString();
          
          setQuizStartTime(nowMs);
          setCurrentQuestionStartTime(nowMs);

          // Update DB immediately so server-side validation is in sync with user's screen
          await supabase
            .from('user_progress')
            .update({ 
              current_question_start_time: nowIso,
              started_at: nowIso 
            })
            .eq('employee_id', employee.employee_id)
            .eq('question_set_id', currentSet);
        }
      } else {
        console.error('Failed to fetch questions', error);
      }

      setLoading(false);
      setTimerActive(true);
    })();
  }, []);

  // ─── 10-second countdown (Server Time Bounds) ─────────────────────
  useEffect(() => {
    if (!timerActive || answeredIdx !== null || currentIndex >= questions.length) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - currentQuestionStartTime;
      const remaining = Math.ceil((15000 - elapsed) / 1000);
      
      if (remaining <= 0) {
        // Time's up — auto advance with no score
        setTimeLeft(0);
        handleNextQuestion(null);
      } else {
        setTimeLeft(remaining);
      }
    }, 250); // fast tick for reliable server-delta checking

    return () => clearInterval(interval);
  }, [timerActive, answeredIdx, currentQuestionStartTime, currentIndex]);

  // ─── Reset timer when question changes ────────────────────────────
  useEffect(() => {
    setAnsweredIdx(null);
    setIsCorrect(false);
    setShowParty(false);
    setPollSubmitted(false);
    setTimerActive(true);
  }, [currentIndex]);

  // ─── Handle option selection ──────────────────────────────────────
  const handleOptionClick = useCallback((idx) => {
    if (answeredIdx !== null || currentIndex >= questions.length) return;

    setTimerActive(false);
    setAnsweredIdx(idx);

    const q = questions[currentIndex];
    const correct = idx === q.correct_answer_index;
    if (correct) {
      setScore(s => s + 1);
    }

    // Near-instant transition (100ms) to allow the click state to register but avoid lag
    setTimeout(() => {
      handleNextQuestion(idx);
    }, 100);
  }, [answeredIdx, questions, currentIndex, score]);

  // ─── Advance to next question ─────────────────────────────────────
  const handleNextQuestion = async (answeredIdxOverride) => {
    if (currentIndex >= questions.length) return;
    
    const effectiveIdx = answeredIdxOverride ?? answeredIdx;
    const q = questions[currentIndex];
    if (!q) return;

    const wasCorrect = effectiveIdx === q.correct_answer_index;
    const finalScore = wasCorrect ? score + 1 : score;

    let answeredText = null;
    if (Array.isArray(effectiveIdx)) {
      answeredText = effectiveIdx.map(i => q?.options?.[i] || i);
    } else if (effectiveIdx !== null && q?.options) {
      answeredText = q.options[effectiveIdx] || effectiveIdx;
    } else {
      answeredText = 'timeout/none';
    }

    const newAnswersLog = {
      ...answersLog,
      [q.id]: {
        question: q.question_text,
        answered_index: effectiveIdx,
        answered_text: answeredText,
        is_correct: wasCorrect
      }
    };
    setAnswersLog(newAnswersLog);

    if (currentIndex + 1 < questions.length) {
      const stepTime = Date.now();
      
      try {
        await supabase.from('user_progress').upsert({
          employee_id: employee.employee_id,
          question_set_id: currentSet,
          score: finalScore,
          current_question_index: currentIndex + 1,
          is_completed: false,
          answers_json: newAnswersLog,
          started_at: new Date(quizStartTime).toISOString(),
          current_question_start_time: new Date(stepTime).toISOString(),
          last_activity_time: new Date().toISOString()
        }, { onConflict: 'employee_id, question_set_id' });
      } catch (upsertErr) {
        console.error('Failed to upsert current progress:', upsertErr);
      }

      // Webhook Trigger: In Progress
      try {
        fetch('https://aiautomation.digicides.com/webhook/abm-web', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: 'in_progress',
            employee_id: employee.employee_id,
            name: employee.name,
            division: employee.division,
            business_unit: employee.business_unit,
            score: finalScore,
            current_step: currentIndex + 1,
            total_questions: questions.length,
            last_question: q.question_text,
            last_answer: answeredText,
            is_correct: wasCorrect,
            started_at: new Date(quizStartTime).toISOString(),
            date: new Date().toLocaleDateString()
          })
        });
      } catch (webhookErr) { /* silent fail */ }

      setCurrentQuestionStartTime(stepTime);
      setCurrentIndex(i => i + 1);
    } else {
      const endTime = Date.now();
      try {
        await supabase.from('user_progress').upsert({
          employee_id: employee.employee_id,
          question_set_id: currentSet,
          score: finalScore,
          current_question_index: currentIndex + 1,
          is_completed: true,
          started_at: new Date(quizStartTime).toISOString(),
          completed_at: new Date(endTime).toISOString(),
          answers_json: newAnswersLog,
          last_activity_time: new Date().toISOString()
        }, { onConflict: 'employee_id, question_set_id' });

        // Webhook Trigger: Completed
        try {
          fetch('https://aiautomation.digicides.com/webhook/abm-web', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              status: 'completed',
              employee_id: employee.employee_id,
              name: employee.name,
              division: employee.division,
              business_unit: employee.business_unit,
              score: finalScore,
              current_step: questions.length,
              total_questions: questions.length,
              last_question: q.question_text,
              last_answer: answeredText,
              is_correct: wasCorrect,
              started_at: new Date(quizStartTime).toISOString(),
              completed_at: new Date(endTime).toISOString(),
              time_taken_ms: endTime - quizStartTime,
              date: new Date().toLocaleDateString()
            })
          });
        } catch (webhookErr) { /* silent fail */ }

      } catch (e) {
        console.error('Could not save progress:', e);
      }
      onNext(finalScore, endTime - quizStartTime);
    }
  };

  useEffect(() => {
    if (!loading && questions.length > 0 && currentIndex >= questions.length) {
      const endTime = Date.now();
      onNext(score, endTime - quizStartTime);
    }
  }, [loading, questions, currentIndex, score, quizStartTime, onNext]);

  if (loading || questions.length === 0) {
    return (
      <div style={{ color: 'white', fontFamily: 'var(--font-head)', textAlign: 'center' }}>
        Loading Questions...
      </div>
    );
  }

  if (currentIndex >= questions.length) {
    return (
      <div style={{ color: 'white', fontFamily: 'var(--font-head)', textAlign: 'center' }}>
        Finalizing results...
      </div>
    );
  }

  const q = questions[currentIndex];
  const isAnswered = answeredIdx !== null;
  const progressPct = (currentIndex / questions.length) * 100;
  const timerPct = (timeLeft / QUESTION_TIME) * 100;
  const timerColor = timeLeft <= 3 ? '#F43F5E' : timeLeft <= 6 ? '#FACC15' : '#22D3A3';

  // ── Open Poll: multi-select, no right/wrong ────────────────────────
  if (q.type === 'open_poll') {
    const PollComponent = q.ui_style === 'travel_poll'
      ? TravelPollQuestion
      : ExcitementPollQuestion;

    const handlePollSubmit = async (selectedIndices) => {
      setPollSubmitted(true);
      setTimerActive(false);

      const pollLog = { ...answersLog, [q.id]: selectedIndices };

      // Save poll response (selectedIndices array as score=-1 sentinel)
      try {
        await supabase.from('user_progress').upsert({
          employee_id: employee.employee_id,
          question_set_id: currentSet,
          score: score, 
          current_question_index: currentIndex,
          is_completed: false,
          started_at: new Date(quizStartTime).toISOString(),
          completed_at: new Date().toISOString(),
          answers_json: pollLog,
          last_activity_time: new Date().toISOString()
        }, { onConflict: 'employee_id, question_set_id' });
      } catch (e) { /* non-fatal */ }
      // Advance after 2.2s
      setTimeout(() => handleNextQuestion(selectedIndices), 2200);
    };

    return (
      <div className="quiz-wrap">
        <div className="progress-hud">
          <div className="progress-meta">
            <span className="p-step">QUESTION {currentIndex + 1} OF {questions.length}</span>
            <CountdownRing timeLeft={timeLeft} timerPct={timerPct} color={timerColor} />
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={q.id}
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            <PollComponent
              question={q}
              isSubmitted={pollSubmitted}
              onSubmit={handlePollSubmit}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // CableCarQuestion is completely self-contained — render it without the normal card
  if (['cable_car', 'image_card', 'bubble', 'map_pin', 'key_drag', 'taxi_map', 'diamond_rise', 'tower_zoom', 'peak_tram', 'bungee_jump', 'history_scroll', 'neon_flicker', 'slot_machine'].includes(q.ui_style)) {
    const Component =
      q.ui_style === 'cable_car'  ? CableCarQuestion
      : q.ui_style === 'image_card' ? ImageCardQuestion
      : q.ui_style === 'bubble'     ? BubbleQuestion
      : q.ui_style === 'map_pin'    ? MapPinQuestion
      : q.ui_style === 'key_drag'   ? KeyDragQuestion
      : q.ui_style === 'taxi_map'   ? TaxiMapQuestion
      : q.ui_style === 'diamond_rise' ? DiamondRiseQuestion
      : q.ui_style === 'tower_zoom'   ? TowerZoomQuestion
      : q.ui_style === 'peak_tram'    ? PeakTramQuestion
      : q.ui_style === 'bungee_jump'  ? BungeeJumpQuestion
      : q.ui_style === 'neon_flicker' ? NeonFlickerQuestion
      : q.ui_style === 'slot_machine' ? SlotMachineQuestion
      : HistoryScrollQuestion;
    return (
      <div className="quiz-wrap">
        {/* HUD */}
        <div className="progress-hud">
          <div className="progress-meta">
            <span className="p-step">QUESTION {currentIndex + 1} OF {questions.length}</span>
            <CountdownRing timeLeft={timeLeft} timerPct={timerPct} color={timerColor} />
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        {/* Party Popper */}
        {/* Party Popper Removed per User Request */}

        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            <Component
              question={q}
              answeredIdx={answeredIdx}
              isAnswered={isAnswered}
              isCorrect={isCorrect}
              timeLeft={timeLeft}
              timerPct={timerPct}
              timerColor={timerColor}
              onAnswer={handleOptionClick}
              onContinue={handleNextQuestion}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // ─── Default card layout (float / slide) ─────────────────────────
  return (
    <div className="quiz-wrap">
      {/* Party Popper Overlay */}
      {/* Party Popper Removed per User Request */}

      {/* HUD */}
      <div className="progress-hud">
        <div className="progress-meta">
          <span className="p-step">QUESTION {currentIndex + 1} OF {questions.length}</span>
          <CountdownRing timeLeft={timeLeft} timerPct={timerPct} color={timerColor} />
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          className="glass q-card"
          initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
        >
          <div className="q-tag"><div className="q-tag-dot" />{q.tag}</div>
          <div className="q-text">{q.question_text}</div>

          {/* Options */}
          {q.ui_style === 'slide'
            ? <SlideOptions q={q} answeredIdx={answeredIdx} isCorrect={isCorrect} onClick={handleOptionClick} />
            : <FloatOptions q={q} answeredIdx={answeredIdx} isCorrect={isCorrect} onClick={handleOptionClick} />
          }

          {/* Feedback Block Removed per User Request */}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Countdown Ring ─────────────────────────────────────────────────
function CountdownRing({ timeLeft, timerPct, color }) {
  const r = 14;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <svg width={34} height={34} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={17} cy={17} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={2.5} />
        <circle
          cx={17} cy={17} r={r} fill="none" stroke={color} strokeWidth={2.5}
          strokeDasharray={circ}
          strokeDashoffset={circ - (circ * timerPct) / 100}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
        />
      </svg>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color, fontWeight: 700, minWidth: 20 }}>
        {timeLeft}s
      </span>
    </div>
  );
}

// ─── Float Grid Options ─────────────────────────────────────────────
function FloatOptions({ q, answeredIdx, isCorrect, onClick }) {
  const isAnswered = answeredIdx !== null;
  const emojis = ['🌿', '🎰', '🏎️', '🚀', '🌍', '🏙️'];
  return (
    <div className="float-grid">
      {q.options && q.options.map((opt, idx) => {
        const isSelected = answeredIdx === idx;
        let cls = 'float-card';
        // No feedback classes - neutral survey mode
        return (
          <div key={idx} className={cls} onClick={() => onClick(idx)}>
            <span style={{ fontSize: 28, marginBottom: 6, display: 'block' }}>{emojis[idx % emojis.length]}</span>
            <div className="fc-key">{String.fromCharCode(65 + idx)}</div>
            <div className="fc-text">{opt}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Slide Options ──────────────────────────────────────────────────
function SlideOptions({ q, answeredIdx, isCorrect, onClick }) {
  const isAnswered = answeredIdx !== null;
  return (
    <div className="slider-options">
      {q.options && q.options.map((opt, idx) => {
        const isSelected = answeredIdx === idx;
        let cls = 'slider-opt';
        // No feedback classes - neutral survey mode
        return (
          <div key={idx} className={cls} onClick={() => onClick(idx)}>
            <div className="so-num">{String.fromCharCode(65 + idx)}</div>
            <div className="so-text">{opt}</div>
          </div>
        );
      })}
    </div>
  );
}

// PartyPopper component removed per user request — no feedback in survey mode
