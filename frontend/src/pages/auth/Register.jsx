import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import logo from '../../assets/logo/logo.png';

export default function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [empId, setEmpId] = useState('');
  const [designation, setDesignation] = useState('Employee'); // 'Employee' or 'HR'
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (pass) => {
    // Min 8 characters, at least 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passRegex.test(pass);
  };

  const validateEmail = (mail) => {
    // Must be a valid email and end with @gmail.com
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return emailRegex.test(mail);
  };

  const validateEmployeeId = (id) => {
    // Exactly 7 characters: 2 alphabets followed by 5 numbers
    const idRegex = /^[A-Za-z]{2}\d{5}$/;
    return idRegex.test(id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!empId) {
      newErrors.empId = 'Employee ID is required';
    } else if (!validateEmployeeId(empId)) {
      newErrors.empId = 'Wrong Employee ID';
    }

    if (!name) {
      newErrors.name = 'Full name is required';
    }

    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Must be a valid Gmail ID (e.g. user@gmail.com)';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      // Map designation 'HR' -> role 'admin', 'Employee' -> role 'employee'
      const role = designation === 'HR' ? 'admin' : 'employee';
      await register({
        id: empId,
        name,
        email,
        password,
        role
      });
      setIsLoading(false);
      navigate('/');
    } catch (error) {
      setIsLoading(false);
      setErrors({ form: error.message });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <img src={logo} alt="HRMS Logo" className="auth-logo" />
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join your organization's HR ecosystem</p>
        </div>

        {errors.form && (
          <div style={{ color: 'var(--danger)', marginBottom: '1.25rem', fontSize: '0.9rem', fontWeight: 500 }}>
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Employee ID (2 Letters + 5 Numbers)"
            type="text"
            placeholder="e.g. EM12345"
            value={empId}
            onChange={(e) => setEmpId(e.target.value)}
            error={errors.empId}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="18" height="18">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
              </svg>
            }
          />

          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="18" height="18">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            }
          />

          <Input
            label="Gmail Address"
            type="text"
            placeholder="john@gmail.com"
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
            placeholder="Min 8 chars, A-z, 0-9, @..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="18" height="18">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            }
          />

          <div className="input-container">
            <label className="input-label">Designation</label>
            <div className="input-wrapper">
              <select
                className="input-field"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                style={{ paddingRight: '2rem' }}
              >
                <option value="Employee">Employee</option>
                <option value="HR">HR</option>
              </select>
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" loading={isLoading} style={{ width: '100%', marginTop: '1rem' }}>
            Register
          </Button>
        </form>

        <div className="auth-footer">
          Already have an account? 
          <span className="auth-link" onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>Login here</span>
        </div>
      </div>
    </div>
  );
}