import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import HeartLogo from '../../src/components/HeartLogo';

export default function AdminLoginPage() {
  const { adminLogin, isAdminLoggedIn } = useAdmin();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in
  if (isAdminLoggedIn) {
    navigate('/');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const success = adminLogin(email, password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid credentials. Try admin@heartpharma.com / admin123');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="admin-login">
      {/* Background decoration */}
      <div className="admin-login__bg">
        <div className="admin-login__bg-orb admin-login__bg-orb--1" />
        <div className="admin-login__bg-orb admin-login__bg-orb--2" />
        <div className="admin-login__bg-orb admin-login__bg-orb--3" />
        <div className="admin-login__bg-grid" />
      </div>

      <div className="admin-login__card animate-scale-in">
        {/* Logo Header */}
        <div className="admin-login__header">
          <HeartLogo size="lg" animate />
          <h1 className="admin-login__title">Admin Portal</h1>
          <p className="admin-login__subtitle">Heart Pharma Management System</p>
        </div>

        {/* Error */}
        {error && (
          <div className="admin-login__error animate-slide-down">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="admin-login__form">
          <div className="admin-login__field">
            <label className="admin-login__label">Email Address</label>
            <div className="admin-login__input-wrap">
              <svg className="admin-login__input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@heartpharma.com"
                required
                className="admin-login__input"
                id="admin-email"
              />
            </div>
          </div>

          <div className="admin-login__field">
            <label className="admin-login__label">Password</label>
            <div className="admin-login__input-wrap">
              <svg className="admin-login__input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="admin-login__input"
                id="admin-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="admin-login__eye"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.11 6.11m3.769 3.769a3.013 3.013 0 00-.097.166M6.11 6.11L3 3m3.11 3.11c1.24-.934 2.76-1.482 4.39-1.61m5.66 1.61A9.953 9.953 0 0121 12c-1.275 4.057-5.065 7-9.543 7-.837 0-1.65-.104-2.425-.3" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="admin-login__submit"
            id="admin-login-btn"
          >
            {loading ? (
              <div className="admin-login__spinner" />
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In to Dashboard
              </>
            )}
          </button>
        </form>

        {/* Demo credentials hint */}
        <div className="admin-login__hint">
          <div className="admin-login__hint-header">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Demo Credentials
          </div>
          <div className="admin-login__hint-creds">
            <span>admin@heartpharma.com</span>
            <span className="admin-login__hint-sep">•</span>
            <span>admin123</span>
          </div>
        </div>
      </div>
    </div>
  );
}
