import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';

export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const token = params.get('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Store token then fetch user profile
    localStorage.setItem('token', token);
    api.get('/auth/me')
      .then((res) => {
        setAuth(res.data, token);
        navigate('/');
      })
      .catch(() => {
        navigate('/login');
      });
  }, [params, navigate, setAuth]);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', flexDirection: 'column', gap: '16px'
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        border: '3px solid #7c3aed',
        borderTopColor: 'transparent',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: '#94a3b8', fontSize: 15 }}>Signing you in...</p>
    </div>
  );
}
