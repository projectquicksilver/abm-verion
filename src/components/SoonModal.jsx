import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Clock } from 'lucide-react';

const SoonModal = ({ isOpen, onClose, title }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="soon-modal-overlay" onClick={onClose}>
          <motion.div 
            className="soon-modal-content glossy-panel"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="soon-modal-close" onClick={onClose}>
              <X size={20} />
            </button>
            
            <div className="soon-modal-icon-wrap">
              <div className="soon-pulse-ring" />
              <Clock size={48} className="soon-icon" />
            </div>

            <h2 className="soon-title">{title}</h2>
            <div className="soon-status-badge">
              <Sparkles size={14} />
              <span>COMING SOON</span>
            </div>
            
            <p className="soon-desc">
              We're currently curating this experience to ensure it meets our summit standards. Stay tuned for the grand reveal!
            </p>

            <button className="soon-btn-close" onClick={onClose}>
              Understood
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SoonModal;
