import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import BackButton from '../components/BackButton';
import { useTransition } from '../context/TransitionContext';

type SuggestionType = 'product' | 'category' | 'search' | 'symptom';

interface Suggestion {
  id: string;
  type: SuggestionType;
  label: string;
  sublabel?: string;
  image?: string;
  to: string;
}

const TRENDING_SEARCHES = [
  'Vitamin C',
  'Paracetamol',
  'Cough Syrup',
  'Omega 3',
  'BP Monitor',
  'First Aid Kit',
  'Hand Sanitizer',
  'Multivitamin',
];

const QUICK_CATEGORIES = categories.filter(c => c.id !== 'all');

const RECENT_KEY = 'hp_recent_searches';

function getRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, 6) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(q: string) {
  if (!q.trim()) return;
  try {
    const recent = getRecentSearches();
    const filtered = [q, ...recent.filter((r) => r.toLowerCase() !== q.toLowerCase())].slice(0, 6);
    localStorage.setItem(RECENT_KEY, JSON.stringify(filtered));
  } catch {}
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { navigateWithSplash } = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
    // focus input
    setTimeout(() => inputRef.current?.focus(), 80);
  }, []);

  // keep URL in sync (debounced)
  useEffect(() => {
    const t = setTimeout(() => {
      if (query.trim()) {
        setSearchParams({ q: query }, { replace: true });
      } else if (searchParams.get('q')) {
        setSearchParams({}, { replace: true });
      }
    }, 240);
    return () => clearTimeout(t);
  }, [query, setSearchParams, searchParams]);

  // close suggestions on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Build suggestions
  const suggestions: Suggestion[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 1) return [];

    const results: Suggestion[] = [];

    // 1. Products (name, manufacturer)
    products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.manufacturer?.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
      .slice(0, 4)
      .forEach((p) => {
        results.push({
          id: 'p-' + p.id,
          type: 'product',
          label: p.name,
          sublabel: `₹${p.price} · ${p.category.replace('-', ' ')}`,
          image: p.image,
          to: `/product/${p.id}`,
        });
      });

    // 2. Categories
    categories
      .filter((c) => c.id !== 'all' && c.name.toLowerCase().includes(q))
      .slice(0, 2)
      .forEach((c) => {
        results.push({
          id: 'cat-' + c.id,
          type: 'category',
          label: c.name,
          sublabel: 'Browse category',
          to: `/products`,
        });
      });

    // 3. Symptom / use matches
    const symptomMatches = new Set<string>();
    products.forEach((p) => {
      p.uses.forEach((use) => {
        if (use.toLowerCase().includes(q) && symptomMatches.size < 3) {
          symptomMatches.add(use);
        }
      });
    });
    Array.from(symptomMatches).forEach((use, i) => {
      results.push({
        id: 'sym-' + i,
        type: 'symptom',
        label: use,
        sublabel: 'Search for this',
        to: `/products`,
      });
    });

    // 4. Generic search
    if (
      results.length === 0 ||
      !results.some((r) => r.label.toLowerCase() === q)
    ) {
      results.unshift({
        id: 'search-' + q,
        type: 'search',
        label: query,
        sublabel: 'Search all products',
        to: '/products',
      });
    }

    return results.slice(0, 8);
  }, [query]);

  // Filtered products for results grid
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.manufacturer?.toLowerCase().includes(q) ||
        p.uses.some((u) => u.toLowerCase().includes(q))
    );
  }, [query]);

  const handleSuggestionClick = (s: Suggestion) => {
    setShowSuggestions(false);
    if (s.type === 'product') {
      navigateWithSplash(s.to);
      return;
    }
    // For category / symptom / search, set the query and stay on search page
    if (s.type === 'search' || s.type === 'symptom') {
      setQuery(s.label);
      saveRecentSearch(s.label);
      inputRef.current?.blur();
      return;
    }
    // category
    navigate(s.to + `?cat=${s.label.toLowerCase()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter' && query.trim()) {
        saveRecentSearch(query.trim());
        setShowSuggestions(false);
        return;
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const s = suggestions[activeIndex];
      if (s) handleSuggestionClick(s);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const runSearch = (q: string) => {
    setQuery(q);
    saveRecentSearch(q);
    setRecentSearches(getRecentSearches());
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const clearRecent = () => {
    localStorage.removeItem(RECENT_KEY);
    setRecentSearches([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── HERO SEARCH ── */}
      <section className="bg-gradient-to-br from-primary via-teal-600 to-emerald-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-white blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 sm:pb-20">
          <BackButton
            label="Back"
            className="mb-6 !bg-white/10 !text-white !border-white/20 hover:!bg-white/20"
          />

          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
              Search Heart Pharma
            </h1>
            <p className="text-teal-100">
              Find medicines, vitamins, health devices & more — 10,000+ genuine products
            </p>
          </div>

          {/* ── Search box ── */}
          <div ref={wrapRef} className="relative max-w-2xl mx-auto">
            <div className={`relative group rounded-2xl transition-all duration-200 ${showSuggestions && suggestions.length > 0 ? 'ring-4 ring-white/20 shadow-2xl' : 'shadow-xl'}`}>
              <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                  setActiveIndex(0);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                placeholder="Search medicines, vitamins, health devices…"
                className="w-full pl-12 sm:pl-14 pr-12 sm:pr-14 py-4 sm:py-[18px] text-base rounded-2xl bg-white text-gray-800 placeholder-gray-400 shadow-lg focus:outline-none focus:ring-0"
              />
              {query ? (
                <button
                  onClick={() => {
                    setQuery('');
                    setShowSuggestions(false);
                    inputRef.current?.focus();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
                  aria-label="Clear search"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-300 tracking-wider hidden sm:block">⌘K</div>
              )}
            </div>

            {/* ── Suggestions dropdown ── */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-slide-down">
                <div className="py-2 max-h-[440px] overflow-y-auto">
                  {suggestions.map((s, idx) => (
                    <button
                      key={s.id}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => handleSuggestionClick(s)}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                        idx === activeIndex ? 'bg-teal-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      {/* icon / thumb */}
                      {s.type === 'product' && s.image ? (
                        <img
                          src={s.image}
                          alt=""
                          className="w-11 h-11 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                        />
                      ) : (
                        <div className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 text-lg ${
                          s.type === 'category'
                            ? 'bg-blue-50'
                            : s.type === 'symptom'
                            ? 'bg-amber-50'
                            : 'bg-gray-50'
                        }`}>
                          {s.type === 'category' ? '📂' : s.type === 'symptom' ? '🩺' : '🔍'}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-gray-800 truncate">{s.label}</p>
                        <p className="text-xs text-gray-500 truncate">{s.sublabel}</p>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 ${
                        s.type === 'product'
                          ? 'bg-green-50 text-green-700'
                          : s.type === 'category'
                          ? 'bg-blue-50 text-blue-700'
                          : s.type === 'symptom'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {s.type === 'product'
                          ? 'Product'
                          : s.type === 'category'
                          ? 'Category'
                          : s.type === 'symptom'
                          ? 'Symptom'
                          : 'Search'}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="border-t border-gray-100 px-4 py-2.5 text-[11px] text-gray-400 flex items-center justify-between bg-gray-50/70">
                  <span>↑↓ to navigate · Enter to select · Esc to close</span>
                  <span className="font-semibold text-primary">Heart Pharma</span>
                </div>
              </div>
            )}
          </div>

          {/* Trending chips (shown when query is empty) */}
          {!query.trim() && (
            <div className="max-w-2xl mx-auto mt-5 flex flex-wrap justify-center gap-2 animate-fade-in">
              <span className="text-xs text-teal-100 mr-1 font-semibold">Trending:</span>
              {TRENDING_SEARCHES.slice(0, 5).map((t) => (
                <button
                  key={t}
                  onClick={() => runSearch(t)}
                  className="bg-white/12 hover:bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/15 backdrop-blur-sm transition-all hover:-translate-y-0.5"
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── RESULTS / DISCOVERY ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {query.trim() ? (
          /* --- Search results --- */
          <div className="animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <p className="text-sm text-gray-500">
                {results.length > 0 ? (
                  <>
                    Found{' '}
                    <span className="font-extrabold text-gray-900">{results.length}</span>{' '}
                    {results.length === 1 ? 'result' : 'results'} for{' '}
                    <span className="font-bold text-primary">"{query}"</span>
                  </>
                ) : (
                  <>
                    No results for{' '}
                    <span className="font-bold text-gray-800">"{query}"</span>
                  </>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {TRENDING_SEARCHES.slice(0, 4).map((t) => (
                  <button
                    key={t}
                    onClick={() => runSearch(t)}
                    className="text-xs bg-white border border-gray-200 hover:border-primary/30 text-gray-600 hover:text-primary px-3 py-1.5 rounded-full font-semibold transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {results.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-sm">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-lg font-extrabold text-gray-900 mb-2">No products found</h3>
                <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                  Try different keywords, check your spelling, or browse our categories below.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {TRENDING_SEARCHES.slice(0, 6).map((t) => (
                    <button
                      key={t}
                      onClick={() => runSearch(t)}
                      className="text-xs bg-teal-50 border border-teal-100 text-primary px-3 py-1.5 rounded-full font-semibold hover:bg-teal-100 transition-colors"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* --- Discovery state (no query) --- */
          <div className="space-y-12 animate-fade-in">
            {/* Recent searches */}
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-extrabold text-gray-700 uppercase tracking-wider">
                    Recent Searches
                  </h2>
                  <button
                    onClick={clearRecent}
                    className="text-xs text-gray-400 hover:text-red-500 font-semibold transition-colors"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((r) => (
                    <button
                      key={r}
                      onClick={() => runSearch(r)}
                      className="inline-flex items-center gap-1.5 bg-white border border-gray-200 hover:border-primary/30 text-gray-700 hover:text-primary px-4 py-2 rounded-xl text-sm font-semibold shadow-sm hover:shadow transition-all"
                    >
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular searches */}
            <div>
              <h2 className="text-sm font-extrabold text-gray-700 uppercase tracking-wider mb-4">
                Popular Searches
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {TRENDING_SEARCHES.map((t) => (
                  <button
                    key={t}
                    onClick={() => runSearch(t)}
                    className="bg-white border border-gray-200 hover:border-primary/30 text-gray-700 hover:text-primary px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Browse by category */}
            <div>
              <h2 className="text-sm font-extrabold text-gray-700 uppercase tracking-wider mb-4">
                Browse by Category
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {QUICK_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => runSearch(cat.name.split(' ')[0])}
                    className="group bg-white border border-gray-100 hover:border-primary/30 rounded-2xl p-5 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</div>
                    <p className="text-xs font-bold text-gray-700 group-hover:text-primary transition-colors leading-tight">
                      {cat.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Trending products */}
            <div>
              <div className="flex items-end justify-between mb-4">
                <h2 className="text-sm font-extrabold text-gray-700 uppercase tracking-wider">
                  Trending Right Now
                </h2>
                <button
                  onClick={() => navigateWithSplash('/products')}
                  className="text-sm text-primary font-semibold hover:underline"
                >
                  View all →
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {products
                  .filter((p) => p.badge)
                  .slice(0, 4)
                  .map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} />
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
