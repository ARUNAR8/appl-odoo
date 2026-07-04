import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import logo from '../../assets/logo/logo.png';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('employee@company.com'); // Autofilled for easy testing
  const [password, setPassword] = useState('employee123'); // Autofilled for easy testing
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email) newErrors.email = 'Email address is required';
    if (!password) newErrors.password = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await login(email, password);
      setIsLoading(false);
      navigate('/');
    } catch (error) {
      setIsLoading(false);
      setErrors({ form: error.message });
    }
  };

  const setTestCredentials = (role) => {
    if (role === 'admin') {
      setEmail('admin@company.com');
      setPassword('admin123');
    } else {
      setEmail('employee@company.com');
      setPassword('employee123');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <img src={logo} alt="HRMS Logo" className="auth-logo" />
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to your HR portal account</p>
        </div>

        {errors.form && (
          <div style={{ color: 'var(--danger)', marginBottom: '1.25rem', fontSize: '0.9rem', fontWeight: 500 }}>
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Email Address"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="18" height="18">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            }
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="18" height="18">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            }
          />

          <Button type="submit" variant="primary" size="lg" loading={isLoading} style={{ width: '100%', marginTop: '1rem' }}>
            Sign In
          </Button>
        </form>

        <div style={{ marginTop: '1.25rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Quick Test Login:</span>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            <Button size="sm" variant="outline" onClick={() => setTestCredentials('employee')}>Employee</Button>
            <Button size="sm" variant="outline" onClick={() => setTestCredentials('admin')}>Admin</Button>
          </div>
        </div>

        <div className="auth-footer">
          Don't have an account? 
          <span className="auth-link" onClick={() => navigate('/register')} style={{ cursor: 'pointer' }}>Register here</span>
        </div>
      </div>
    </div>
  );
}