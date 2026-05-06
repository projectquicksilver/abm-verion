import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  List, 
  Trophy, 
  ToggleLeft, 
  ToggleRight, 
  Save, 
  RefreshCcw, 
  Search,
  ChevronRight,
  Clock,
  User,
  ShieldCheck
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import './screens.css';

export default function AdminPanel({ onExit }) {
  const [activeTab, setActiveTab] = useState('questions');
  const [questions, setQuestions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [settings, setSettings] = useState({ max_questions: 13 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    if (activeTab === 'questions') {
      const { data } = await supabase
        .from('questions')
        .select('*')
        .order('id', { ascending: true });
      if (data) setQuestions(data);
    } else if (activeTab === 'leaderboard') {
      const { data } = await supabase
        .from('user_progress')
        .select(`
          *,
          users (name, division, business_unit)
        `)
        .eq('is_completed', true)
        .order('score', { ascending: false })
        .order('completed_at', { ascending: true });
      if (data) setLeaderboard(data);
    } else if (activeTab === 'settings') {
      const { data } = await supabase
        .from('quiz_settings')
        .select('*')
        .single();
      if (data) setSettings(data);
    }
    setLoading(false);
  };

  const toggleQuestion = async (id, currentState) => {
    const { error } = await supabase
      .from('questions')
      .update({ is_active: !currentState })
      .eq('id', id);
    
    if (!error) {
      setQuestions(questions.map(q => q.id === id ? { ...q, is_active: !currentState } : q));
    }
  };

  const startEditing = (q) => {
    setEditingId(q.id);
    setEditForm({ ...q });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const saveQuestion = async () => {
    if (!editForm) return;
    setSaving(true);
    
    // Ensure index is an integer
    const updatedData = {
      ...editForm,
      correct_answer_index: parseInt(editForm.correct_answer_index)
    };

    // Remove id from update payload
    const { id, ...payload } = updatedData;

    const { error } = await supabase
      .from('questions')
      .update(payload)
      .eq('id', id);

    if (!error) {
      setQuestions(questions.map(q => q.id === id ? updatedData : q));
      setEditingId(null);
      setEditForm(null);
    } else {
      alert('Error saving question: ' + error.message);
    }
    setSaving(false);
  };

  const saveSettings = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('quiz_settings')
      .update({ max_questions: settings.max_questions })
      .eq('id', 1);
    
    setSaving(false);
  };


  const filteredQuestions = questions.filter(q => 
    q.question_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.tag?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <div className="admin-logo">
          <div className="logo-icon"><ShieldCheck size={24} /></div>
          <span>Control Panel</span>
        </div>

        <nav className="admin-nav">
          <button 
            className={`nav-item ${activeTab === 'questions' ? 'active' : ''}`}
            onClick={() => setActiveTab('questions')}
          >
            <List size={18} /> Questions
          </button>
          <button 
            className={`nav-item ${activeTab === 'leaderboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('leaderboard')}
          >
            <Trophy size={18} /> Leaderboard
          </button>
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} /> Global Settings
          </button>
        </nav>

        <button className="admin-exit" onClick={onExit}>
          Exit Dashboard
        </button>
      </div>

      <main className="admin-main">
        <header className="admin-header">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management</h1>
          <div className="header-actions">
            <button className="refresh-btn" onClick={fetchData} disabled={loading}>
              <RefreshCcw size={16} className={loading ? 'spinning' : ''} />
            </button>
          </div>
        </header>

        <div className="admin-content">
          <AnimatePresence mode="wait">
            {activeTab === 'questions' && (
              <motion.div 
                key="questions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="search-bar">
                  <Search size={18} />
                  <input 
                    type="text" 
                    placeholder="Search questions or tags..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="questions-grid">
                  {filteredQuestions.map((q) => {
                    const isEditing = editingId === q.id;
                    return (
                      <div key={q.id} className={`admin-card q-card-mini ${!q.is_active ? 'inactive' : ''} ${isEditing ? 'editing' : ''}`}>
                        {isEditing ? (
                          <div className="edit-form-mini">
                            <div className="form-row">
                              <input 
                                className="edit-input"
                                value={editForm.tag} 
                                onChange={e => setEditForm({...editForm, tag: e.target.value})}
                                placeholder="Tag"
                              />
                            </div>
                            <textarea 
                              className="edit-textarea"
                              value={editForm.question_text}
                              onChange={e => setEditForm({...editForm, question_text: e.target.value})}
                              placeholder="Question Text"
                            />
                            <div className="options-edit">
                              {editForm.options.map((opt, idx) => (
                                <div key={idx} className="option-row">
                                  <input 
                                    type="radio" 
                                    name="correct" 
                                    checked={editForm.correct_answer_index === idx}
                                    onChange={() => setEditForm({...editForm, correct_answer_index: idx})}
                                  />
                                  <input 
                                    className="edit-input"
                                    value={opt} 
                                    onChange={e => {
                                      const newOpts = [...editForm.options];
                                      newOpts[idx] = e.target.value;
                                      setEditForm({...editForm, options: newOpts});
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                            <div className="edit-actions">
                              <button className="cancel-btn" onClick={cancelEditing}>Cancel</button>
                              <button className="save-btn-mini" onClick={saveQuestion} disabled={saving}>
                                {saving ? '...' : 'Save'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="card-header">
                              <div className="header-left">
                                <span className="card-tag">{q.tag}</span>
                              </div>
                              <div className="card-actions">
                                <button className="edit-icon-btn" onClick={() => startEditing(q)}>
                                  Edit
                                </button>
                                <button 
                                  className={`toggle-btn ${q.is_active ? 'on' : 'off'}`}
                                  onClick={() => toggleQuestion(q.id, q.is_active)}
                                >
                                  {q.is_active ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                                </button>
                              </div>
                            </div>
                            <p className="card-text">{q.question_text}</p>
                            <div className="card-footer">
                              <span className="style-badge">{q.ui_style}</span>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === 'leaderboard' && (
              <motion.div 
                key="leaderboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="leaderboard-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Player</th>
                        <th>Division</th>
                        <th>Score</th>
                        <th>Time</th>
                        <th>Completed At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((entry, idx) => {
                        const timeTaken = new Date(entry.completed_at).getTime() - new Date(entry.started_at).getTime();
                        const seconds = Math.floor(timeTaken / 1000);
                        return (
                          <tr key={entry.id}>
                            <td className="rank-cell">#{idx + 1}</td>
                            <td>
                              <div className="player-info">
                                <div className="player-avatar"><User size={14} /></div>
                                <span>{entry.users?.name || entry.employee_id}</span>
                              </div>
                            </td>
                            <td>{entry.users?.division}</td>
                            <td className="score-cell">{entry.score} pts</td>
                            <td><div className="time-cell"><Clock size={12} /> {seconds}s</div></td>
                            <td className="date-cell">{new Date(entry.completed_at).toLocaleString()}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="admin-card settings-form">
                  <div className="form-group">
                    <label>Maximum Questions per Quiz</label>
                    <p className="form-help">Users will be presented with this many questions (chosen from active ones).</p>
                    <input 
                      type="number" 
                      value={settings.max_questions}
                      onChange={(e) => setSettings({ ...settings, max_questions: parseInt(e.target.value) })}
                    />
                  </div>

                  <button className="save-btn" onClick={saveSettings} disabled={saving}>
                    {saving ? <RefreshCcw size={16} className="spinning" /> : <Save size={16} />}
                    Save Changes
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
