import { useEffect, useRef } from 'react';
import { format, differenceInMinutes, parse } from 'date-fns';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';
import type { Task } from '../types';

export function useReminders() {
  const { user } = useAuthStore();
  const notifiedIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const playSound = () => {
      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.volume = 0.5;
        audio.play().catch(e => console.log('Audio playback blocked until user interaction'));
      } catch (e) {
        console.error('Failed to play alarm sound:', e);
      }
    };

    const checkReminders = async () => {
      try {
        const today = format(new Date(), 'yyyy-MM-dd');
        // Fetch today's tasks specifically for reminders
        const res = await api.get(`/tasks?date=${today}`);
        const tasks: Task[] = res.data;

        const now = new Date();
        let notifiedThisCheck = false;

        tasks.forEach(task => {
          // Skip if no time, completed, or already notified
          if (!task.startTime || task.isCompleted || notifiedIds.current.has(task.id)) return;

          try {
            // Parse HH:mm to a full Date object starting at today
            const taskTime = parse(task.startTime, 'HH:mm', new Date());
            const diff = differenceInMinutes(taskTime, now);

            // Notify if exactly 5 minutes left (between 4 and 6 to be safe with interval)
            if (diff > 0 && diff <= 5) {
              new Notification('Upcoming Task', {
                body: `"${task.title}" starts in 5 minutes!`,
                icon: '/favicon.svg',
              });
              notifiedIds.current.add(task.id);
              notifiedThisCheck = true;
            }
          } catch (e) {
            console.error('Failed to parse task time:', task.startTime);
          }
        });

        if (notifiedThisCheck) {
          playSound();
        }
      } catch (err) {
        console.error('Reminder check failed:', err);
      }
    };

    // Check once a minute
    const interval = setInterval(checkReminders, 60000);
    checkReminders(); // Initial check

    return () => clearInterval(interval);
  }, [user]);
}
