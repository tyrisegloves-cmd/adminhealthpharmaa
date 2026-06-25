import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdmin, type CMSPage } from '../context/AdminContext';

export default function AdminCMSPageEditor() {
  const { slug } = useParams<{ slug: string }>();
  const { pages, setPages } = useAdmin();
  const navigate = useNavigate();

  const currentPage = pages.find((p) => p.slug === slug);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('draft');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (currentPage) {
      setTitle(currentPage.title);
      setContent(currentPage.content);
      setStatus(currentPage.status);
    }
  }, [currentPage]);

  if (!currentPage) {
    return (
      <div className="admin-page text-center py-20">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Page Not Found</h2>
        <p className="text-gray-500 mb-6">The page you are trying to edit does not exist or has been deleted.</p>
        <button onClick={() => navigate('/')} className="admin-btn admin-btn--primary">Back to Dashboard</button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    const updated = pages.map((p) =>
      p.slug === slug
        ? {
            ...p,
            title,
            content,
            status,
            lastUpdated: new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
          }
        : p
    );

    setPages(updated);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
      setPages(pages.filter((p) => p.slug !== slug));
      navigate('/');
    }
  };

  return (
    <div className="admin-page animate-fade-in">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Edit Page: {currentPage.title}</h1>
          <p className="admin-page__desc">Update content for the path: <span className="admin-table__mono">/page/{slug}</span></p>
        </div>
        {currentPage.type === 'custom' && (
          <button onClick={handleDelete} className="admin-btn admin-btn--outline text-red-600 border-red-200 hover:bg-red-50">
            Delete Page
          </button>
        )}
      </div>

      <div className="admin-settings-container">
        {success && (
          <div className="admin-alert admin-alert--success animate-slide-down">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Page content updated successfully!</span>
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
                  onChange={(e) => setTitle(e.target.value)}
                  className="admin-form__input"
                  required
                />
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
                  className="admin-form__textarea"
                  rows={20}
                  required
                />
              </div>

              <div className="admin-form__actions">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="admin-btn admin-btn--outline"
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn--primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
