import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin, type CMSPage } from '../context/AdminContext';

export default function AdminAddPagePage() {
  const { pages, setPages } = useAdmin();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('draft');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-_]/g, '');
    if (!cleanSlug) {
      setError('Slug is invalid. Use letters, numbers, hyphens, or underscores.');
      return;
    }

    if (pages.some((p) => p.slug === cleanSlug)) {
      setError('A page with this URL slug already exists.');
      return;
    }

    const newPage: CMSPage = {
      id: `pg-${Date.now()}`,
      title,
      slug: cleanSlug,
      content,
      status,
      lastUpdated: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      type: 'custom',
    };

    setPages([newPage, ...pages]);
    navigate(`/pages/${cleanSlug}`);
  };

  return (
    <div className="admin-page animate-fade-in">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Create New Page</h1>
          <p className="admin-page__desc">Publish a new informational page to your pharmacy website.</p>
        </div>
      </div>

      <div className="admin-settings-container">
        {error && (
          <div className="admin-alert admin-alert--danger animate-slide-down">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="admin-card">
          <div className="admin-card__body">
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form__field">
                <label className="admin-form__label">Page Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    // Auto-slugify
                    setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, ''));
                  }}
                  placeholder="e.g. Health & Safety Guidelines"
                  className="admin-form__input"
                  required
                />
              </div>

              <div className="admin-form__field">
                <label className="admin-form__label">URL Slug (Path)</label>
                <div className="admin-slug-input-wrap">
                  <span className="admin-slug-prefix">heartpharma.com/page/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="health-safety"
                    className="admin-form__input admin-slug-input"
                    required
                  />
                </div>
              </div>

              <div className="admin-form__field">
                <label className="admin-form__label">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                  className="admin-select"
                >
                  <option value="draft">Draft (Hidden from public)</option>
                  <option value="published">Published (Live instantly)</option>
                </select>
              </div>

              <div className="admin-form__field">
                <label className="admin-form__label">Page Content (HTML/Markdown)</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="<h2>Guidelines</h2><p>Write content here...</p>"
                  className="admin-form__textarea"
                  rows={15}
                  required
                />
              </div>

              <div className="admin-form__actions">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="admin-btn admin-btn--outline"
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn--primary">
                  Create Page
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
