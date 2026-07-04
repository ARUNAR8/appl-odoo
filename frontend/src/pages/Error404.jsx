import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

export default function Error404() {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '6rem', color: 'var(--primary)', marginBottom: '1rem', fontWeight: 800 }}>404</h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '480px' }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Button variant="primary" size="lg" onClick={() => navigate('/')}>
        Return to Safety
      </Button>
    </div>
  );
}