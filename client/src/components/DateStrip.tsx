import { format, addDays, subDays, isSameDay, parseISO } from 'date-fns';
import { motion } from 'framer-motion';

interface DateStripProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export default function DateStrip({ selectedDate, onSelectDate }: DateStripProps) {
  const today = new Date();
  const selected = parseISO(selectedDate);

  // Show 7 days: 3 before today, today, 3 after
  const days = Array.from({ length: 7 }, (_, i) => addDays(subDays(today, 3), i));

  return (
    <div style={{
      display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center',
      flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: 4,
    }}>
      {days.map((day, idx) => {
        const isSelected = isSameDay(day, selected);
        const isToday = isSameDay(day, today);
        const dateStr = format(day, 'yyyy-MM-dd');

        return (
          <motion.button
            key={idx}
            id={`date-${dateStr}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectDate(dateStr)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '10px 14px', borderRadius: 14, cursor: 'pointer',
              border: isSelected ? '1px solid #7c3aed' : '1px solid rgba(255,255,255,0.08)',
              background: isSelected
                ? 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(109,40,217,0.2))'
                : 'rgba(255,255,255,0.03)',
              minWidth: 60,
              boxShadow: isSelected ? '0 4px 20px rgba(124,58,237,0.3)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{
              fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: isSelected ? '#a78bfa' : 'var(--text-muted)',
              marginBottom: 4,
            }}>
              {format(day, 'EEE')}
            </span>
            <span style={{
              fontSize: 18, fontWeight: 700,
              color: isSelected ? '#a78bfa' : isToday ? 'var(--text-primary)' : 'var(--text-secondary)',
            }}>
              {format(day, 'd')}
            </span>
            {isToday && (
              <div style={{
                width: 4, height: 4, borderRadius: '50%',
                background: isSelected ? '#a78bfa' : '#7c3aed',
                marginTop: 4,
              }} />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
