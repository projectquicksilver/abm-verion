import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import './CommitteeScreen.css';

const committeeMembers = [
  "Madhab Adhikari", "BVS Satish", "Harish Mata", "Vivek Nenawati",
  "Dr. Binay Parida", "Rajesh PK", "Nikesh Baidya", "Dinesh Kumar",
  "Sreenivasa Sarma", "Rajabardhan", "Nithya D", "Srikanth Reddy",
  "Pradeep Kumar", "Sudipta Mandal", "Mousumi S", "Vaibhav Rathi",
  "Debashish Sahoo", "Arpit Andrew Noel", "Pranay Aerra"
];

const CommitteeScreen = ({ onBack }) => {
  return (
    <motion.div 
      className="v-committee-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Prismatic Background Mesh */}
      <div className="v-bg-mesh"></div>
      <div className="v-bg-flare"></div>

      <header className="v-header">
        <button className="v-back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
          <span>RETURN</span>
        </button>
        <h1 className="v-title">CORE COMMITTEE</h1>
      </header>

      <div className="v-grid-container">
        {committeeMembers.map((name, i) => (
          <motion.div 
            key={i} 
            className="v-strip-wrapper"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: (i % 10) * 0.05 }}
          >
            <div className="v-strip">
              {/* Minimalist Tech Markers on the sides of the strip */}
              <div className="v-strip-accent v-accent-left"></div>
              <div className="v-strip-accent v-accent-right"></div>
              
              <div className="v-strip-content">
                <h2 className="v-strip-name">{name}</h2>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default CommitteeScreen;
