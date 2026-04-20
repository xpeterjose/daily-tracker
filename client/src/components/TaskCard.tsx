import { motion, AnimatePresence } from 'framer-motion';
import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export default function TaskCard({ task, onToggle, onDelete, onEdit }: TaskCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
      whileHover={{ scale: 1.005 }}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 14,
        padding: '16px 18px',
        borderRadius: 16,
        background: task.isCompleted
          ? 'rgba(16,185,129,0.04)'
          : 'rgba(255,255,255,0.04)',
        border: task.isCompleted
          ? '1px solid rgba(16,185,129,0.15)'
          : '1px solid rgba(255,255,255,0.08)',
        cursor: 'default',
        transition: 'all 0.25s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Completion glow line */}
      <AnimatePresence>
        {task.isCompleted && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              width: 3, background: 'linear-gradient(180deg, #10b981, #059669)',
              transformOrigin: 'top',
            }}
          />
        )}
      </AnimatePresence>

      {/* Checkbox */}
      <button
        id={`task-toggle-${task.id}`}
        onClick={() => onToggle(task.id, task.isCompleted)}
        className={`checkbox-custom ${task.isCompleted ? 'checked' : ''}`}
        style={{ marginTop: 2 }}
      >
        <AnimatePresence>
          {task.isCompleted && (
            <motion.svg
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              width="13" height="13" viewBox="0 0 24 24" fill="none"
            >
              <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </motion.svg>
          )}
        </AnimatePresence>
      </button>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: task.description ? 4 : 0 }}>
          {task.startTime && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '2px 8px', borderRadius: 6,
              background: 'rgba(124,58,237,0.1)',
              border: '1px solid rgba(124,58,237,0.2)',
              fontSize: 11, fontWeight: 700, color: '#a78bfa',
              flexShrink: 0,
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              {task.startTime}
            </div>
          )}
          <motion.p
            layout
            style={{
              fontSize: 15, fontWeight: 600,
              color: task.isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
              textDecoration: task.isCompleted ? 'line-through' : 'none',
              wordBreak: 'break-word',
              transition: 'all 0.3s ease',
            }}
          >
            {task.title}
          </motion.p>
        </div>
        {task.description && (
          <p style={{
            fontSize: 13, color: 'var(--text-muted)',
            lineHeight: 1.5, wordBreak: 'break-word',
          }}>
            {task.description}
          </p>
        )}
        {task.isCompleted && task.completedAt && (
          <p style={{ fontSize: 11, color: '#10b981', marginTop: 4 }}>
            ✓ Completed {new Date(task.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <button
          id={`task-edit-${task.id}`}
          onClick={() => onEdit(task)}
          style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.08)',
            cursor: 'pointer', color: 'var(--text-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.4)';
            (e.currentTarget as HTMLElement).style.color = '#a78bfa';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
            (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <button
          id={`task-delete-${task.id}`}
          onClick={() => onDelete(task.id)}
          style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.08)',
            cursor: 'pointer', color: 'var(--text-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0.4)';
            (e.currentTarget as HTMLElement).style.color = '#ef4444';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
            (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </motion.div>
  );
}
