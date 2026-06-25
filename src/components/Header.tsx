import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTransition } from '../context/TransitionContext';
import AnimatedPress from './AnimatedPress';
import HeartLogo from './HeartLogo';

function formatTime(date: Date) {
  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(formatTime(new Date()));
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoggedIn, logout, cartCount } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { navigateWithSplash } = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/products', label: 'Products', icon: '💊' },
    { to: '/about', label: 'About', icon: 'ℹ️' },
    { to: '/contact', label: 'Contact', icon: '📞' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const interval = window.setInterval(() => setCurrentTime(formatTime(new Date())), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[72px] gap-3">

          {/* ── Logo ── */}
          <AnimatedPress onClick={() => navigate('/')} className="flex items-center gap-2 group min-w-0 rounded-xl">
            <HeartLogo size="md" className="group-hover:animate-heartbeat transition-transform flex-shrink-0" />
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-lg sm:text-xl font-extrabold text-primary tracking-tight truncate">Heart Pharma</span>
              <span className="text-[10px] text-teal-500 font-medium -mt-0.5 tracking-wider truncate">YOUR HEALTH, OUR HEARTBEAT</span>
            </div>
          </AnimatedPress>

          {/* ── Desktop Navigation ── */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <AnimatedPress
                key={link.to}
                onClick={() => navigate(link.to)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive(link.to)
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-gray-600 hover:text-primary hover:bg-teal-50'
                }`}
              >
                {link.label}
              </AnimatedPress>
            ))}
          </nav>

          {/* ── Right side ── */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Live time badge */}
            <div className="hidden lg:flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-gray-500 uppercase tracking-wide">Live</span>
              <span className="font-bold text-gray-800">{currentTime}</span>
            </div>

            {/* Theme toggle */}
            <AnimatedPress
              onClick={toggleTheme}
              className={`group flex items-center justify-center rounded-xl border px-3 py-2 text-sm font-semibold transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-indigo-950 to-slate-900 text-amber-300 border-indigo-800/60 shadow-md shadow-indigo-500/10'
                  : 'bg-gradient-to-r from-sky-50 to-amber-50 text-slate-700 border-amber-200/80 shadow-sm'
              }`}
            >
              <span className="hidden sm:inline-flex items-center gap-2">
                {theme === 'light' ? (
                  <>
                    <svg className="w-4 h-4 text-indigo-400 group-hover:rotate-[-20deg] transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 1012 21a8.96 8.96 0 008.354-5.646z" />
                    </svg>
                    <span className="text-slate-600">Dark</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2.25m0 13.5V21m9-9h-2.25M5.25 12H3m15.364 6.364l-1.591-1.591M7.227 7.227 5.636 5.636m12.728 0-1.591 1.591M7.227 16.773l-1.591 1.591M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-amber-200">Light</span>
                  </>
                )}
              </span>
              <span className="sm:hidden text-base">{theme === 'light' ? '🌙' : '☀️'}</span>
            </AnimatedPress>

            {/* Search (desktop) */}
            <AnimatedPress
              onClick={() => navigateWithSplash('/search')}
              className="hidden xl:flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-sm">Search…</span>
              <span className="ml-1 text-[10px] bg-white border border-gray-200 rounded px-1.5 py-0.5 text-gray-400 font-bold">⌘K</span>
            </AnimatedPress>

            {/* Cart icon */}
            {isLoggedIn && (
              <AnimatedPress
                onClick={() => navigate('/cart')}
                className="relative p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-teal-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-scale-in">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </AnimatedPress>
            )}

            {/* Auth area */}
            {isLoggedIn ? (
              <button
                onClick={() => logout()}
                className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm border border-gray-200 hover:border-gray-300"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            ) : (
              /* Sign In — NO animation wrapper, per requirement */
              <button
                onClick={() => navigateWithSplash('/auth')}
                className="flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden sm:inline">Sign In</span>
                <span className="sm:hidden">Login</span>
              </button>
            )}

            {/* Mobile menu button */}
            <AnimatedPress
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-teal-50 transition-colors"
            >
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </AnimatedPress>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-slide-down">
          <div className="px-4 py-3 space-y-1">

            {/* Search (mobile) */}
            <AnimatedPress
              onClick={() => { setMenuOpen(false); navigateWithSplash('/search'); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 bg-gray-50 border border-gray-100 hover:border-primary/30 hover:text-primary transition-all mb-2"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search products…</span>
              <span className="ml-auto text-[10px] text-gray-400">⌘K</span>
            </AnimatedPress>

            {/* Time + Theme row */}
            <div className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 mb-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                <span>{currentTime}</span>
              </div>
              <AnimatedPress
                onClick={toggleTheme}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-indigo-950 to-slate-900 text-amber-300 border border-indigo-800/60'
                    : 'bg-gradient-to-r from-sky-50 to-amber-50 text-slate-600 border border-amber-200/80'
                }`}
              >
                {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
              </AnimatedPress>
            </div>

            {/* Nav links (mobile) */}
            {navLinks.map((link) => (
              <AnimatedPress
                key={link.to}
                onClick={() => { setMenuOpen(false); navigate(link.to); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive(link.to)
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:text-primary hover:bg-teal-50'
                }`}
              >
                <span className="text-base">{link.icon}</span>
                {link.label}
              </AnimatedPress>
            ))}

            {/* Auth / Profile section */}
            <div className="border-t border-gray-100 pt-2 mt-2">
              {isLoggedIn ? (
                <>
                  <AnimatedPress
                    onClick={() => { setMenuOpen(false); navigate('/profile'); }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:text-primary hover:bg-teal-50 transition-all"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center text-white text-[10px] font-bold">{initials}</div>
                    My Profile
                  </AnimatedPress>
                  <AnimatedPress
                    onClick={() => { setMenuOpen(false); navigate('/cart'); }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:text-primary hover:bg-teal-50 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                    My Cart
                    {cartCount > 0 && (
                      <span className="ml-auto bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">{cartCount}</span>
                    )}
                  </AnimatedPress>
                  {/* Sign Out — NO animation */}
                  <button
                    onClick={() => { logout(); setMenuOpen(false); }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all w-full"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </>
              ) : (
                /* Sign In (mobile) — NO animation */
                <button
                  onClick={() => { setMenuOpen(false); navigateWithSplash('/auth'); }}
                  className="block w-full px-4 py-3 rounded-xl text-sm font-semibold text-primary bg-teal-50 hover:bg-teal-100 transition-all text-center"
                >
                  Sign In / Sign Up
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
