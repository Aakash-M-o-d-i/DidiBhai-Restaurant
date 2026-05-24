import React, { useState, useEffect } from 'react';

const API_BASE = '/g/a/n/e/s/h/ganeshdidibhai';

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isBlocked, setIsBlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(null);
  const [shakeKey, setShakeKey] = useState(0);

  // Check if IP is already blocked on mount
  useEffect(() => {
    checkBlockStatus();
  }, []);

  const checkBlockStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/status`);
      const data = await res.json();
      if (data.blocked) {
        setIsBlocked(true);
        setError('Access denied. Your IP has been blocked due to too many failed attempts. Contact admin to unblock.');
      }
    } catch (err) {
      // Server may not be up yet, ignore
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isBlocked || loading) return;

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      setShakeKey(k => k + 1);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password: password.trim() })
      });
      const data = await res.json();

      if (data.success) {
        // Store session token
        sessionStorage.setItem('adminToken', data.token);
        sessionStorage.setItem('adminLoginTime', Date.now().toString());
        onLoginSuccess(data.token);
      } else if (data.blocked) {
        setIsBlocked(true);
        setError('Access denied. Your IP has been blocked due to too many failed attempts. Contact admin to unblock.');
        setShakeKey(k => k + 1);
      } else {
        setAttemptsLeft(data.attemptsLeft);
        setError(data.message || 'Invalid credentials');
        setShakeKey(k => k + 1);
        setPassword('');
      }
    } catch (err) {
      setError('Server unavailable. Please try again later.');
      setShakeKey(k => k + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      {/* Animated background particles */}
      <div className="login-bg-particles">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`login-particle particle-${i + 1}`} />
        ))}
      </div>

      <div className="login-container">
        {/* Logo & Brand */}
        <div className="login-brand">
          <div className="login-logo-ring">
            <img src="/images/logo.jpg" alt="Didi-Bhai" className="login-logo-img" />
          </div>
          <h1 className="login-brand-title">DIDI-BHAI</h1>
          <p className="login-brand-subtitle">Admin Control Panel</p>
        </div>

        {/* Login Card */}
        <form
          className={`login-card ${isBlocked ? 'login-card-blocked' : ''}`}
          onSubmit={handleSubmit}
          key={shakeKey}
        >
          {/* Blocked state overlay */}
          {isBlocked && (
            <div className="login-blocked-overlay">
              <span className="material-symbols-outlined login-blocked-icon">gpp_bad</span>
              <h3>IP Blocked</h3>
              <p>Too many failed login attempts.<br />Contact the administrator to restore access.</p>
            </div>
          )}

          {!isBlocked && (
            <>
              <div className="login-card-header">
                <span className="material-symbols-outlined" style={{ fontSize: '28px', color: 'var(--color-primary-container)' }}>shield_lock</span>
                <h2>Sign In</h2>
                <p>Enter your credentials to access the admin panel</p>
              </div>

              {/* Error message */}
              {error && (
                <div className="login-error-banner shake-animation">
                  <span className="material-symbols-outlined">error</span>
                  <div>
                    <span>{error}</span>
                    {attemptsLeft !== null && attemptsLeft > 0 && (
                      <span className="login-attempts-left">{attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} remaining</span>
                    )}
                  </div>
                </div>
              )}

              {/* Username Field */}
              <div className="login-field">
                <label htmlFor="admin-username">Username</label>
                <div className="login-input-wrapper">
                  <span className="material-symbols-outlined login-input-icon">person</span>
                  <input
                    id="admin-username"
                    type="text"
                    placeholder="Enter admin username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    autoComplete="username"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="login-field">
                <label htmlFor="admin-password">Password</label>
                <div className="login-input-wrapper">
                  <span className="material-symbols-outlined login-input-icon">lock</span>
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="login-toggle-pw"
                    onClick={() => setShowPassword(v => !v)}
                    tabIndex={-1}
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="login-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="login-spinner" />
                ) : (
                  <>
                    <span className="material-symbols-outlined">login</span>
                    Sign In
                  </>
                )}
              </button>

              <p className="login-footer-note">
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>info</span>
                No password recovery available. Contact admin for credentials.
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
