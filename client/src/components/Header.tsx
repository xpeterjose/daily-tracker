import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface HeaderProps {
  onAddTask: () => void;
}

export default function Header({ onAddTask }: HeaderProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Signed out successfully');
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="header-padding"
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px',
        background: 'rgba(13,17,32,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky', top: 0, zIndex: 40,
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(124,58,237,0.4)',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M9 11l3 3L22 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span style={{ fontSize: 17, fontWeight: 700 }} className="gradient-text mobile-hide">Daily Tracker</span>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <motion.button
          id="add-task-header-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddTask}
          className="mobile-btn-icon-only"
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 18px', borderRadius: 10,
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            border: 'none', cursor: 'pointer', color: 'white',
            fontSize: 14, fontWeight: 600,
            boxShadow: '0 4px 12px rgba(124,58,237,0.35)',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <span className="mobile-btn-text">Add Task</span>
        </motion.button>

        {/* User avatar + logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {user?.avatar && (
            <img
              src={user.avatar}
              alt={user.displayName}
              style={{
                width: 32, height: 32, borderRadius: '50%',
                border: '2px solid rgba(124,58,237,0.4)',
                objectFit: 'cover',
                flexShrink: 0,
              }}
            />
          )}
          <button
            id="logout-btn"
            onClick={handleLogout}
            style={{
              padding: '7px 14px', borderRadius: 10,
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.08)',
              cursor: 'pointer', color: 'var(--text-muted)',
              fontSize: 13, fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0.3)';
              (e.currentTarget as HTMLElement).style.color = '#ef4444';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
              (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
            }}
          >
            <span className="mobile-hide">Sign out</span>
            <span className="sm:hidden" style={{ display: 'none' /* Handled by CSS */ }}>
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
            </span>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
