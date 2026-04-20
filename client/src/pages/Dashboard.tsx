import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';
import Header from '../components/Header';
import DateStrip from '../components/DateStrip';
import TaskCard from '../components/TaskCard';
import AddTaskModal from '../components/AddTaskModal';
import ProgressRing from '../components/ProgressRing';
import type { Task } from '../types';

export default function Dashboard() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const tasksKey = ['tasks', selectedDate];

  // Fetch tasks
  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: tasksKey,
    queryFn: async () => {
      const res = await api.get(`/tasks?date=${selectedDate}`);
      return res.data;
    },
  });

  // Create task
  const createMutation = useMutation({
    mutationFn: (data: { title: string; description: string; date: string }) =>
      api.post('/tasks', data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksKey });
      toast.success('Task added!');
    },
    onError: () => toast.error('Failed to add task'),
  });

  // Update task
  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: Partial<Task> & { id: string }) =>
      api.patch(`/tasks/${id}`, data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksKey });
    },
    onError: () => toast.error('Failed to update task'),
  });

  // Delete task
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksKey });
      toast.success('Task removed');
    },
    onError: () => toast.error('Failed to delete task'),
  });

  const handleToggle = (id: string, current: boolean) => {
    updateMutation.mutate({ id, isCompleted: !current });
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (data: { title: string; description: string; date: string }) => {
    if (editingTask) {
      updateMutation.mutate({ id: editingTask.id, ...data });
      toast.success('Task updated!');
      setEditingTask(null);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const completed = tasks.filter(t => t.isCompleted).length;
  const total = tasks.length;
  const isToday = selectedDate === format(new Date(), 'yyyy-MM-dd');
  const pendingTasks = tasks.filter(t => !t.isCompleted);
  const completedTasks = tasks.filter(t => t.isCompleted);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Header onAddTask={() => setIsModalOpen(true)} />

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '32px 16px' }}>
        {/* Greeting + Date */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 28 }}
        >
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
            {isToday ? (
              <>
                Good {getGreeting()},{' '}
                <span className="gradient-text">{user?.displayName?.split(' ')[0] || 'there'}</span> 👋
              </>
            ) : (
              <>
                Tasks for{' '}
                <span className="gradient-text">
                  {format(new Date(selectedDate + 'T00:00:00'), 'MMMM d')}
                </span>
              </>
            )}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            {isToday
              ? format(new Date(), 'EEEE, MMMM d, yyyy')
              : format(new Date(selectedDate + 'T00:00:00'), 'EEEE, MMMM d, yyyy')}
          </p>
        </motion.div>

        {/* Date Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: 28 }}
        >
          <DateStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        </motion.div>

        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="stats-card-container"
          style={{
            display: 'flex', alignItems: 'center', gap: 24,
            padding: '24px 28px', borderRadius: 20,
            background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(109,40,217,0.06))',
            border: '1px solid rgba(124,58,237,0.2)',
            marginBottom: 28,
          }}
        >
          <div className="stats-ring-wrapper">
             <ProgressRing total={total} completed={completed} size={110} />
          </div>

          <div style={{ flex: 1, width: '100%' }}>
            <div className="stats-info-grid" style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
              <div>
                <p className="stats-number" style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{total}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Total</p>
              </div>
              <div>
                <p className="stats-number" style={{ fontSize: 28, fontWeight: 800, color: '#10b981', lineHeight: 1 }}>{completed}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Done</p>
              </div>
              <div>
                <p className="stats-number" style={{ fontSize: 28, fontWeight: 800, color: '#a78bfa', lineHeight: 1 }}>{total - completed}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Left</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{
              height: 6, borderRadius: 3,
              background: 'rgba(255,255,255,0.08)',
              overflow: 'hidden',
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: total === 0 ? '0%' : `${(completed / total) * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{
                  height: '100%', borderRadius: 3,
                  background: completed === total && total > 0
                    ? 'linear-gradient(90deg, #10b981, #059669)'
                    : 'linear-gradient(90deg, #7c3aed, #a78bfa)',
                }}
              />
            </div>

            {total > 0 && completed === total && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ marginTop: 8, fontSize: 13, color: '#10b981', fontWeight: 600 }}
              >
                🎉 All done! Amazing work today!
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Tasks List */}
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton" style={{ height: 72 }} />
            ))}
          </div>
        ) : total === 0 ? (
          <EmptyState onAdd={() => setIsModalOpen(true)} isToday={isToday} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Pending Tasks */}
            {pendingTasks.length > 0 && (
              <section>
                <h3 style={{
                  fontSize: 12, fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.08em', color: 'var(--text-muted)',
                  marginBottom: 10,
                }}>
                  Pending · {pendingTasks.length}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <AnimatePresence>
                    {pendingTasks.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onToggle={handleToggle}
                        onDelete={(id) => deleteMutation.mutate(id)}
                        onEdit={handleEdit}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </section>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <section>
                <h3 style={{
                  fontSize: 12, fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.08em', color: 'var(--text-muted)',
                  marginBottom: 10,
                }}>
                  Completed · {completedTasks.length}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <AnimatePresence>
                    {completedTasks.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onToggle={handleToggle}
                        onDelete={(id) => deleteMutation.mutate(id)}
                        onEdit={handleEdit}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </section>
            )}
          </div>
        )}

        {/* FAB (mobile) */}
        <motion.button
          id="fab-add-task"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsModalOpen(true)}
          style={{
            position: 'fixed', bottom: 28, right: 28,
            width: 56, height: 56, borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            border: 'none', cursor: 'pointer', color: 'white',
            fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(124,58,237,0.5)',
          }}
        >
          +
        </motion.button>
      </main>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        selectedDate={selectedDate}
        editingTask={editingTask}
      />
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

function EmptyState({ onAdd, isToday }: { onAdd: () => void; isToday: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        textAlign: 'center', padding: '60px 24px',
        border: '1px dashed rgba(255,255,255,0.1)',
        borderRadius: 20,
      }}
    >
      <div style={{ fontSize: 52, marginBottom: 16 }}>
        {isToday ? '🎯' : '📅'}
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>
        {isToday ? 'No tasks for today' : 'No tasks on this day'}
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
        {isToday
          ? 'Start tracking your day by adding your first task'
          : 'No tasks were added for this date'}
      </p>
      <button className="btn-primary" onClick={onAdd} id="empty-add-task-btn">
        + Add Your First Task
      </button>
    </motion.div>
  );
}
