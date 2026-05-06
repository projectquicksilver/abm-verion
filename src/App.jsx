import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Screens
import WelcomeScreen from './screens/WelcomeScreen';
import LandingScreen from './screens/LandingScreen';
import LoginScreen from './screens/LoginScreen';
import LoaderScreen from './screens/LoaderScreen';
import QuizScreen from './screens/QuizScreen';
import CompletionScreen from './screens/CompletionScreen';
import AdminPanel from './screens/AdminPanel'; // New

import './index.css';

// Central configuration for the current active quiz
const ACTIVE_QUESTION_SET = 'macao_2025';

function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome'); // welcome, landing, login, loader, quiz, completion, admin
  const [employee, setEmployee] = useState(null);
  const [initialProgress, setInitialProgress] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);

  // Check for admin passcode in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'Caffeine') {
      setCurrentScreen('admin');
      
      // HIGH SECURITY: Immediately wipe the passcode from the address bar
      // This prevents the password from showing in browser history or to onlookers
      const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.replaceState({ path: newUrl }, '', newUrl);
    }
  }, []);

  const screenVariants = {
    initial: { opacity: 0, y: 30 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -40 }
  };

  const transition = { type: 'spring', damping: 25, stiffness: 200 };

  return (
    <>
      {currentScreen !== 'welcome' && currentScreen !== 'admin' && (
        <>
          <div id="ambientBg">
            <div className="orb orb1"></div>
            <div className="orb orb2"></div>
            <div className="orb orb3"></div>
          </div>
          <div className="bg-grid"></div>
        </>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          className={`screen-container ${currentScreen === 'welcome' ? 'welcome-mode' : ''} ${currentScreen === 'admin' ? 'admin-mode' : ''}`}
          variants={screenVariants}
          initial="initial"
          animate="in"
          exit="out"
          transition={transition}
          style={{ width: '100%', height: '100%' }}
        >
          {currentScreen === 'admin' && <AdminPanel key="admin-screen" onExit={() => setCurrentScreen('welcome')} />}

          {currentScreen === 'welcome' && <WelcomeScreen key="welcome-screen" onNext={() => setCurrentScreen('landing')} />}

          {currentScreen === 'landing' && <LandingScreen key="landing-screen" onNext={() => setCurrentScreen('login')} onHome={() => setCurrentScreen('welcome')} />}
          
          {currentScreen === 'login' && 
            <LoginScreen 
              key="login-screen"
              currentSet={ACTIVE_QUESTION_SET}
              onBack={() => setCurrentScreen('landing')}
              onNext={(emp, progressData) => { 
                setEmployee(emp); 
                setInitialProgress(progressData);
                setCurrentScreen('loader'); 
              }} 
              onAlreadyPlayed={(emp, score, time) => {
                setEmployee(emp);
                setQuizScore(score);
                setTimeTaken(time);
                setCurrentScreen('completion');
              }}
            />
          }
          
          {currentScreen === 'loader' && 
            <LoaderScreen key="loader-screen" employee={employee} onNext={() => setCurrentScreen('quiz')} />
          }
          
          {currentScreen === 'quiz' && 
            <QuizScreen 
              key="quiz-screen"
              employee={employee} 
              initialProgress={initialProgress}
              currentSet={ACTIVE_QUESTION_SET}
              onNext={(score, time) => { 
                setQuizScore(score); 
                setTimeTaken(time); 
                setCurrentScreen('completion'); 
              }} 
            />
          }
          
          {currentScreen === 'completion' && 
            <CompletionScreen 
              key="completion-screen"
              employee={employee}
              score={quizScore} 
              timeTaken={timeTaken || 0} 
              onRestart={() => setCurrentScreen('welcome')} 
            />
          }
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default App;
