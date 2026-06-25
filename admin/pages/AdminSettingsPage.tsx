import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';

export default function AdminSettingsPage() {
  const { adminSettings, setAdminSettings, admin } = useAdmin();
  const [form, setForm] = useState({ ...adminSettings });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setAdminSettings(form);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="admin-page animate-fade-in">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Personal Settings</h1>
          <p className="admin-page__desc">Configure your administrator profile and notification preferences.</p>
        </div>
      </div>

      <div className="admin-settings-container">
        {success && (
          <div className="admin-alert admin-alert--success animate-slide-down">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Settings saved successfully!</span>
          </div>
        )}

        <div className="admin-settings-grid">
          {/* Main Settings Form */}
          <div className="admin-card">
            <div className="admin-card__header">
              <h2 className="admin-card__title">Administrator Profile</h2>
            </div>
            <div className="admin-card__body">
              <form onSubmit={handleSubmit} className="admin-form">
                <div className="admin-form__field">
                  <label className="admin-form__label">Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="admin-form__input"
                    required
                  />
                </div>

                <div className="admin-form__field">
                  <label className="admin-form__label">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="admin-form__input"
                    required
                  />
                </div>

                <div className="admin-form__field">
                  <label className="admin-form__label">Phone Number</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="admin-form__input"
                    required
                  />
                </div>

                <div className="admin-form__divider" />

                <h3 className="admin-form__section-title">Notification Preferences</h3>
                <div className="admin-checkboxes">
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={form.notifyOrders}
                      onChange={(e) => setForm({ ...form, notifyOrders: e.target.checked })}
                      className="admin-checkbox"
                    />
                    <div>
                      <span className="admin-checkbox-text">New Order Placed</span>
                      <span className="admin-checkbox-desc">Receive email alerts for incoming orders</span>
                    </div>
                  </label>

                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={form.notifyUsers}
                      onChange={(e) => setForm({ ...form, notifyUsers: e.target.checked })}
                      className="admin-checkbox"
                    />
                    <div>
                      <span className="admin-checkbox-text">New User Registrations</span>
                      <span className="admin-checkbox-desc">Notify when a new customer signs up</span>
                    </div>
                  </label>

                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={form.notifyStock}
                      onChange={(e) => setForm({ ...form, notifyStock: e.target.checked })}
                      className="admin-checkbox"
                    />
                    <div>
                      <span className="admin-checkbox-text">Out of Stock Alerts</span>
                      <span className="admin-checkbox-desc">Daily summary of low/out-of-stock items</span>
                    </div>
                  </label>
                </div>

                <div className="admin-form__divider" />

                <h3 className="admin-form__section-title">Security Settings</h3>
                <div className="admin-checkboxes">
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={form.twoFactor}
                      onChange={(e) => setForm({ ...form, twoFactor: e.target.checked })}
                      className="admin-checkbox"
                    />
                    <div>
                      <span className="admin-checkbox-text">Two-Factor Authentication</span>
                      <span className="admin-checkbox-desc">Require verification code on admin sign in</span>
                    </div>
                  </label>
                </div>

                <div className="admin-form__actions">
                  <button type="submit" className="admin-btn admin-btn--primary">
                    Save Settings
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Account Details / Stats Panel */}
          <div className="admin-settings-side">
            <div className="admin-card admin-settings-profile-card">
              <div className="admin-card__body text-center">
                <div className="admin-settings-avatar">
                  {admin?.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2) || 'AD'}
                </div>
                <h3 className="admin-settings-name">{admin?.name}</h3>
                <p className="admin-settings-role">Super Administrator</p>
                <div className="admin-settings-meta">
                  <div className="admin-settings-meta-item">
                    <span>Role ID</span>
                    <span className="admin-table__mono">{admin?.id}</span>
                  </div>
                  <div className="admin-settings-meta-item">
                    <span>Joined</span>
                    <span>{admin?.joinedDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
