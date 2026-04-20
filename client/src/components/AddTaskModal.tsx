import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Task } from '../types';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; date: string; startTime?: string }) => void;
  selectedDate: string;
  editingTask?: Task | null;
}

export default function AddTaskModal({ isOpen, onClose, onSubmit, selectedDate, editingTask }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(selectedDate);
  const [startTime, setStartTime] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setDate(editingTask.date);
      setStartTime(editingTask.startTime || '');
    } else {
      setTitle('');
      setDescription('');
      setDate(selectedDate);
      setStartTime('');
    }
  }, [editingTask, selectedDate, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      date,
      startTime: startTime || undefined,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 50,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 51,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 16px',
            }}
          >
            <div style={{
              width: '100%', maxWidth: 480,
              background: '#0d1120',
              border: '1px solid rgba(124,58,237,0.25)',
              borderRadius: 24,
              padding: '32px',
              boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {editingTask ? '✏️ Edit Task' : '✨ New Task'}
                </h2>
                <button
                  onClick={onClose}
                  style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    cursor: 'pointer', color: 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18,
                  }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
                    Task Title *
                  </label>
                  <input
                    id="task-title-input"
                    className="input"
                    placeholder="What do you need to do?"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    autoFocus
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
                    Description <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
                  </label>
                  <textarea
                    id="task-description-input"
                    className="input"
                    placeholder="Add more details..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={3}
                    style={{ resize: 'vertical', minHeight: 80 }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
                      Date
                    </label>
                    <input
                      id="task-date-input"
                      type="date"
                      className="input"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
                      Time <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
                    </label>
                    <input
                      id="task-time-input"
                      type="time"
                      className="input"
                      value={startTime}
                      onChange={e => setStartTime(e.target.value)}
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={onClose}
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button
                    id="task-submit-btn"
                    type="submit"
                    className="btn-primary"
                    style={{ flex: 2 }}
                  >
                    {editingTask ? 'Save Changes' : '+ Add Task'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
