'use client';

import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import './LoginForm.scss';

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Small delay to prevent brute force attempts
    await new Promise(resolve => setTimeout(resolve, 500));

    const success = login(password);
    
    if (success) {
      if (onSuccess) {
        onSuccess();
      }
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Dashboard Access</h1>
          <p>Enter the password to access the consulting dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter dashboard password"
              className={error ? 'error' : ''}
              disabled={isLoading}
              autoFocus
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="login-btn"
            disabled={!password || isLoading}
          >
            {isLoading ? 'Verifying...' : 'Access Dashboard'}
          </button>
        </form>

        <div className="login-footer">
          <a href="/" className="back-link">← Back to Form</a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;